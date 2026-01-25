/**
 * Client-side API for submitting leads
 */

interface SimpleLeadData {
  type: 'simple';
  name: string;
  contact: string;
  message?: string;
}

interface CalculatorLeadData {
  type: 'calculator';
  name: string;
  contact: string;
  message?: string;
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

type LeadData = SimpleLeadData | CalculatorLeadData;

interface LeadResponse {
  success: boolean;
  message?: string;
  error?: string;
  id?: number;
}

/**
 * Отримує UTM параметри з URL
 */
function getUtmParams(): Record<string, string> | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utm[key.replace('utm_', '')] = value;
    }
  });

  return Object.keys(utm).length > 0 ? utm : undefined;
}

/**
 * Отримує поточний URL сторінки
 */
function getCurrentSource(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

/**
 * Відправляє заявку на сервер
 */
export async function submitLead(data: LeadData): Promise<LeadResponse> {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        source: getCurrentSource(),
        utm: getUtmParams(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Помилка відправки заявки',
      };
    }

    return {
      success: true,
      message: result.message,
      id: result.id,
    };
  } catch (error) {
    console.error('Error submitting lead:', error);
    return {
      success: false,
      error: 'Не вдалося відправити заявку. Перевірте підключення до інтернету.',
    };
  }
}

/**
 * Валідація email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валідація телефону
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

/**
 * Валідація контакту (email або телефон)
 */
export function isValidContact(contact: string): boolean {
  return isValidEmail(contact) || isValidPhone(contact);
}

export type { LeadData, SimpleLeadData, CalculatorLeadData, LeadResponse };
