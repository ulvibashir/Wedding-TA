import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taleh & Alaviyya — Wedding Invitation",
  description: "You are cordially invited to celebrate the wedding of Taleh and Alaviyya on June 13, 2025 at Mala Praga, Baku.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
