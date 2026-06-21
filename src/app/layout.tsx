import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "@/styles/globals.css";
import { QueryClientProvider } from "@/shared/providers/QueryClientProvider";
import { ThemeProvider } from "next-themes";
import { appConfig } from "@/core/config";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

const isRtl = appConfig.direction === "rtl";
const activeFontFamily = isRtl
  ? '"IRANSansX", system-ui, sans-serif'
  : inter.style.fontFamily;
const activeFontClass = isRtl ? "" : inter.variable;

export const metadata: Metadata = {
  title: "پنل شدکس",
  description: "پنل مدیریت ساخته شده با Next.js و shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={appConfig.locale}
      dir={appConfig.direction}
      className={`${activeFontClass} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {isRtl && (
        <head>
          <link rel="stylesheet" href="/fonts/iransans/iransans.css" />
        </head>
      )}
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: activeFontFamily }}
      >
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
