import { Link } from '@/client/i18n/navigation';

export default async function NotFound({ params }: { params?: { locale?: string } }) {
	// Обережний підхід з перевіркою, чи params існує
	let locale = 'ua';

	if (params) {
		try {
			const paramsData = await params;
			locale = paramsData.locale || 'ua';
		} catch (e) {
			// Якщо виникла помилка, залишаємо дефолтну локаль
			console.error('Error accessing params:', e);
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<h1 className="text-4xl font-bold mb-4">
				{locale === 'ua' ? '404 - Сторінку не знайдено' : '404 - Page Not Found'}
			</h1>
			<p className="mb-4">
				{locale === 'ua'
					? 'Вибачте, сторінку, яку ви шукаєте, не існує.'
					: 'Sorry, the page you are looking for does not exist.'}
			</p>
			<Link href="/" className="text-blue-500 hover:underline">
				{locale === 'ua' ? 'Повернутися на головну' : 'Return to homepage'}
			</Link>
		</div>
	);
}