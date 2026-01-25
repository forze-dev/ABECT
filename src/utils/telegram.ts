/**
 * Telegram Bot Notification Utility
 * Відправляє повідомлення про нові заявки в Telegram чат
 */

interface SimpleLead {
  type: 'simple';
  name: string;
  contact: string;
  message?: string;
  source?: string;
}

interface CalculatorLead {
  type: 'calculator';
  name: string;
  contact: string;
  message?: string;
  source?: string;
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

type Lead = SimpleLead | CalculatorLead;

/**
 * Форматує повідомлення для простої форми
 */
function formatSimpleMessage(lead: SimpleLead): string {
  const timestamp = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kiev',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `🔔 *Нова заявка з сайту!*

👤 *Ім'я:* ${escapeMarkdown(lead.name)}
📞 *Контакт:* ${escapeMarkdown(lead.contact)}
${lead.message ? `💬 *Коментар:* ${escapeMarkdown(lead.message)}` : ''}

📍 *Сторінка:* ${lead.source || 'Невідомо'}
🕐 *Час:* ${timestamp}`;
}

/**
 * Форматує повідомлення для калькулятора
 */
function formatCalculatorMessage(lead: CalculatorLead): string {
  const timestamp = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kiev',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const { calculatorData } = lead;

  const servicesText = calculatorData.additionalServicesNames?.length
    ? calculatorData.additionalServicesNames.join(', ')
    : calculatorData.additionalServices.join(', ') || 'Немає';

  const platformText = calculatorData.platform === 'weblium' ? 'Weblium' : 'Custom';

  return `🧮 *Нова заявка з калькулятора!*

👤 *Ім'я:* ${escapeMarkdown(lead.name)}
📞 *Контакт:* ${escapeMarkdown(lead.contact)}

📋 *Деталі проекту:*
• *Тип:* ${escapeMarkdown(calculatorData.projectTypeName || calculatorData.projectType)}
• *Платформа:* ${platformText}
• *Сторінок:* ${calculatorData.pagesCount}
• *Додатково:* ${escapeMarkdown(servicesText)}
• *Терміни:* ${escapeMarkdown(calculatorData.urgencyName || calculatorData.urgency)}

💰 *Розрахункова вартість:* від ${calculatorData.estimatedPrice.toLocaleString('uk-UA')} грн
${calculatorData.estimatedTimeline ? `⏱ *Термін:* ${escapeMarkdown(calculatorData.estimatedTimeline)}` : ''}

${lead.message ? `💬 *Коментар:* ${escapeMarkdown(lead.message)}` : ''}

📍 *Сторінка:* ${lead.source || '/calculator'}
🕐 *Час:* ${timestamp}`;
}

/**
 * Екранує спеціальні символи для Telegram MarkdownV2
 */
function escapeMarkdown(text: string): string {
  if (!text) return '';
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

/**
 * Відправляє повідомлення в Telegram
 */
export async function sendTelegramNotification(lead: Lead): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const threadId = process.env.TELEGRAM_THREAD_ID

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured');
    return false;
  }

  const message = lead.type === 'calculator'
    ? formatCalculatorMessage(lead as CalculatorLead)
    : formatSimpleMessage(lead as SimpleLead);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_thread_id: threadId,
          text: message,
          parse_mode: 'MarkdownV2',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);

      // Спробувати без форматування якщо помилка парсингу
      if (error.description?.includes('parse')) {
        const plainResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message.replace(/[*_`]/g, ''),
            }),
          }
        );
        return plainResponse.ok;
      }

      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

export type { Lead, SimpleLead, CalculatorLead };
