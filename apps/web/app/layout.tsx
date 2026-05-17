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
  title: {
    default: "Learn Chinese Pinyin & Typing | Online Course for Beginners",
    template: "%s | CourseShop",
  },
  description:
    "Master Mandarin pronunciation and Chinese input methods with 30+ step-by-step video lessons. Perfect for beginners worldwide. Lifetime access, learn at your own pace.",
  keywords: [
    "learn chinese",
    "chinese pinyin",
    "mandarin pronunciation",
    "chinese typing",
    "chinese input method",
    "learn mandarin",
    "pinyin course",
    "chinese for beginners",
  ],
  openGraph: {
    title: "Learn Chinese Pinyin & Typing | CourseShop",
    description:
      "Master Mandarin pronunciation and Chinese input methods with 30+ step-by-step video lessons. Perfect for beginners worldwide.",
    url: "https://www.ziiy.fun",
    siteName: "CourseShop",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Chinese Pinyin & Typing | CourseShop",
    description:
      "Master Mandarin pronunciation and Chinese input methods with 30+ step-by-step video lessons.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.ziiy.fun",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = allMessages[locale] || allMessages.en;

  return (
    <html lang="en">
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
