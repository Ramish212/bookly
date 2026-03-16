import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Plus, Clock, MapPin, Phone, Globe, Calendar as CalendarIcon, Database, Loader2 } from 'lucide-react';
import { useBusiness } from '../BusinessContext';
import { useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OnboardingWizard: React.FC = () => {
  const { config, updateConfig, isLoading } = useBusiness();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: 'Business info' },
    { id: 2, label: 'Add services' },
    { id: 3, label: 'Working hours' },
    { id: 4, label: 'Customise page' },
    { id: 5, label: 'Connect calendar' }
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-white">
      {/* Sidebar */}
      <div className="w-[240px] bg-bg-main border-r border-border-main p-8 hidden md:block">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-8">SETUP</p>
        <div className="space-y-6">
          {steps.map((s) => (
            <div 
              key={s.id} 
              onClick={() => setStep(s.id)}
              className={cn(
                "flex items-center gap-3 cursor-pointer transition-colors group",
                step === s.id ? "text-p" : "text-text-secondary hover:text-p"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step === s.id ? "bg-p text-white" : 
                step > s.id ? "bg-teal-brand text-white" : "bg-border-dark text-white group-hover:bg-p-muted"
              )}>
                {step > s.id ? <Check size={14} /> : s.id}
              </div>
              <span className={cn("text-sm font-medium", step === s.id && "font-bold")}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-16 overflow-y-auto">
        <div className="max-w-[640px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-serif mb-2">Tell us about your business</h2>
                <p className="text-text-secondary mb-8 text-sm">This information will be shown on your public booking page.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Business name</label>
                    <input 
                      type="text" 
                      value={config.name}
                      onChange={(e) => updateConfig({ name: e.target.value })}
                      placeholder="Ahmed's Salon"
                      className="w-full p-3 rounded-xl border border-border-main focus:border-p outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Category</label>
                    <select 
                      value={config.category}
                      onChange={(e) => updateConfig({ category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-border-main focus:border-p outline-none transition-colors bg-white"
                    >
                      <option>Hair Salon</option>
                      <option>Personal Trainer</option>
                      <option>Tutor</option>
                      <option>Therapist</option>
                      <option>Consultant</option>
                      <option>Photographer</option>
                      <option>Clinic</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-2">Phone</label>
                      <input 
                        type="text" 
                        value={config.phone}
                        onChange={(e) => updateConfig({ phone: e.target.value })}
                        className="w-full p-3 rounded-xl border border-border-main focus:border-p outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-2">City</label>
                      <input 
                        type="text" 
                        value={config.city}
                        onChange={(e) => updateConfig({ city: e.target.value })}
                        className="w-full p-3 rounded-xl border border-border-main focus:border-p outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Booking URL</label>
                    <div className="flex items-center">
                      <span className="bg-bg-secondary px-4 py-3 rounded-l-xl border border-r-0 border-border-main text-text-muted text-sm">bookly.app/</span>
                      <input 
                        type="text" 
                        value={config.slug}
                        onChange={(e) => updateConfig({ slug: e.target.value })}
                        className="flex-1 p-3 rounded-r-xl border border-border-main focus:border-p outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-serif mb-2">Add your services</h2>
                <p className="text-text-secondary mb-8 text-sm">What can your customers book with you?</p>
                
                <div className="space-y-4 mb-8">
                  {config.services.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-border-main flex justify-between items-center bg-white shadow-sm">
                      <div>
                        <p className="font-bold">{s.name}</p>
                        <p className="text-xs text-text-muted">{s.duration} min · ${s.price}</p>
                      </div>
                      <button 
                        onClick={() => updateConfig({ services: config.services.filter(x => x.id !== s.id) })}
                        className="text-red-brand hover:bg-red-light p-2 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-bg-secondary rounded-2xl border border-border-main">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="col-span-3 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Service name</label>
                      <input type="text" placeholder="e.g. Consultation" className="w-full p-2 text-sm rounded-lg border border-border-main outline-none focus:border-p" />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Duration (min)</label>
                      <input type="number" placeholder="30" className="w-full p-2 text-sm rounded-lg border border-border-main outline-none focus:border-p" />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Price ($)</label>
                      <input type="number" placeholder="50" className="w-full p-2 text-sm rounded-lg border border-border-main outline-none focus:border-p" />
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-p font-bold text-sm hover:text-p-dark transition-colors">
                    <Plus size={16} /> Add service
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-serif mb-2">Set your working hours</h2>
                <p className="text-text-secondary mb-8 text-sm">When are you available for bookings?</p>
                
                <div className="flex gap-2 mb-8">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <button 
                      key={d}
                      className={cn(
                        "flex-1 py-3 rounded-xl border font-bold text-sm transition-all",
                        ['Sat', 'Sun'].includes(d) ? "border-border-main text-text-muted" : "bg-p text-white border-p"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Opening time</label>
                    <select className="w-full p-3 rounded-xl border border-border-main bg-white outline-none focus:border-p">
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Closing time</label>
                    <select className="w-full p-3 rounded-xl border border-border-main bg-white outline-none focus:border-p">
                      <option>5:00 PM</option>
                      <option>6:00 PM</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-4 bg-bg-secondary rounded-xl border border-border-main text-sm text-text-secondary flex items-center gap-3">
                  <Clock size={16} className="text-p" />
                  Total: 40 hours per week
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-serif mb-2">Customise your page</h2>
                <p className="text-text-secondary mb-8 text-sm">Make your booking page match your brand.</p>
                
                <div className="bg-p-light/30 p-8 rounded-2xl border border-p-muted text-center mb-8">
                  <div className="w-16 h-16 bg-p rounded-2xl mx-auto mb-6 flex items-center justify-center text-white">
                    <Globe size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Visual Customizer</h3>
                  <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">Upload your logo, pick your brand colors, and write a catchy tagline.</p>
                  <button 
                    onClick={() => navigate('/customizer')}
                    className="bg-p text-white px-8 py-3 rounded-full font-bold hover:bg-p-dark transition-all shadow-brand"
                  >
                    Open full customizer
                  </button>
                </div>
                <p className="text-center text-text-muted text-xs">You can also customise from your dashboard anytime.</p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-serif mb-2">Connect Google Calendar</h2>
                <p className="text-text-secondary mb-8 text-sm">Sync your schedule to automate your business.</p>
                
                <button 
                  onClick={() => navigate('/gcal')}
                  className="w-full bg-teal-brand text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-all shadow-brand flex items-center justify-center gap-3 mb-8"
                >
                  <CalendarIcon size={24} />
                  Connect Google Calendar
                </button>
                
                <div className="bg-bg-secondary p-6 rounded-2xl border border-border-main space-y-4">
                  {[
                    'Every booking creates a Google Calendar event',
                    'Blocked calendar times hide from customers',
                    'Cancellations delete the event automatically'
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                      <div className="w-5 h-5 bg-teal-light text-teal-brand rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </div>
                      {b}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border-main flex justify-between items-center">
            {step > 1 ? (
              <button onClick={prevStep} className="text-text-secondary font-bold hover:text-text-main transition-colors">Back</button>
            ) : (
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={cn("w-1.5 h-1.5 rounded-full", step === i ? "bg-p w-4" : "bg-border-dark")}></div>
                ))}
              </div>
            )}
            
            <button 
              onClick={step === 5 ? () => navigate('/dashboard') : nextStep}
              className="bg-p text-white px-8 py-3 rounded-full font-bold hover:bg-p-dark transition-all shadow-brand"
            >
              {step === 5 ? 'Finish & go to dashboard' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
