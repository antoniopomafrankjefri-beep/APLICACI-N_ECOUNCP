import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useI18n } from '../hooks/useI18n';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useI18n();

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
        title={t('install_app')}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t('install_app')}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('install_ios')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  {t('install_ios_guide_title')}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 font-medium">
                  {t('install_ios_step1')}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {t('install_ios_step2')}
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
