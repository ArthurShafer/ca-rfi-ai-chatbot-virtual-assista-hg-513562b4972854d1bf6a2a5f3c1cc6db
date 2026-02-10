"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-500">
      <div className="mx-auto max-w-5xl px-4">
        <p>
          {language === "en"
            ? "County of Tulare \u2022 2800 W. Burrel Ave, Visalia, CA 93291"
            : "Condado de Tulare \u2022 2800 W. Burrel Ave, Visalia, CA 93291"}
        </p>
        <p className="mt-1">
          {language === "en"
            ? "Phone: (559) 636-5000"
            : "Tel\u00e9fono: (559) 636-5000"}
          {" \u2022 "}
          <a
            href="https://tularecounty.ca.gov"
            className="underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            tularecounty.ca.gov
          </a>
        </p>
        <p className="mt-2 text-xs text-slate-400">
          {language === "en"
            ? "This is an AI-powered demo. Not an official County of Tulare service."
            : "Esta es una demostraci\u00f3n impulsada por IA. No es un servicio oficial del Condado de Tulare."}
        </p>
      </div>
    </footer>
  );
}
