import type { Metadata } from "next";
import { Caprasimo, Fraunces, Caveat, Silkscreen } from "next/font/google";
import "./globals.css";

const display = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap"
});

const body = Fraunces({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap"
});

const pixel = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap"
});

export const metadata: Metadata = {
  title: "✦ happy birthday, mimiru ✦",
  description:
    "a magical scrapbook of birthday notes for mimiru — our local mahou shoujo.",
  openGraph: {
    title: "✦ happy birthday, mimiru ✦",
    description: "a magical scrapbook of birthday notes for mimiru."
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${hand.variable} ${pixel.variable}`}
    >
      <body className="font-body bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
