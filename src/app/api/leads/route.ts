import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import type { DataFromCollectionSlug } from 'payload';
import config from '@payload-config';
import { sendTelegramNotification } from '@/utils/telegram';
import type { Lead } from '@/utils/telegram';

// In-memory rate limiter (5 requests / IP / 60s)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW = 60_000;
const RATE_MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

interface SimpleLeadRequest {
  type: 'simple';
  name: string;
  contact: string;
  message?: string;
  source?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

interface CalculatorLeadRequest {
  type: 'calculator';
  name: string;
  contact: string;
  message?: string;
  source?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  calculatorData: {
    projectType: string;
    projectTypeName?: string;
    platform: 'weblium' | 'custom';
    pagesCount: number;
    additionalServices: string[];
    additionalServicesNames?: string[];
    urgency: string;
    urgencyName?: string;
    estimatedPrice: number;
    estimatedTimeline?: string;
  };
}

type LeadRequest = SimpleLeadRequest | CalculatorLeadRequest;

type LeadStatus = 'new' | 'in_progress' | 'done';

interface LeadCreateData {
  name: string;
  contact: string;
  message?: string;
  type: 'simple' | 'calculator';
  source?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
  status: LeadStatus;
  calculatorData?: {
    projectType: string;
    platform: 'weblium' | 'custom';
    pagesCount: number;
    additionalServices: string[];
    urgency: string;
    estimatedPrice: number;
    estimatedTimeline?: string;
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 320;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

function isValidContact(contact: string): boolean {
  return isValidEmail(contact) || isValidPhone(contact);
}

export async function POST(request: NextRequest) {
  // Origin check — allow only same-site requests
  const origin = request.headers.get('origin');
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (origin && serverUrl && !origin.startsWith(serverUrl)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Забагато запитів. Спробуйте через хвилину.' },
      { status: 429 }
    );
  }

  try {
    const body: LeadRequest = await request.json();

    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Ім'я повинно містити мінімум 2 символи" },
        { status: 400 }
      );
    }

    if (!body.contact || !isValidContact(body.contact)) {
      return NextResponse.json(
        { success: false, error: 'Введіть коректний телефон або email' },
        { status: 400 }
      );
    }

    if (!body.type || !['simple', 'calculator'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Невірний тип заявки' },
        { status: 400 }
      );
    }

    if (body.type === 'calculator') {
      const calcData = (body as CalculatorLeadRequest).calculatorData;
      if (!calcData || !calcData.projectType || !calcData.platform) {
        return NextResponse.json(
          { success: false, error: 'Неповні дані калькулятора' },
          { status: 400 }
        );
      }
    }

    const leadData: LeadCreateData = {
      name: body.name.trim(),
      contact: body.contact.trim(),
      message: body.message?.trim() || undefined,
      type: body.type,
      source: body.source || undefined,
      utm: body.utm || undefined,
      status: 'new',
    };

    if (body.type === 'calculator') {
      const calcBody = body as CalculatorLeadRequest;
      leadData.calculatorData = {
        projectType: calcBody.calculatorData.projectType,
        platform: calcBody.calculatorData.platform,
        pagesCount: calcBody.calculatorData.pagesCount,
        additionalServices: calcBody.calculatorData.additionalServices,
        urgency: calcBody.calculatorData.urgency,
        estimatedPrice: calcBody.calculatorData.estimatedPrice,
        estimatedTimeline: calcBody.calculatorData.estimatedTimeline || undefined,
      };
    }

    const payload = await getPayload({ config });

    const lead = await payload.create({
      collection: 'leads',
      data: leadData as unknown as DataFromCollectionSlug<'leads'>,
    });

    const telegramData: Lead = body.type === 'calculator'
      ? {
          type: 'calculator',
          name: body.name,
          contact: body.contact,
          message: body.message,
          source: body.source,
          calculatorData: (body as CalculatorLeadRequest).calculatorData,
        }
      : {
          type: 'simple',
          name: body.name,
          contact: body.contact,
          message: body.message,
          source: body.source,
        };

    sendTelegramNotification(telegramData).catch((err) => {
      console.error('Telegram notification failed:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Заявка успішно відправлена',
      id: lead.id,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
