import React, { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { signUpWithEmail, logInWithEmail, resetPassword } from '../lib/firebase';
import type { UserAccount } from '../types';

interface Props {
  isOpen: boolean; onClose: () => void; onAuthSuccess: (user: UserAccount) => void;
  dogName?: string; contextMessage?: string;
}
export default function AuthModal({ isOpen, onClose, onAuthSuccess, dogName = 'your pup' }: Props) {
  const [mode, setMode] = useState<'signup' | 'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  if (!isOpen) return null;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setMessage('If an account uses this email, a password reset link will arrive shortly. Check your spam folder too.');
      } else {
        const user = mode === 'signup' ? await signUpWithEmail(email.trim(), password, name.trim())
          : await logInWithEmail(email.trim(), password);
        onAuthSuccess(user); onClose();
      }
    } catch (error: any) {
      const code = error?.code;
      setMessage(code === 'auth/network-request-failed' ? 'You appear to be offline. Connect to the internet and try again.'
        : code === 'auth/too-many-requests' ? 'Too many attempts. Please wait a moment and try again.'
        : code === 'auth/email-already-in-use' ? 'This email already has an account. Sign in or reset your password.'
        : 'We could not complete that request. Check your email and password, or reset your password.');
    } finally { setBusy(false); }
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-title">
    <section className="modal-panel max-w-md">
      <button className="modal-close" onClick={onClose} aria-label="Close sign in"><X /></button>
      <div className="mb-5 text-[#184D7A]"><Mail className="mb-3" /><h2 id="auth-title" className="font-display text-2xl font-bold">
        {mode === 'signup' ? 'Save your play journey' : mode === 'reset' ? 'Reset your password' : 'Welcome back'}</h2>
        <p className="text-sm mt-2 text-stone-600">Optional cloud backup for {dogName}'s profile and play history. Games are always available as a guest.</p></div>
      {mode !== 'reset' && <div className="flex gap-2 mb-5">{(['login', 'signup'] as const).map(value =>
        <button key={value} onClick={() => { setMode(value); setMessage(''); }} aria-pressed={mode === value}
          className={`flex-1 rounded-xl p-3 font-bold ${mode === value ? 'bg-[#184D7A] text-white' : 'bg-stone-100'}`}>
          {value === 'login' ? 'Sign in' : 'Create account'}</button>)}</div>}
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <label className="block text-sm font-semibold">Your name (optional)<input className="form-input" value={name} maxLength={60} autoComplete="nickname" onChange={e => setName(e.target.value)} /></label>}
        <label className="block text-sm font-semibold">Email<input className="form-input" type="email" required autoComplete="email" autoCapitalize="none" value={email} onChange={e => setEmail(e.target.value)} /></label>
        {mode !== 'reset' && <label className="block text-sm font-semibold">Password<input className="form-input" aria-label="Password" type="password" required minLength={mode === 'signup' ? 8 : 1} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} />{mode === 'signup' && <span className="text-xs font-normal text-stone-500">Use at least 8 characters.</span>}</label>}
        {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{message}</p>}
        <button disabled={busy} className="primary-button w-full" type="submit">{busy ? <Loader2 className="animate-spin mx-auto" aria-label="Please wait" /> : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}</button>
      </form>
      <button className="w-full mt-4 text-sm underline" onClick={() => { setMode(mode === 'reset' ? 'login' : 'reset'); setMessage(''); }}>{mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}</button>
      <p className="text-xs text-stone-500 mt-5">Creating an account stores your email, profile and play history with Firebase. Guest history is only imported when you choose it in Account. Read our <a className="underline" href="/privacy.html" target="_blank" rel="noreferrer">privacy notice</a>.</p>
    </section>
  </div>;
}
