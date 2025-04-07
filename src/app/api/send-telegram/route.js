export async function POST(req) {
	try {
		const body = await req.json();
		const { message } = body;

		if (!message) {
			return new Response(JSON.stringify({ error: "Повідомлення обов'язкове" }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		console.log(message);

		const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
		const THREAD_ID = process.env.THREAD_ID;
		const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

		if (!CHAT_ID || !THREAD_ID || !BOT_TOKEN) {
			return new Response(JSON.stringify({ error: 'Невистачає конфігурації Telegram' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
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
					message_thread_id: THREAD_ID,
					text: message,
					parse_mode: 'HTML',
				}),
			}
		);

		const responseData = await telegramResponse.json();

		if (!responseData.ok) {
			console.error('Telegram API помилка:', responseData);
			return new Response(JSON.stringify({
				error: 'Помилка Telegram',
				details: responseData,
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({
			success: true,
			message: 'Повідомлення успішно надіслано у вітку Telegram',
			telegramResponse: responseData,
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Помилка відправки повідомлення в Telegram:', error);
		return new Response(JSON.stringify({
			error: 'Не вдалося надіслати повідомлення в Telegram',
			details: error.message,
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
