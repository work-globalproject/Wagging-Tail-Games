import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Share,
  PlusSquare,
  Download,
  CheckCircle2,
  Sparkles,
  WifiOff,
  Flame,
  ArrowRight,
  ExternalLink,
  Store,
  Layers
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import WaggingTailLogo from './WaggingTailLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onDirectInstall: () => Promise<boolean>;
  dogName?: string;
}

export default function PWAInstallGuideModal({
  isOpen,
  onClose,
  isInstallable,
  onDirectInstall,
  dogName = 'your pup',
}: Props) {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'stores'>(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/android/.test(ua)) return 'android';
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    }
    return 'ios';
  });
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstalling(true);
    soundFx.playBoop(580);
    try {
      const installed = await onDirectInstall();
      if (installed) {
        soundFx.playFanfare();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div
      id="pwa-install-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="pwa-install-modal"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Banner with Brand Theme */}
        <div className="bg-gradient-to-r from-[#184D7A] via-[#1f5c91] to-[#40B3C9] px-6 pt-6 pb-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
                🐕
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  <Smartphone className="w-3 h-3 text-[#FFB82E]" /> Mobile Web App
                </span>
                <h3 className="text-lg font-display font-black leading-tight mt-1 text-white">
                  Install Wagging Tail Games
                </h3>
              </div>
            </div>
            <button
              id="pwa-modal-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-2.5 text-xs text-white/90 leading-relaxed">
            Install on your iPhone, iPad, or Android phone for instant full-screen play without any browser address bars!
          </p>

          {/* Perks list */}
          <div className="mt-3.5 grid grid-cols-3 gap-1.5 text-[10px] font-bold text-white/95">
            <div className="flex items-center gap-1 bg-black/20 px-2 py-1.5 rounded-xl">
              <WifiOff className="w-3.5 h-3.5 text-[#FFB82E] shrink-0" />
              <span>Works Offline</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 px-2 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-[#40B3C9] shrink-0" />
              <span>Full Screen</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 px-2 py-1.5 rounded-xl">
              <Flame className="w-3.5 h-3.5 text-[#FF7C00] shrink-0" />
              <span>Zero App Store Fees</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Direct 1-Click Install Button (Chromium / Android) */}
          {isInstallable && (
            <div className="p-4 rounded-2xl bg-[#40B3C9]/10 border border-[#40B3C9]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#184D7A]">One-Tap Direct Install</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#FF7C00] px-2 py-0.5 rounded-full shadow-2xs">
                  Supported Now
                </span>
              </div>
              <p className="text-xs text-[#184D7A]/80">
                Your browser supports instant installation directly to your phone's home screen.
              </p>
              <button
                id="pwa-direct-install-btn"
                type="button"
                disabled={installing}
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF7C00] to-[#FF9226] hover:brightness-105 text-white text-xs font-black shadow-md shadow-[#FF7C00]/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{installing ? 'Installing App...' : 'Add to Home Screen Now'}</span>
              </button>
            </div>
          )}

          {/* OS Switcher Tabs */}
          <div>
            <div className="flex rounded-xl bg-stone-100 p-1 mb-3.5">
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'ios'
                    ? 'bg-white text-[#184D7A] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                iPhone & iPad (iOS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'android'
                    ? 'bg-white text-[#184D7A] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Android Phone
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stores')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'stores'
                    ? 'bg-white text-[#184D7A] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                App Stores 🚀
              </button>
            </div>

            {/* Apple iOS Step-by-Step Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-3 text-xs text-stone-700 animate-in fade-in duration-150">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200/80">
                  <div className="w-7 h-7 rounded-xl bg-[#40B3C9]/20 text-[#184D7A] flex items-center justify-center shrink-0 font-black text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-[#184D7A]">Open in Safari</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      On your iPhone or iPad, make sure you open this link in Apple <strong>Safari</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200/80">
                  <div className="w-7 h-7 rounded-xl bg-[#FF7C00]/20 text-[#FF7C00] flex items-center justify-center shrink-0 font-black text-xs">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#184D7A]">
                      <span>Tap the Share Button</span>
                      <span className="p-1 rounded-md bg-stone-200 text-stone-800 inline-flex items-center">
                        <Share className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Tap the square icon with the upward arrow at the bottom of your Safari browser bar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200/80">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black text-xs">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#184D7A]">
                      <span>Tap "Add to Home Screen"</span>
                      <span className="p-1 rounded-md bg-stone-200 text-stone-800 inline-flex items-center">
                        <PlusSquare className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Scroll down in the action sheet and select <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>. Wagging Tail Games will appear on your home screen!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Android Step-by-Step Instructions */}
            {activeTab === 'android' && (
              <div className="space-y-3 text-xs text-stone-700 animate-in fade-in duration-150">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200/80">
                  <div className="w-7 h-7 rounded-xl bg-[#40B3C9]/20 text-[#184D7A] flex items-center justify-center shrink-0 font-black text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-[#184D7A]">Open in Chrome</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Open this web address in <strong>Google Chrome</strong> or Samsung Internet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200/80">
                  <div className="w-7 h-7 rounded-xl bg-[#FF7C00]/20 text-[#FF7C00] flex items-center justify-center shrink-0 font-black text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-[#184D7A]">Tap the Menu (⋮) or "Install"</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Tap the three vertical dots in the top right corner of Chrome (or tap the "Install App" button at the top of this page).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200/80">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-[#184D7A]">Tap "Install app" or "Add to Home screen"</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Confirm installation. Wagging Tail Games installs directly into your phone's app drawer with its official icon!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Publishing with Capacitor to App Store / Google Play */}
            {activeTab === 'stores' && (
              <div className="space-y-3 text-xs text-stone-700 animate-in fade-in duration-150">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#184D7A]/10 via-[#40B3C9]/15 to-[#FF7C00]/10 border border-[#40B3C9]/40">
                  <div className="flex items-center gap-2 font-bold text-[#184D7A] mb-1">
                    <Store className="w-4 h-4 text-[#FF7C00]" />
                    <span>Capacitor Native Projects Ready!</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    Capacitor is configured with native <strong>iOS</strong> and <strong>Android</strong> project directories (App ID: <code className="bg-white/80 px-1 py-0.5 rounded text-[#184D7A] font-bold">com.leoboygames.waggingtailgames</code>).
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-[#184D7A]">
                      <span className="w-5 h-5 rounded-md bg-[#184D7A] text-white flex items-center justify-center text-[10px]">🍎</span>
                      <span>Publishing to Apple App Store (iOS)</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Configured</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    1. Export project via <strong>Settings &rarr; Export to ZIP/GitHub</strong>.<br />
                    2. Run <code className="bg-stone-200/80 px-1 py-0.5 rounded font-mono text-[10px]">npm run cap:open:ios</code> (or open <code className="bg-stone-200/80 px-1 py-0.5 rounded font-mono text-[10px]">ios/App/App.xcworkspace</code> in Xcode).<br />
                    3. Select your Apple Developer Team in Xcode &rarr; <em>Signing & Capabilities</em>.<br />
                    4. Click <strong>Product &rarr; Archive &rarr; Distribute App</strong> to upload to App Store Connect!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FCFD] border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-[#184D7A]">
                      <span className="w-5 h-5 rounded-md bg-[#40B3C9] text-white flex items-center justify-center text-[10px]">🤖</span>
                      <span>Publishing to Google Play Store (Android)</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Configured</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    1. Open the project in Android Studio via <code className="bg-stone-200/80 px-1 py-0.5 rounded font-mono text-[10px]">npm run cap:open:android</code> (or open the <code className="bg-stone-200/80 px-1 py-0.5 rounded font-mono text-[10px]">android/</code> folder).<br />
                    2. In Android Studio, go to <strong>Build &rarr; Generate Signed Bundle / APK</strong>.<br />
                    3. Choose <strong>Android App Bundle (.aab)</strong> and sign with your release key.<br />
                    4. Upload the generated <code className="text-[#FF7C00] font-mono text-[10px]">.aab</code> directly to your Google Play Console!
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>Whenever you make changes to the app code, run <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-[10px]">npm run cap:sync</code> to push the latest build into the iOS and Android projects!</span>
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            id="pwa-modal-gotit-btn"
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#184D7A] text-xs font-bold transition-all"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
