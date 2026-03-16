import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Calendar as CalendarIcon, Clock, MapPin, Phone, ChevronRight, Loader2, Globe } from 'lucide-react';
import { useBusiness } from '../BusinessContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CustomerBookingPage: React.FC = () => {
  const { config } = useBusiness();
  const [selectedService, setSelectedService] = useState(config.services[0]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<'idle' | 'loading' | 'success'>('idle');

  const dates = [
    { day: 'Sat', date: '14' },
    { day: 'Sun', date: '15' },
    { day: 'Mon', date: '16' },
    { day: 'Tue', date: '17' },
    { day: 'Wed', date: '18' },
    { day: 'Thu', date: '19' },
    { day: 'Fri', date: '20' }
  ];

  const times = [
    { time: '9:00', taken: true },
    { time: '9:45', taken: true },
    { time: '10:30', taken: false },
    { time: '11:15', taken: false },
    { time: '12:00', taken: false },
    { time: '12:45', taken: true },
    { time: '1:30', taken: false },
    { time: '2:15', taken: false },
    { time: '3:00', taken: false },
    { time: '3:45', taken: true },
    { time: '4:30', taken: false },
    { time: '5:15', taken: false }
  ];

  const handleBook = () => {
    if (!selectedTime) return;
    setBookingState('loading');
    setTimeout(() => {
      setBookingState('success');
    }, 1500);
  };

  if (bookingState === 'success') {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[420px] w-full bg-white rounded-[24px] p-10 text-center shadow-brand-lg border border-border-main"
        >
          <div className="w-16 h-16 bg-teal-light rounded-full mx-auto mb-6 flex items-center justify-center text-teal-brand">
            <Check size={32} />
          </div>
          <h2 className="text-3xl font-serif mb-4">Booking confirmed!</h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            We've sent a confirmation to your phone. See you on {dates[selectedDate].day} {dates[selectedDate].date} March at {selectedTime}.
          </p>
          <button 
            onClick={() => setBookingState('idle')}
            className="w-full bg-p text-white py-4 rounded-xl font-bold hover:bg-p-dark transition-all shadow-brand"
            style={{ backgroundColor: config.brandColor }}
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-10 px-4">
      <div className="max-w-[420px] mx-auto">
        {/* Business Card */}
        <div className="bg-white rounded-[20px] border border-border-main shadow-brand overflow-hidden mb-6">
          <div 
            className="p-8 text-white text-center"
            style={{ backgroundColor: config.brandColor }}
          >
            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden border-4 border-white/10">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                config.name.charAt(0)
              )}
            </div>
            <h1 className="text-2xl font-serif mb-1">{config.name}</h1>
            <p className="text-white/70 text-sm mb-4">{config.tagline}</p>
            <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
              <Globe size={12} />
              <span>bookly.app/{config.slug}</span>
            </div>
          </div>
          
          <div className="p-6">
            {/* Service Selector */}
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">Choose a service</label>
              <div className="space-y-3">
                {config.services.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group",
                      selectedService.id === s.id ? "border-2 bg-p-light/20" : "border-border-main hover:border-p-muted"
                    )}
                    style={{ 
                      borderColor: selectedService.id === s.id ? config.brandColor : undefined,
                      backgroundColor: selectedService.id === s.id ? `${config.brandColor}10` : undefined
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedService.id === s.id ? "border-p" : "border-border-dark"
                      )} style={{ borderColor: selectedService.id === s.id ? config.brandColor : undefined }}>
                        {selectedService.id === s.id && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.brandColor }}></div>}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{s.name}</p>
                        <p className="text-[10px] text-text-muted">{s.duration} min</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm">${s.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selector */}
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">Pick a date</label>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {dates.map((d, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedDate(i)}
                    className={cn(
                      "flex-shrink-0 w-14 py-3 rounded-xl border transition-all flex flex-col items-center gap-1",
                      selectedDate === i ? "text-white shadow-brand" : "bg-white border-border-main text-text-secondary hover:border-p-muted"
                    )}
                    style={{ backgroundColor: selectedDate === i ? config.brandColor : undefined, borderColor: selectedDate === i ? config.brandColor : undefined }}
                  >
                    <span className="text-[10px] font-bold uppercase">{d.day}</span>
                    <span className="text-lg font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">
                Available times for {dates[selectedDate].day} {dates[selectedDate].date} Mar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {times.map((t, i) => (
                  <button 
                    key={i}
                    disabled={t.taken}
                    onClick={() => setSelectedTime(t.time)}
                    className={cn(
                      "py-3 rounded-xl border text-sm font-bold transition-all",
                      t.taken ? "bg-bg-secondary text-text-muted border-transparent cursor-not-allowed" : 
                      selectedTime === t.time ? "text-white shadow-brand" : "bg-white border-border-main text-text-main hover:border-p-muted"
                    )}
                    style={{ 
                      backgroundColor: selectedTime === t.time ? config.brandColor : undefined,
                      borderColor: selectedTime === t.time ? config.brandColor : undefined
                    }}
                  >
                    {t.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Details Form */}
            <div className="space-y-4 mb-8">
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">Your details</label>
              <input type="text" placeholder="Your name" className="w-full p-3 rounded-xl border border-border-main outline-none focus:border-p transition-colors text-sm" />
              <input type="tel" placeholder="Phone number" className="w-full p-3 rounded-xl border border-border-main outline-none focus:border-p transition-colors text-sm" />
              <input type="email" placeholder="Email (optional)" className="w-full p-3 rounded-xl border border-border-main outline-none focus:border-p transition-colors text-sm" />
            </div>

            {/* Confirm Button */}
            <button 
              disabled={!selectedTime || bookingState === 'loading'}
              onClick={handleBook}
              className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-brand-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all active:scale-95"
              style={{ backgroundColor: config.brandColor }}
            >
              {bookingState === 'loading' ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Booking...
                </>
              ) : (
                selectedTime ? `Confirm ${selectedService.name} — ${selectedTime} AM` : 'Select a time slot'
              )}
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-text-muted">Powered by <span className="font-bold">Bookly</span></p>
      </div>
    </div>
  );
};
