import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * design2 asks for InterDisplay, which Google Fonts does not distribute.
 * Inter is the same superfamily — InterDisplay is simply its display optical
 * size — so loading Inter with the optical-size axis is the closest faithful
 * match available.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบจองห้องอ่านหนังสือ",
  description: "จองห้องอ่านหนังสือของมหาวิทยาลัย ดูช่วงเวลาว่าง และจัดการการจองของคุณ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-bg text-ink min-h-full">{children}</body>
    </html>
  );
}
