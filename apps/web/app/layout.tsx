import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getLocale } from "@/lib/i18n";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";
import { I18nProvider } from "@/lib/useTranslation";

const inter = Inter({ subsets: ["latin"] });

const allMessages: Record<string, object> = { en, zh };

export const metadata: Metadata = {
  title: "Learn Chinese Pinyin & Typing | 学习中文拼音与打字",
  description:
    "Master Mandarin pronunciation and Chinese input methods with step-by-step video lessons. Perfect for beginners worldwide.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = allMessages[locale] || allMessages.en;

  return (
    <html lang={locale}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E7THQTVJ6V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E7THQTVJ6V');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
