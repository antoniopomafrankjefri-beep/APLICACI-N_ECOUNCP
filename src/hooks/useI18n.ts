import { useState, useCallback } from 'react';
import translationsData from '../data/translations.json';
import { Language } from '../types';

export function useI18n() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ecouncp_lang') as Language;
    if (saved && ['es', 'pt', 'en'].includes(saved)) {
      return saved;
    }
    return 'es'; // Default per user request: Spanish (es-PE)
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ecouncp_lang', lang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = (translationsData as Record<string, Record<string, string>>)[language] || translationsData.es;
      let text = dict[key] || (translationsData.es as Record<string, string>)[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [language]
  );

  return { language, setLanguage, t };
}
