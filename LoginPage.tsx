import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-border-main shadow-brand p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif mb-2">Welcome back</h2>
            <p className="text-text-secondary text-sm">Sign in to manage your business</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-light/30 border border-red-brand/20 rounded-xl flex items-center gap-3 text-red-brand text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-main rounded-2xl text-sm outline-none focus:border-p transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-main rounded-2xl text-sm outline-none focus:border-p transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-p text-white py-4 rounded-2xl font-bold hover:bg-p-dark transition-all flex items-center justify-center gap-2 shadow-brand disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-main text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-p font-bold hover:underline">
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
