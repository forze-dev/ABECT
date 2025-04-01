// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Явно вказуємо шлях до файлу конфігурації
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);