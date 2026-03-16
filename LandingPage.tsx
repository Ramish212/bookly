import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-p-light text-p font-medium text-sm mb-8"
          >
            Free to start — no credit card needed
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif leading-tight mb-6"
          >
            Your own booking page, <br />
            <span className="italic text-p">live in 10 minutes</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
          >
            Create a beautiful, branded booking site that connects to your calendar and automates your business.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button 
              onClick={handleStart}
              className="bg-p text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-p-dark transition-all hover:-translate-y-1 shadow-brand-lg"
            >
              Create my booking page
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="border border-border-dark text-text-main px-8 py-4 rounded-full font-medium text-lg hover:bg-white transition-all hover:-translate-y-1"
            >
              See pricing
            </button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-muted text-sm mb-12"
          >
            Trusted by 2,400+ small businesses
          </motion.p>

          {/* Demo Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            whileHover={{ y: -10 }}
            className="relative max-w-[380px] mx-auto bg-white rounded-[24px] shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-border-main overflow-hidden text-left group/card"
          >
            <motion.div 
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="bg-p p-6 text-white"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">S</div>
                <div>
                  <h3 className="font-bold">Ahmed's Salon</h3>
                  <p className="text-white/70 text-sm">bookly.app/ahmed-salon</p>
                </div>
              </div>
            </motion.div>
            
            <div className="p-6">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Choose a service</p>
              <div className="space-y-3 mb-6">
                {[
                  { name: 'Haircut', price: '$15', duration: '45 min' },
                  { name: 'Beard trim', price: '$8', duration: '20 min' },
                  { name: 'Haircut + beard', price: '$20', duration: '60 min' }
                ].map((s, i) => (
                  <div key={i} className={cn("p-3 rounded-xl border border-border-main flex justify-between items-center cursor-pointer hover:border-p transition-colors", i === 0 && "border-p bg-p-light/30")}>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-text-muted">{s.duration}</p>
                    </div>
                    <p className="font-bold">{s.price}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Available times</p>
              <div className="grid grid-cols-4 gap-2 mb-8">
                {['9:00', '9:45', '10:30', '11:15', '12:00', '12:45', '1:30', '2:15'].map((t, i) => (
                  <div key={i} className={cn("py-2 text-center rounded-lg text-sm border border-border-main transition-all", i === 3 ? "bg-p text-white border-p" : "hover:border-p cursor-pointer")}>
                    {t}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleStart}
                className="w-full bg-p text-white py-3 rounded-xl font-bold shadow-brand hover:bg-p-dark transition-colors"
              >
                Confirm Haircut — 11:15 AM
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo Strip */}
      <section className="bg-bg-secondary py-12 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-8">Works great for...</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Hair salons', 'Personal trainers', 'Tutors', 'Therapists', 'Consultants', 'Photographers', 'Clinics'].map((p, i) => (
              <motion.span 
                key={i} 
                whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                className="px-6 py-2 bg-white rounded-full text-text-secondary border border-border-main shadow-sm whitespace-nowrap cursor-default"
              >
                {p}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">How it works</h2>
            <p className="text-text-secondary">Get your business online in three simple steps.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Add business info', desc: 'Enter your services, hours, and upload your logo.' },
              { step: '2', title: 'Connect Google Calendar', desc: 'Sync your schedule to avoid double bookings automatically.' },
              { step: '3', title: 'Share your link', desc: 'Paste your link in your Instagram bio or send it to clients.' }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-border-main hover:border-p transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-p-light text-p flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-p group-hover:text-white transition-colors">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-text-secondary leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-bg-main">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Everything you need</h2>
            <p className="text-text-secondary">Powerful features to help you grow your business.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Google Calendar sync', desc: 'Bookings appear instantly in your calendar.', color: 'bg-blue-500' },
              { title: 'Real-time availability', desc: 'Clients only see when you are actually free.', color: 'bg-teal-500' },
              { title: 'Custom branded page', desc: 'Your colors, your logo, your business.', color: 'bg-p' },
              { title: 'Booking dashboard', desc: 'Manage all your appointments in one place.', color: 'bg-amber-500' },
              { title: 'Automatic reminders', desc: 'Reduce no-shows with email notifications.', color: 'bg-indigo-500' },
              { title: 'Mobile-first design', desc: 'Looks great on every device, especially phones.', color: 'bg-red-500' }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-2xl border border-border-main hover:shadow-brand-lg transition-all"
              >
                <div className={cn("w-10 h-10 rounded-lg mb-6 flex items-center justify-center text-white font-bold text-sm", f.color)}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-text-secondary">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Zara Ali', role: 'Hair Salon', initial: 'ZA' },
              { name: 'Kamran Raza', role: 'Personal Trainer', initial: 'KR' },
              { name: 'Nadia Baig', role: 'Beauty Therapist', initial: 'NB' }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-2xl border border-border-main"
              >
                <div className="flex gap-1 mb-4 text-amber-brand">
                  {[...Array(5)].map((_, i) => <Check key={i} size={16} />)}
                </div>
                <p className="text-text-main mb-6 italic">"Bookly has completely changed how I manage my salon. No more back-and-forth texts!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-p-light text-p flex items-center justify-center font-bold text-sm">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-text-muted text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-p rounded-[32px] p-12 md:p-24 text-center text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Ready to get booked?</h2>
            <p className="text-white/70 text-xl mb-10 max-w-xl mx-auto">Join thousands of small businesses growing with Bookly.</p>
            <button 
              onClick={handleStart}
              className="bg-white text-p px-10 py-5 rounded-full font-bold text-lg hover:bg-p-light transition-all hover:-translate-y-1 shadow-brand-lg"
            >
              Create my free booking page
            </button>
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"
          ></motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border-main">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-p rounded flex items-center justify-center text-white">
              <Calendar size={14} />
            </div>
            <span className="font-serif text-lg font-bold">Bookly</span>
          </div>
          <p className="text-text-muted text-sm">© 2025 Bookly. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-text-secondary">
            <a href="#" className="hover:text-p">Privacy</a>
            <a href="#" className="hover:text-p">Terms</a>
            <a href="#" className="hover:text-p">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
