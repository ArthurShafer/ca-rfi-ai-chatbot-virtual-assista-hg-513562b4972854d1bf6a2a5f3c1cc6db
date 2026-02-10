"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* AI Disclosure Banner — SB 313 Compliance */}
      <div
        className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800"
        role="status"
        aria-live="polite"
      >
        {t("aiDisclosure")}
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <ChatWidget />
      </main>

      <Footer />
    </div>
  );
}
