import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { persistDeviceData } from '../lib/device';
const key = 'wagging-tail:v1:reminder-enabled';
export function ReminderControl({ time }: { time: string }) {
  const [enabled, setEnabled] = useState(localStorage.getItem(key) === 'true');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const native = Capacitor.isNativePlatform();
  const schedule = async () => {
    const [hour, minute] = time.split(':').map(Number);
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
    await LocalNotifications.schedule({ notifications: [{ id: 1001, title: 'Time for a little play 🐾',
      body: 'Pick a game and enjoy a moment together.', schedule: { on: { hour, minute }, repeats: true } }] });
  };
  useEffect(() => {
    if (native && enabled) void schedule().catch(() => setMessage('Reminder could not be updated. Check notification permissions.'));
  }, [time, enabled]);
  const toggle = async () => {
    setBusy(true); setMessage('');
    try {
      if (enabled) {
        await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
        await persistDeviceData(key, 'false'); setEnabled(false);
      } else {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display !== 'granted') { setMessage('Notifications are off. You can enable them in device Settings.'); return; }
        await schedule();
        await persistDeviceData(key, 'true'); setEnabled(true);
      }
    } catch { setMessage('Reminder could not be saved. Please try again.'); }
    finally { setBusy(false); }
  };
  return <div className="rounded-2xl border border-sky-200 bg-white p-4 text-sm">
    <p className="font-bold">Daily play reminder · {time}</p>
    <p className="mt-1 text-stone-600">{native ? 'An optional notification on this device. Change the time in your dog profile.' : 'Daily device notifications are available in the iPhone and Android app.'}</p>
    {native && <button disabled={busy} onClick={() => void toggle()} className="primary-button mt-3">{enabled ? 'Turn reminder off' : 'Enable daily reminder'}</button>}
    {message && <p role="status" className="mt-2">{message}</p>}
  </div>;
}
