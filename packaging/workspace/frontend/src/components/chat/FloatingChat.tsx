"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ChatWidget from "./ChatWidget";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div className="flex h-[560px] w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-blue-100 bg-blue-800 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-800">
                TC
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">{t("siteTitle")}</h2>
                <p className="text-[10px] text-blue-200">County of Tulare, California</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLanguage(language === "en" ? "es" : "en")}
                className="rounded-full bg-blue-700 px-2.5 py-1 text-[10px] font-medium text-blue-100 transition-colors hover:bg-blue-600"
              >
                {language === "en" ? "ES" : "EN"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-blue-200 transition-colors hover:bg-blue-700 hover:text-white"
                aria-label="Minimize chat"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* AI Disclosure — SB 313 */}
          <div className="border-b border-amber-200 bg-amber-50 px-3 py-1.5 text-center text-[11px] text-amber-700">
            {t("aiDisclosure")}
          </div>

          {/* Chat body */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <ChatWidget />
          </div>
        </div>
      )}

      {/* Floating bubble button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
          aria-label="Open chat"
        >
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
