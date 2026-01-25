import type { ReactNode, JSX } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/client/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Victor_Mono } from "next/font/google";
import Header from "@/client/components/Header/Header";
import Footer from "@/client/components/Footer/Footer";
import StarsBackground from "@/client/components/StarsBackground/StarsBackground";
import { ModalProvider } from "@/client/providers/ModalProvider";

import "./globals.scss";

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["cyrillic", "latin"],
});

export function generateStaticParams(): { locale: string }[] {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../../../messages/${locale}.json`))
    .default as Record<string, string>;

  return (
    <html lang={locale}>
      <body className={victorMono.variable}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ModalProvider>
            <Header />
            {children}
            <Footer />
            <StarsBackground />
          </ModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
