import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-stone-900/90 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-white shadow-xl border border-stone-700/50 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-3.5 h-3.5 text-amber-300" />
      <span>Offline Mode — All games & timer cached for play</span>
    </div>
  );
};
