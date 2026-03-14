import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import { I18nProvider } from "@/lib/i18n/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import { themeScript } from "@/lib/theme/theme-script";

import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw UI Dashboard",
  description: "Multi-language and multi-theme dashboard for OpenClaw."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
