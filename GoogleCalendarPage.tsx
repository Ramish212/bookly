import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, Loader2, AlertCircle, Unlink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  redirectToGoogleOAuth,
  getOAuthCodeFromURL,
  verifyOAuthState,
  exchangeCodeForTokens,
} from '../lib/googleCalendar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = 'connect' | 'loading' | 'success' | 'already_connected' | 'error';

export const GoogleCalendarPage: React.FC = () => {
  const [view, setView] = useState<View>('loading');
  const [connectedEmail, setConnectedEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { code, state, error } = getOAuthCodeFromURL();

      if (error) {
        setErrorMsg(error === 'access_denied'
          ? 'You denied access to Google Calendar. You can connect later from your dashboard.'
          : `Google returned an error: ${error}`);
        setView('error');
        window.history.replaceState({}, '', '/gcal');
        return;
      }

      if (code && state) {
        if (!verifyOAuthState(state)) {
          setErrorMsg('Security check failed. Please try connecting again.');
          setView('error');
          window.history.replaceState({}, '', '/gcal');
          return;
        }

        setView('loading');
        window.history.replaceState({}, '', '/gcal');

        try {
          const tokens = await exchangeCodeForTokens(code);

          const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          });
          const profile = await profileRes.json();
          const googleEmail = profile.email || user?.email || '';

          if (isSupabaseConfigured && user) {
            const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
            const { error: saveError } = await supabase
              .from('sites')
              .update({
                google_access_token: tokens.access_token,
                google_refresh_token: tokens.refresh_token,
                google_token_expires_at: expiresAt,
                google_calendar_email: googleEmail,
              })
              .eq('user_id', user.id);

            if (saveError) throw saveError;
          }

          setConnectedEmail(googleEmail);
          setView('success');
        } catch (err: any) {
          console.error('OAuth exchange failed:', err);
          setErrorMsg(err.message || 'Failed to connect Google Calendar. Please try again.');
          setView('error');
        }
        return;
      }

      if (isSupabaseConfigured && user) {
        try {
          const { data } = await supabase
            .from('sites')
            .select('google_calendar_email, google_access_token')
            .eq('user_id', user.id)
            .maybeSingle();

          if (data?.google_access_token && data?.google_calendar_email) {
            setConnectedEmail(data.google_calendar_email);
            setView('already_connected');
            return;
          }
        } catch (err) {
          console.error('Failed to check calendar status:', err);
        }
      }

      setView('connect');
    };

    init();
  }, [user]);

  const handleDisconnect = async () => {
    if (!isSupabaseConfigured || !user) return;
    setView('loading');
    await supabase
      .from('sites')
      .update({
        google_access_token: null,
        google_refresh_token: null,
        google_token_expires_at: null,
        google_calendar_email: null,
      })
      .eq('user_id', user.id);
    setConnectedEmail('');
    setView('connect');
  };

  const missingClientId = !import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main flex items-center justify-center p-4">
      <motion.div layout className="max-w-[500px] w-full bg-white rounded-[24px] p-10 shadow-brand-lg border border-border-main">
        <AnimatePresence mode="wait">

          {view === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
              <Loader2 size={48} className="text-p animate-spin mx-auto mb-6" />
              <p className="text-text-secondary">Connecting to Google...</p>
            </motion.div>
          )}

          {view === 'connect' && (
            <motion.div key="connect" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center">
              <div className="w-16 h-16 bg-p-light rounded-2xl mx-auto mb-6 flex items-center justify-center text-p">
                <Calendar size={32} />
              </div>
              <h2 className="text-3xl font-serif mb-4">Connect Google Calendar</h2>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Bookings automatically appear in your Google Calendar. No manual entry ever again.
              </p>
              <div className="bg-bg-secondary rounded-xl p-6 text-left mb-8">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">Bookly will be able to</p>
                <div className="space-y-3">
                  {['Create calendar events when customers book', 'Delete events when bookings are cancelled', 'Read your busy/free times to avoid conflicts'].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 bg-teal-brand rounded flex items-center justify-center text-white"><Check size={12} /></div>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              {missingClientId && (
                <div className="mb-6 p-4 bg-amber-light rounded-xl border border-amber-brand/20 text-left">
                  <p className="text-xs font-bold text-amber-brand mb-1">Setup required</p>
                  <p className="text-xs text-amber-brand/80">Add <code className="bg-white/60 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to your <code className="bg-white/60 px-1 rounded">.env.local</code> to enable real OAuth.</p>
                </div>
              )}
              <button onClick={redirectToGoogleOAuth} disabled={missingClientId} className={cn("w-full bg-white border border-border-dark py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-bg-secondary transition-all shadow-sm", missingClientId && "opacity-50 cursor-not-allowed")}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button onClick={() => navigate('/dashboard')} className="mt-6 text-text-muted text-sm hover:text-text-main transition-colors">Skip for now — I'll connect later</button>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 bg-teal-light rounded-full mx-auto mb-6 flex items-center justify-center text-teal-brand"><Check size={32} /></div>
              <h2 className="text-3xl font-serif mb-4">Calendar connected!</h2>
              <p className="text-text-secondary mb-8 leading-relaxed"><strong>{connectedEmail}</strong> is now connected. Every new booking will automatically appear in your Google Calendar.</p>
              <div className="bg-bg-secondary rounded-xl p-4 flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-teal-brand rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-text-secondary">{connectedEmail}</span>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-p text-white py-4 rounded-xl font-bold hover:bg-p-dark transition-all shadow-brand">Go to my dashboard →</button>
            </motion.div>
          )}

          {view === 'already_connected' && (
            <motion.div key="already_connected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 bg-teal-light rounded-full mx-auto mb-6 flex items-center justify-center text-teal-brand"><Check size={32} /></div>
              <h2 className="text-3xl font-serif mb-4">Already connected</h2>
              <p className="text-text-secondary mb-8">Your Google Calendar is active. Bookings are syncing automatically.</p>
              <div className="bg-bg-secondary rounded-xl p-4 flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-teal-brand rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-text-secondary flex-1 text-left">{connectedEmail}</span>
                <span className="text-[10px] font-bold text-teal-brand uppercase">Connected</span>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-p text-white py-4 rounded-xl font-bold hover:bg-p-dark transition-all shadow-brand mb-3">Back to dashboard</button>
              <button onClick={handleDisconnect} className="w-full flex items-center justify-center gap-2 text-red-brand text-sm font-medium hover:bg-red-light py-3 rounded-xl transition-all">
                <Unlink size={16} /> Disconnect Google Calendar
              </button>
            </motion.div>
          )}

          {view === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-16 h-16 bg-red-light rounded-full mx-auto mb-6 flex items-center justify-center text-red-brand"><AlertCircle size={32} /></div>
              <h2 className="text-3xl font-serif mb-4">Connection failed</h2>
              <p className="text-text-secondary mb-8 leading-relaxed">{errorMsg}</p>
              <button onClick={() => setView('connect')} className="w-full bg-p text-white py-4 rounded-xl font-bold hover:bg-p-dark transition-all shadow-brand mb-3">Try again</button>
              <button onClick={() => navigate('/dashboard')} className="text-text-muted text-sm hover:text-text-main transition-colors">Skip for now</button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};
