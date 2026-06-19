import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Compiler html",
  description: "Modern HTML/CSS/JS web compiler powered by Next.js 15"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
