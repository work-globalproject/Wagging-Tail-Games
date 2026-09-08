import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithInstagram,
  signUpWithEmail,
  logInWithEmail
} from '../lib/firebase';
import { UserAccount } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  dogName?: string;
  contextMessage?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  dogName = 'your pup',
  contextMessage,
}: Props) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!isOpen) return null;

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'instagram') => {
    setErrorMessage(null);
    setLoadingProvider(provider);
    soundFx.playBoop(580);

    try {
      let user: UserAccount;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'facebook') {
        user = await signInWithFacebook();
      } else {
        user = await signInWithInstagram();
      }
      soundFx.playFanfare();
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Social auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in window was closed. Please try again.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage('An account already exists with this email using another sign-in method.');
      } else {
        setErrorMessage(err.message || `Failed to sign in with ${provider}.`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoadingProvider('email');
    soundFx.playBoop(540);

    try {
      let user: UserAccount;
      if (mode === 'signup') {
        user = await signUpWithEmail(email, password, displayName);
      } else {
        user = await logInWithEmail(email, password);
      }
      soundFx.playFanfare();
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Try signing in instead.');
        setMode('login');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email. Please create an account.');
        setMode('signup');
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Decorative Top Accent Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 px-6 pt-6 pb-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                🐾
              </span>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                  <Cloud className="w-3 h-3" /> Cloud Sync
                </span>
                <h2 className="text-xl font-display font-black leading-tight mt-0.5">
                  {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                </h2>
              </div>
            </div>
            <button
              id="auth-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-2 text-xs text-white/90 leading-relaxed">
            {contextMessage ||
              `Save ${dogName}'s play sessions, streak records, and progress safely in the cloud across all your devices.`}
          </p>

          {/* Quick Perks Pill */}
          <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-white/95">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> Save Sessions
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> Cloud Backup
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" /> Free Forever
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="leading-snug">{errorMessage}</p>
            </div>
          )}

          {/* Mode Tabs (Sign Up vs Sign In) */}
          <div className="flex rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="space-y-2.5">
            {/* Google Button */}
            <button
              id="auth-google-btn"
              type="button"
              disabled={!!loadingProvider}
              onClick={() => handleSocialAuth('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-2xs transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Facebook Button */}
            <button
              id="auth-facebook-btn"
              type="button"
              disabled={!!loadingProvider}
              onClick={() => handleSocialAuth('facebook')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-2xs transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loadingProvider === 'facebook' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span>Continue with Facebook</span>
            </button>

            {/* Instagram Button */}
            <button
              id="auth-instagram-btn"
              type="button"
              disabled={!!loadingProvider}
              onClick={() => handleSocialAuth('instagram')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-bold shadow-2xs transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loadingProvider === 'instagram' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              )}
              <span>Continue with Instagram</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Or with email
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Toggle or Show Email Form */}
          {!showEmailForm ? (
            <button
              id="auth-toggle-email-btn"
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-stone-500" />
              <span>Use Email & Password instead</span>
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      id="auth-input-name"
                      type="text"
                      placeholder="e.g. Sarah & Barnaby"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    id="auth-input-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Password (6+ chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    id="auth-input-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                id="auth-submit-email-btn"
                type="submit"
                disabled={!!loadingProvider}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60"
              >
                {loadingProvider === 'email' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account & Save Sessions' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Safety Note */}
          <div className="pt-2 text-center text-[10px] text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure encryption • We never share your pet's data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
