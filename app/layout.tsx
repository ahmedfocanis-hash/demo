import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MetaMaskGuard from "@/components/MetaMaskGuard";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BeyondPayments Gateway — Acquirer Operations Console",
  description:
    "Editorial fintech operating layer — orchestration, VAS, settlement, and terminal fleet for acquirer banks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <meta name="theme-color" content="#ffffff" />
      <body className="min-h-full flex flex-col bg-paper-white text-ink-roast font-sans">
        <MetaMaskGuard />
        {children}
      </body>
    </html>
  );
}