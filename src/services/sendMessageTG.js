const sendMessageTG = async (message) => {
	try {
		const response = await fetch('/api/send-telegram', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message
			}),
		});

		const data = await response.json();

		if (!response.ok) throw new Error("❌ Помилка надсилання...")
		console.log('✅ Повідомлення успішно надіслано!');
	} catch (error) {
		console.log(error.message);
	}
}

export default sendMessageTG
