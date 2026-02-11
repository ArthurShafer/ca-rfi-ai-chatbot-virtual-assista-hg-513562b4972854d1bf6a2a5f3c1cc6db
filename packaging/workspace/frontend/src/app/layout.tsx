import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tulare County AI Assistant",
  description:
    "AI-powered chatbot for Tulare County resident services. Get help with CalFresh, permits, vital records, and more.",
  openGraph: {
    title: "Tulare County AI Assistant",
    description:
      "AI-powered chatbot helping Tulare County residents access government services in English and Spanish.",
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
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
