export type Language = "en" | "es";

export const translations = {
  en: {
    siteTitle: "Tulare County AI Assistant",
    siteDescription: "Get help with Tulare County services",
    aiDisclosure:
      "You are chatting with an AI assistant. For human help, call (559) 636-5000.",
    talkToPerson: "Talk to a person",
    typeMessage: "Type your message...",
    send: "Send",
    switchToSpanish: "Español",
    switchToEnglish: "English",
    suggestedQuestions: [
      "How do I apply for CalFresh benefits?",
      "What do I need for a building permit?",
      "How do I get a copy of my birth certificate?",
      "Where is the nearest animal shelter?",
      "What are the county office hours?",
    ],
    escalationTitle: "Contact a Department",
    escalationDescription:
      "Speak with a county representative for personalized assistance.",
    close: "Close",
    admin: {
      title: "Analytics Dashboard",
      totalConversations: "Total Conversations",
      totalMessages: "Total Messages",
      avgResponseTime: "Avg Response Time",
      satisfaction: "Satisfaction",
      departmentBreakdown: "Conversations by Department",
      languageBreakdown: "Language Breakdown",
      topQuestions: "Top Questions",
      recentConversations: "Recent Conversations",
      passwordPrompt: "Enter admin password",
      login: "Login",
    },
  },
  es: {
    siteTitle: "Asistente de IA del Condado de Tulare",
    siteDescription: "Obtenga ayuda con los servicios del Condado de Tulare",
    aiDisclosure:
      "Está chateando con un asistente de IA. Para ayuda humana, llame al (559) 636-5000.",
    talkToPerson: "Hablar con una persona",
    typeMessage: "Escriba su mensaje...",
    send: "Enviar",
    switchToSpanish: "Español",
    switchToEnglish: "English",
    suggestedQuestions: [
      "¿Cómo solicito los beneficios de CalFresh?",
      "¿Qué necesito para un permiso de construcción?",
      "¿Cómo obtengo una copia de mi acta de nacimiento?",
      "¿Dónde está el refugio de animales más cercano?",
      "¿Cuáles son las horas de oficina del condado?",
    ],
    escalationTitle: "Contactar un Departamento",
    escalationDescription:
      "Hable con un representante del condado para asistencia personalizada.",
    close: "Cerrar",
    admin: {
      title: "Panel de Análisis",
      totalConversations: "Conversaciones Totales",
      totalMessages: "Mensajes Totales",
      avgResponseTime: "Tiempo de Respuesta Promedio",
      satisfaction: "Satisfacción",
      departmentBreakdown: "Conversaciones por Departamento",
      languageBreakdown: "Desglose por Idioma",
      topQuestions: "Preguntas Principales",
      recentConversations: "Conversaciones Recientes",
      passwordPrompt: "Ingrese la contraseña de administrador",
      login: "Iniciar sesión",
    },
  },
} as const;

export function t(lang: Language, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations[lang];
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}
