import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, User } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const getStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const strength = getStrength(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      setSuccess(true);
      // In a real app, we might wait for email verification or navigate to onboarding
      setTimeout(() => navigate('/onboarding'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-bg-main flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-border-main shadow-brand p-8 text-center">
          <div className="w-16 h-16 bg-teal-light rounded-2xl flex items-center justify-center text-teal-brand mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-serif mb-2">Check your email</h2>
          <p className="text-text-secondary text-sm mb-6">
            We've sent a verification link to <span className="font-bold text-text-main">{email}</span>. 
            Redirecting you to onboarding...
          </p>
          <div className="flex items-center justify-center gap-2 text-p font-bold animate-pulse">
            <Loader2 size={18} className="animate-spin" />
            Preparing your workspace
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-border-main shadow-brand p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif mb-2">Create account</h2>
            <p className="text-text-secondary text-sm">Start your 14-day free trial today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-light/30 border border-red-brand/20 rounded-xl flex items-center gap-3 text-red-brand text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-main rounded-2xl text-sm outline-none focus:border-p transition-all"
                  placeholder="Ahmed Raza"
                />
              </div>
            </div>

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
              <div className="relative mb-3">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-main rounded-2xl text-sm outline-none focus:border-p transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              
              {password.length > 0 && (
                <div className="px-1">
                  <div className="flex gap-1 h-1 mb-2">
                    {[1, 2, 3, 4].map((level) => {
                      const colors = [
                        'bg-gray-200',
                        'bg-red-500',
                        'bg-orange-500',
                        'bg-yellow-500',
                        'bg-green-500'
                      ];
                      
                      return (
                        <div 
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            level <= strength ? colors[strength] : 'bg-gray-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[10px] font-medium text-text-muted flex justify-between">
                    <span>Password strength</span>
                    <span className={strength === 4 ? 'text-green-600' : 'text-text-muted'}>
                      {(() => {
                        if (strength === 0) return 'Too short';
                        if (strength === 1) return 'Weak';
                        if (strength === 2) return 'Fair';
                        if (strength === 3) return 'Good';
                        return 'Strong';
                      })()}
                    </span>
                  </p>
                </div>
              )}
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
                  Get Started
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-main text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-p font-bold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
