export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Метод не дозволено, використовуйте POST' });
	}

	try {
		const { message } = req.body;

		if (!message) {
			return res.status(400).json({ error: 'Повідомлення обов\'язкове' });
		}

		// Константи для чату ABECT Dev портал і вітки "Заявки з сайту"
		// Можна перевизначити через параметри запиту
		const CHAT_ID = process.env.TELEGRAM_CHAT_ID;  // ID чату [ABECT] Dev портал
		const THREAD_ID = process.env.THREAD_ID;        // ID вітки "Заявки з сайту"
		const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

		if (!BOT_TOKEN) {
			return res.status(500).json({ error: 'Відсутній токен Telegram бота' });
		}

		const telegramResponse = await fetch(
			`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: CHAT_ID,
					message_thread_id: THREAD_ID, // Вказуємо ID вітки
					text: message,
					parse_mode: 'HTML', // Підтримка HTML форматування
				}),
			}
		);

		const responseData = await telegramResponse.json();

		if (!responseData.ok) {
			throw new Error(`Telegram API помилка: ${JSON.stringify(responseData)}`);
		}

		// Повертаємо успішну відповідь
		return res.status(200).json({
			success: true,
			message: 'Повідомлення успішно надіслано у вітку Telegram',
			telegramResponse: responseData
		});
	} catch (error) {
		console.error('Помилка відправки повідомлення в Telegram:', error);

		return res.status(500).json({
			error: 'Не вдалося надіслати повідомлення в Telegram',
			details: error.message
		});
	}
}