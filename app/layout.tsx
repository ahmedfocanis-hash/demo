import type { Metadata } from "next";
import "./globals.css";
import MetaMaskGuard from "@/components/MetaMaskGuard";

export const metadata: Metadata = {
  title: "BeyondPayments Gateway — Acquirer Operations Console",
  description:
    "Editorial fintech operating layer — orchestration, VAS, settlement, and terminal fleet for acquirer banks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <meta name="theme-color" content="#ffffff" />
      <body className="h-full bg-paper-white text-ink-roast antialiased">
        <MetaMaskGuard />
        {children}
      </body>
    </html>
  );
}