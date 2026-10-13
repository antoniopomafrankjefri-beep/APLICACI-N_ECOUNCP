import React from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Language } from '../types';

interface TopControlsProps {
  isOnline: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  onInstallClick?: () => void;
  installPrompt?: boolean;
}

export const TopControls: React.FC<TopControlsProps> = ({ 
  isOnline, 
  language, 
  setLanguage, 
  t,
  onInstallClick, 
  installPrompt 
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Single row: Install | Connection | Languages - aligned right */}
        <div className="flex items-center justify-end gap-3 flex-wrap">
          {/* PWA Install Button - Only show if prompt available */}
          {installPrompt && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-uncp-verde text-white text-sm font-semibold shadow-sm hover:bg-uncp-verde-dark transition-all focus:outline-none focus:ring-2 focus:ring-uncp-verde/50 focus:ring-offset-2"
              aria-label="Instalar EcoUNCP"
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap text-black">Descargar Aplicación
</span>
            </button>
          )}

          {/* Connection Status Badge */}
          <div
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium " + (
              isOnline
                ? "bg-uncp-verde-pale text-uncp-verde border-uncp-verde/30"
                : "bg-uncp-dorado-pale text-uncp-dorado-dark border-uncp-dorado/30"
            )}
            role="status"
            aria-live="polite"
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-uncp-verde flex-shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">Conectado a internet</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-uncp-dorado-dark flex-shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">Desconectado de internet</span>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            {(["es", "pt", "en"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={"px-2.5 py-1.5 rounded-md transition uppercase text-xs font-semibold " + (
                  language === lang
                    ? "bg-white text-uncp-verde shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                )}
                aria-label={"Cambiar idioma a " + lang}
                aria-pressed={language === lang}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};