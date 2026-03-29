import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import WhatsAppButton from "@/components/WhatsAppButton";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Semurni Emas",
  description: "Melayani sepenuh hati, menghargai semurni emas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
