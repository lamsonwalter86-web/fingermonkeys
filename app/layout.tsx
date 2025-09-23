import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Импортируем AOSProvider:
import { AOSProvider } from "./providers/aos-provider";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: [
    {
      url: siteConfig.faviconIcoUrl,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.theme}
          enableSystem
          disableTransitionOnChange
        >
          {/* ВАЖНО: Оборачиваем контент в AOSProvider, чтобы анимации работали */}
          <AOSProvider>
            {children}
          </AOSProvider>

          {process.env.NODE_ENV == "production" && (
            <Script src="576c7c9f-43fd-4cdc-823a-8f771e5ba2ed.js" />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
