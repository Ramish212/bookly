import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useBusiness } from '../BusinessContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CalendarPage: React.FC = () => {
  const { config } = useBusiness();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('en-GB', { month: 'long' });
  const year = currentDate.getFullYear();

  // Mock bookings for demonstration
  const mockBookings = [
    { id: '1', customer: 'Sarah Johnson', service: 'Haircut', time: '10:30 AM', date: 16, color: 'bg-p-light text-p' },
    { id: '2', customer: 'Michael Chen', service: 'Beard Trim', time: '11:15 AM', date: 16, color: 'bg-teal-light text-teal-brand' },
    { id: '3', customer: 'Emma Wilson', service: 'Haircut + Beard', time: '1:30 PM', date: 17, color: 'bg-amber-light text-amber-brand' },
    { id: '4', customer: 'David Miller', service: 'Haircut', time: '3:00 PM', date: 16, color: 'bg-p-light text-p' },
  ];

  const selectedDateBookings = mockBookings.filter(b => b.date === selectedDate);

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-main">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif mb-1">Calendar</h2>
            <p className="text-text-secondary text-sm">View and manage your appointments</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-border-main shadow-sm">
            <button onClick={prevMonth} className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-sm min-w-[120px] text-center">{monthName} {year}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border-main shadow-brand p-6">
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="text-[10px] font-bold text-text-muted uppercase tracking-widest py-2">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)].map((_, i) => (
                <div key={`empty-${i}`} className="h-24 rounded-xl bg-bg-secondary/30"></div>
              ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const hasBookings = mockBookings.some(b => b.date === day);
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "h-24 p-3 rounded-xl border transition-all text-left flex flex-col gap-2 relative group",
                      selectedDate === day ? "border-p bg-p-light/10 ring-2 ring-p/20" : "border-border-main hover:border-p-muted bg-white"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                      selectedDate === day ? "bg-p text-white" : "text-text-main group-hover:bg-bg-secondary"
                    )}>
                      {day}
                    </span>
                    {hasBookings && (
                      <div className="flex flex-wrap gap-1">
                        {mockBookings.filter(b => b.date === day).slice(0, 2).map(b => (
                          <div key={b.id} className={cn("w-full h-1.5 rounded-full", b.color.split(' ')[0])}></div>
                        ))}
                        {mockBookings.filter(b => b.date === day).length > 2 && (
                          <span className="text-[8px] font-bold text-text-muted">+{mockBookings.filter(b => b.date === day).length - 2} more</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day View / Bookings List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border-main shadow-brand overflow-hidden">
              <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-secondary/30">
                <div>
                  <h3 className="font-bold text-lg">{selectedDate} {monthName}</h3>
                  <p className="text-xs text-text-muted">{selectedDateBookings.length} appointments</p>
                </div>
                <button className="text-text-muted hover:text-text-main">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {selectedDateBookings.length > 0 ? (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      {selectedDateBookings.map((b) => (
                        <div key={b.id} className="flex gap-4 group">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-text-main whitespace-nowrap">{b.time.split(' ')[0]}</span>
                            <span className="text-[10px] font-bold text-text-muted uppercase">{b.time.split(' ')[1]}</span>
                            <div className="w-0.5 flex-1 bg-border-main my-1"></div>
                          </div>
                          <div className={cn("flex-1 p-4 rounded-2xl border border-transparent transition-all hover:border-border-dark", b.color)}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-sm">{b.customer}</h4>
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
                                <Clock size={12} />
                                <span>{b.service}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
                                <User size={12} />
                                <span>Confirmed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center text-text-muted mx-auto mb-4">
                        <CalendarIcon size={32} />
                      </div>
                      <h4 className="font-bold text-text-main mb-1">No appointments</h4>
                      <p className="text-text-secondary text-sm">You're free for the day!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-p p-6 rounded-2xl text-white shadow-brand-lg">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <CalendarIcon size={18} />
                Monthly Overview
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Total Bookings</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Revenue</p>
                  <p className="text-xl font-bold">$1,240</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
