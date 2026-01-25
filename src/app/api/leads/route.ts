import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { sendTelegramNotification } from '@/utils/telegram';
import type { Lead } from '@/utils/telegram';

interface SimpleLeadRequest {
  type: 'simple';
  name: string;
  contact: string;
  message?: string;
  source?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

interface CalculatorLeadRequest {
  type: 'calculator';
  name: string;
  contact: string;
  message?: string;
  source?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
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

/**
 * Валідація email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валідація телефону (український формат)
 */
function isValidPhone(phone: string): boolean {
  // Видаляємо всі не-цифри
  const digits = phone.replace(/\D/g, '');
  // Український номер: 10-12 цифр (з кодом країни або без)
  return digits.length >= 10 && digits.length <= 13;
}

/**
 * Валідація контакту (email АБО телефон)
 */
function isValidContact(contact: string): boolean {
  return isValidEmail(contact) || isValidPhone(contact);
}

/**
 * POST /api/leads - Створення нової заявки
 */
export async function POST(request: NextRequest) {
  try {
    const body: LeadRequest = await request.json();

    // Базова валідація
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

    // Валідація даних калькулятора
    if (body.type === 'calculator') {
      const calcData = (body as CalculatorLeadRequest).calculatorData;
      if (!calcData || !calcData.projectType || !calcData.platform) {
        return NextResponse.json(
          { success: false, error: 'Неповні дані калькулятора' },
          { status: 400 }
        );
      }
    }

    // Отримуємо Payload instance
    const payload = await getPayload({ config });

    // Створюємо запис в базі даних
    const leadData: Record<string, unknown> = {
      name: body.name.trim(),
      contact: body.contact.trim(),
      message: body.message?.trim() || undefined,
      type: body.type,
      source: body.source || undefined,
      utm: body.utm || undefined,
      status: 'new',
    };

    // Додаємо дані калькулятора якщо є
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lead = await payload.create({
      collection: 'leads',
      data: leadData as any,
    });

    // Відправляємо повідомлення в Telegram
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

    // Відправляємо в Telegram асинхронно (не блокуємо відповідь)
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
