interface TelegramResponse {
	// Define response structure if known
	[key: string]: any;
}

interface SendMessageRequest {
	message: string;
}

const sendMessageTG = async (message: string): Promise<void> => {
	try {
		const response = await fetch('/api/send-telegram', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message
			} as SendMessageRequest),
		});

		const data: TelegramResponse = await response.json();

		if (!response.ok) throw new Error("❌ Помилка надсилання...")
		console.log('✅ Повідомлення успішно надіслано!');
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		} else {
			console.log('An unknown error occurred');
		}
	}
}

export default sendMessageTG
