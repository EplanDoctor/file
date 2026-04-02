import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EplanDoctor | En Yaygın Hataları Saniyeler İçinde Çözün",
  description: "EPLAN elektrik proje çizim programı kullanan mühendislerin yaşadığı teknik sorunlara hızlı çözüm sunan sistem.",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
