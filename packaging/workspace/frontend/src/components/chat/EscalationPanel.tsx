"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface EscalationPanelProps {
  onClose: () => void;
}

const DEPARTMENTS = [
  {
    name: "Health & Human Services",
    nameEs: "Salud y Servicios Humanos",
    phone: "(559) 624-8000",
  },
  {
    name: "Resource Management Agency",
    nameEs: "Agencia de Gestión de Recursos",
    phone: "(559) 624-7000",
  },
  {
    name: "County Clerk",
    nameEs: "Oficina del Secretario del Condado",
    phone: "(559) 636-5050",
  },
  {
    name: "Animal Services",
    nameEs: "Servicios de Animales",
    phone: "(559) 636-4050",
  },
  {
    name: "General County Services",
    nameEs: "Servicios Generales del Condado",
    phone: "(559) 636-5000",
  },
];

export default function EscalationPanel({ onClose }: EscalationPanelProps) {
  const { language, t } = useLanguage();

  return (
    <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">
          {t("escalationTitle")}
        </h3>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
          aria-label={t("close")}
        >
          {t("close")}
        </button>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        {t("escalationDescription")}
      </p>
      <div className="space-y-2">
        {DEPARTMENTS.map((dept) => (
          <a
            key={dept.phone}
            href={`tel:${dept.phone.replace(/[^\d]/g, "")}`}
            className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-xs transition-colors hover:bg-blue-50"
          >
            <span className="font-medium text-slate-700">
              {language === "es" ? dept.nameEs : dept.name}
            </span>
            <span className="text-blue-700">{dept.phone}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
