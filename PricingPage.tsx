import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Plus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelectPlan = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const prices = {
    pro: isYearly ? 10 : 14,
    biz: isYearly ? 25 : 36
  };

  const faqs = [
    { q: "Do I need a credit card to start?", a: "No. Free plan is free forever, no card needed." },
    { q: "Can I cancel anytime?", a: "Yes. Cancel from settings. Page stays until billing period ends." },
    { q: "How does Google Calendar sync work?", a: "Booking creates event. Cancel deletes it. Blocked time hides slots." },
    { q: "Can I use my own domain?", a: "Yes on Pro/Business. Add DNS record, we handle SSL." },
    { q: "What payment methods do you accept?", a: "Visa, Mastercard, Amex via Stripe. We never store card details." }
  ];

  return (
    <div className="bg-bg-main min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-p-muted text-p-dark font-medium text-sm mb-6">
          PRICING
        </div>
        <h1 className="text-5xl font-serif mb-4">Simple, honest pricing</h1>
        <p className="text-text-secondary mb-10">Start free. Upgrade when you're ready. Cancel anytime.</p>
        
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-text-main" : "text-text-muted")}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 bg-border-dark rounded-full relative p-1 transition-colors hover:bg-p-muted"
          >
            <div className={cn("w-5 h-5 bg-white rounded-full shadow-sm transition-transform", isYearly ? "translate-x-7" : "translate-x-0")}></div>
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-text-main" : "text-text-muted")}>Yearly</span>
            <span className="bg-teal-light text-teal-brand text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 30%</span>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[880px] mx-auto grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white p-8 rounded-[20px] border border-border-main flex flex-col text-left">
            <h3 className="text-lg font-bold mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-text-muted text-sm">/forever</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                { text: '1 page, 3 services', icon: Check, color: 'text-teal-brand' },
                { text: '20 bookings/mo', icon: Check, color: 'text-teal-brand' },
                { text: 'Google Calendar sync', icon: Check, color: 'text-teal-brand' },
                { text: 'Custom domain', icon: X, color: 'text-text-muted' },
                { text: 'Email reminders', icon: X, color: 'text-text-muted' },
                { text: 'Remove branding', icon: X, color: 'text-text-muted' }
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <f.icon size={16} className={f.color} />
                  <span className={f.color === 'text-text-muted' ? 'text-text-muted' : 'text-text-secondary'}>{f.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleSelectPlan}
              className="w-full py-3 rounded-xl border border-border-dark font-bold hover:bg-bg-main transition-colors mt-auto"
            >
              Get started free
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-[20px] border-2 border-p flex flex-col text-left relative shadow-brand-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-p text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most popular
            </div>
            <h3 className="text-lg font-bold mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${prices.pro}</span>
              <span className="text-text-muted text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                { text: 'Unlimited services', icon: Check, color: 'text-teal-brand' },
                { text: 'Unlimited bookings', icon: Check, color: 'text-teal-brand' },
                { text: 'Google Calendar sync', icon: Check, color: 'text-teal-brand' },
                { text: 'Custom domain', icon: Check, color: 'text-teal-brand' },
                { text: 'Email reminders', icon: Check, color: 'text-teal-brand' },
                { text: 'Analytics dashboard', icon: Check, color: 'text-teal-brand' },
                { text: 'Remove branding', icon: X, color: 'text-text-muted' }
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <f.icon size={16} className={f.color} />
                  <span className={f.color === 'text-text-muted' ? 'text-text-muted' : 'text-text-secondary'}>{f.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleSelectPlan}
              className="w-full py-3 rounded-xl bg-p text-white font-bold hover:bg-p-dark transition-colors mt-auto shadow-brand"
            >
              Start 14-day free trial
            </button>
          </div>

          {/* Business */}
          <div className="bg-white p-8 rounded-[20px] border border-border-main flex flex-col text-left">
            <h3 className="text-lg font-bold mb-2">Business</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${prices.biz}</span>
              <span className="text-text-muted text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                { text: '5 team members', icon: Check, color: 'text-teal-brand' },
                { text: 'Unlimited everything', icon: Check, color: 'text-teal-brand' },
                { text: 'SMS + email reminders', icon: Check, color: 'text-teal-brand' },
                { text: 'Priority support', icon: Check, color: 'text-teal-brand' },
                { text: 'Advanced analytics', icon: Check, color: 'text-teal-brand' },
                { text: 'Custom email domain', icon: Check, color: 'text-teal-brand' }
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <f.icon size={16} className={f.color} />
                  <span className="text-text-secondary">{f.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={handleSelectPlan}
              className="w-full py-3 rounded-xl border border-border-dark font-bold hover:bg-bg-main transition-colors mt-auto"
            >
              Start 14-day free trial
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-[660px] mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12">Common questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-border-main pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                  <span className="font-bold text-text-main pr-4">{f.q}</span>
                  <Plus size={20} className="text-text-muted group-open:rotate-45 transition-transform" />
                </summary>
                <div className="pt-2 text-text-secondary text-sm leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
