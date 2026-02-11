"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/lib/i18n";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({
  onSelect,
}: SuggestedQuestionsProps) {
  const { language } = useLanguage();
  const questions = translations[language].suggestedQuestions;

  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 py-4">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs text-blue-800 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
