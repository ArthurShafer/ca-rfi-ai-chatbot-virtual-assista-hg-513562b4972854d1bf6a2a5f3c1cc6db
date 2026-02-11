"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800 text-sm font-bold text-white">
            TC
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-blue-900">
              {t("siteTitle")}
            </h1>
            <p className="text-xs text-slate-500">
              County of Tulare, California
            </p>
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          className="rounded-full border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={
            language === "en" ? "Switch to Spanish" : "Switch to English"
          }
        >
          {language === "en" ? t("switchToSpanish") : t("switchToEnglish")}
        </button>
      </div>
    </header>
  );
}
