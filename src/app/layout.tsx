import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lost in Translation — Crane",
  description:
    "Watch meaning melt as a phrase travels through language. Build your own translation tour through 40+ languages and see the semantic drift at every step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans text-dark-100 antialiased bg-dark-950">
        <div className="ambient-glow" aria-hidden />
        {children}
      </body>
    </html>
  );
}
