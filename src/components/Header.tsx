import React from 'react';
import { Wifi, WifiOff, Shield, Sparkles } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from './PWAInstallButton';
import { Language } from '../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Institutional Banner Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0B5D3B] via-[#084C2E] to-[#0A3D2E] shadow-lg shadow-uncp-verde/20 border border-uncp-dorado/20">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-uncp-dorado/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-uncp-verde/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-uncp-dorado/5 blur-3xl" />
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
            {/* Brand Identity Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* EcoUNCP Logo with decorative ring */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-uncp-dorado to-uncp-verde rounded-full opacity-50 blur-sm" />
                <img
                  src="/logos/ecouncp/ecouncp-logo-official.jpg"
                  alt="EcoUNCP - Universidad Nacional del Centro del Peru"
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg ring-2 ring-uncp-dorado/50 bg-white p-0.5"
                  title="EcoUNCP - Segregacion y Puntos de Acopio UNCP"
                />
                {/* Sparkle accent */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-uncp-dorado rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-uncp-verde" />
                </div>
              </div>

              <div className="ml-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                    Eco<span className="text-uncp-dorado">UNCP</span>
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-uncp-dorado/20 text-uncp-dorado border border-uncp-dorado/30 uppercase tracking-wider backdrop-blur-sm">
                    UNCP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {/* UNCP Shield Badge */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                    <Shield className="w-3.5 h-3.5 text-uncp-dorado" />
                    <span className="text-[10px] font-semibold text-white uppercase tracking-wide">UNCP</span>
                  </div>
                  {/* FIQ Logo */}
                  <img
                    src="/logos/fiq-logo.png"
                    alt="Facultad de Ingenieria Quimica"
                    className="w-7 h-7 rounded-md object-contain bg-white/10 p-1 rounded-lg border border-white/20"
                    title="Facultad de Ingenieria Quimica - UNCP"
                  />
                </div>
              </div>
            </div>

            {/* University Info & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              {/* University Info */}
              <div className="text-center sm:text-right hidden sm:block">
                <p className="text-[11px] text-white/90 font-medium leading-none">
                  Universidad Nacional del Centro del Peru
                </p>
                <p className="text-[10px] text-uncp-dorado/80 font-semibold leading-none">
                  Huancayo - Peru
                </p>
              </div>

              {/* Connection Status & Controls */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* PWA Install Button */}
                <PWAInstallButton />

                {/* Connection Status Badge */}
                <div
                  className={"flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border " + (
                    isOnline
                      ? "bg-white/15 text-white border-white/30"
                      : "bg-uncp-dorado/20 text-uncp-dorado border-uncp-dorado/30"
                  )}
                  title={isOnline ? t("online_notice") : t("offline_notice")}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-white" />
                      <span>{t("online_notice")}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-uncp-dorado" />
                      <span>{t("offline_notice")}</span>
                    </>
                  )}
                </div>

                {/* Language Selector */}
                <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/20 text-xs font-semibold backdrop-blur-sm">
                  {(["es", "pt", "en"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={"px-2.5 py-1.5 rounded-md transition uppercase text-[11px] " + (
                        language === lang
                          ? "bg-white text-uncp-verde shadow-xs font-bold"
                          : "text-white/80 hover:text-white"
                      )}
                      aria-label={"Cambiar idioma a " + lang}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Decorative bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-uncp-dorado/50 to-transparent" />
        </div>
      </div>
    </header>
  );
};

import React from "react";
import { Wifi, WifiOff, Shield, Sparkles } from "lucide-react";
import { useI18n } from "../hooks/useI18n";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { PWAInstallButton } from "./PWAInstallButton";
import { Language } from "../types";