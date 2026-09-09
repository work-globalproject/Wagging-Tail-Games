import React, { useState } from 'react';
import { X } from 'lucide-react';
interface Props { isOpen: boolean; onClose: () => void; isInstallable: boolean; onDirectInstall: () => Promise<boolean>; dogName?: string; }
export default function PWAInstallGuideModal({ isOpen, onClose, isInstallable, onDirectInstall }: Props) {
 const [message, setMessage] = useState('');
 if (!isOpen) return null;
 return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="install-title"><section className="modal-panel max-w-md">
 <button onClick={onClose} aria-label="Close install guide" className="modal-close"><X /></button>
 <h2 id="install-title" className="font-display text-2xl mb-4">Keep play close by</h2>
 <p className="text-sm mb-4">Add the web app to your home screen. Your saved games will be available after the first successful load.</p>
 <h3 className="font-bold">iPhone or iPad</h3><p className="text-sm mb-4">Open this page in Safari, tap Share, then Add to Home Screen.</p>
 <h3 className="font-bold">Android</h3><p className="text-sm mb-4">Open this page in Chrome, open its menu, then choose Install app or Add to Home screen.</p>
 {isInstallable && <button className="primary-button" onClick={() => void onDirectInstall().then(ok => setMessage(ok ? 'Installation requested.' : 'Installation cancelled.')).catch(() => setMessage('Use your browser menu to install.'))}>Install web app</button>}
 {message && <p role="status">{message}</p>}
 </section></div>;
}
