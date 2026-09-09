import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as NativeApp } from '@capacitor/app';

export function useModalAccessibility() {
  useEffect(() => {
    let active: HTMLElement | null = null;
    let previous: HTMLElement | null = null;
    const focusable = () => active ? [...active.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select, textarea, [tabindex="0"]')]
      .filter(el => el.getClientRects().length > 0) : [];
    const update = () => {
      const dialogs = [...document.querySelectorAll<HTMLElement>('[role="dialog"]')];
      const next = dialogs.at(-1) || null;
      if (next === active) return;
      if (!active) previous = document.activeElement as HTMLElement;
      active = next;
      document.body.style.overflow = active ? 'hidden' : '';
      if (active) (focusable()[0] || active).focus();
      else previous?.focus();
    };
    const close = () => {
      const button = active?.querySelector<HTMLButtonElement>('button[aria-label^="Close"]');
      if (button && !button.disabled) button.click();
    };
    const keydown = (event: KeyboardEvent) => {
      if (!active) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        const list = focusable();
        if (!list.length) { event.preventDefault(); return; }
        const index = list.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); list.at(-1)!.focus(); }
        else if (!event.shiftKey && (index < 0 || index === list.length - 1)) { event.preventDefault(); list[0].focus(); }
      }
    };
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true }); update();
    document.addEventListener('keydown', keydown);
    const nativeBack = Capacitor.getPlatform() === 'android' ? NativeApp.addListener('backButton', () => {
      if (active) close();
      else document.querySelector<HTMLButtonElement>('#bottom-nav-games')?.click();
    }) : null;
    return () => {
      observer.disconnect(); document.removeEventListener('keydown', keydown); document.body.style.overflow = '';
      void nativeBack?.then(listener => listener.remove());
    };
  }, []);
}
