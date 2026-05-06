import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taleh & Alaviyya — Wedding Invitation",
  description: "You are cordially invited to celebrate the wedding of Taleh and Alaviyya on 13 June 2026 at Mala Praga, Baku.",
  openGraph: {
    title: "Taleh & Alaviyya — Wedding Invitation",
    description: "Join us to celebrate our wedding on 13 June 2026 at Mala Praga, Baku.",
    type: "website",
  },
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
