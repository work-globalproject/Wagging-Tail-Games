import React, { useState } from 'react';
import { Smartphone, Download, PlusSquare, Apple } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import PWAInstallGuideModal from './PWAInstallGuideModal';
import { soundFx } from '../utils/audio';

interface Props {
  dogName?: string;
  variant?: 'pill' | 'banner';
}

export const PWAInstallButton: React.FC<Props> = ({ dogName = 'your pup', variant = 'pill' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already installed and launched as standalone PWA, hide install prompts
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    soundFx.playBoop(580);
    // Always open the pop-up modal showing instructions for Apple iOS and Android
    setShowGuideModal(true);
  };

  return (
    <>
      {variant === 'pill' ? (
        <button
          id="pwa-install-header-btn"
          type="button"
          onClick={handleClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FF7C00]/10 hover:bg-[#FF7C00]/20 border border-[#FF7C00]/30 text-[#FF7C00] text-xs font-bold transition-all active:scale-95 shadow-2xs"
          title="Download & Install App on Apple iOS or Android"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#FF7C00]" />
          <span className="hidden sm:inline">Install App (iOS / Android)</span>
          <span className="sm:hidden">Install</span>
        </button>
      ) : (
        <div
          id="pwa-mobile-install-banner"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#184D7A]/5 via-[#40B3C9]/10 to-[#FF7C00]/10 border border-[#40B3C9]/30 flex items-center justify-between gap-3 shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#184D7A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5 text-[#FFB82E]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-black text-[#184D7A] truncate flex items-center gap-1.5">
                <span>Download on Phone (Apple iOS & Android)</span>
                <span className="text-[10px] font-bold bg-[#FF7C00] text-white px-1.5 py-0.2 rounded-full">Free</span>
              </p>
              <p className="text-[11px] text-[#184D7A]/75 truncate">
                Add to your home screen for full-screen play with {dogName} & offline access
              </p>
            </div>
          </div>
          <button
            id="pwa-banner-install-btn"
            type="button"
            onClick={handleClick}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#FF7C00] hover:bg-[#FF9020] text-white text-xs font-black shadow-sm transition-all active:scale-95"
          >
            Get App
          </button>
        </div>
      )}

      {/* Guide modal */}
      <PWAInstallGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        isInstallable={isInstallable}
        onDirectInstall={install}
        dogName={dogName}
      />
    </>
  );
};
