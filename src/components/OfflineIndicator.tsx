import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useI18n } from '../hooks/useI18n';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useI18n();

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-200">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t('offline_notice')}</span>
    </div>
  );
};
