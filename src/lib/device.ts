import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

let pendingWrite = Promise.resolve();
export async function hydrateDeviceData(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const { keys } = await Preferences.keys();
  for (const key of keys.filter(key => key.startsWith('wagging-tail:v1:'))) {
    const { value } = await Preferences.get({ key });
    if (value !== null) localStorage.setItem(key, value);
  }
}

export function persistDeviceData(key: string, value: string | null): Promise<void> {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  pendingWrite = pendingWrite.catch(() => {}).then(() => value === null
    ? Preferences.remove({ key }) : Preferences.set({ key, value }));
  return pendingWrite;
}

export async function exportMedia(blob: Blob, filename: string, title: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    const path = `share-${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const { uri } = await Filesystem.writeFile({ path, directory: Directory.Cache, data });
    try { await Share.share({ title, files: [uri], dialogTitle: 'Save or share your moment' }); }
    finally { await Filesystem.deleteFile({ path, directory: Directory.Cache }).catch(() => {}); }
  } else {
    const file = new File([blob], filename, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ title, files: [file] });
    else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = filename; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
    }
  }
}
