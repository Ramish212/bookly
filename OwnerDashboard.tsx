import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar as CalendarIcon, 
  Users, 
  List, 
  Globe, 
  MoreHorizontal,
  Copy,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  Loader2
} from 'lucide-react';
import { useBusiness } from '../BusinessContext';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OwnerDashboard: React.FC = () => {
  const { config, isLoading: businessLoading } = useBusiness();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Today');

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  const currentMonth = new Date().toLocaleString('en-GB', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();

  const stats = [
    { label: "Today's bookings", value: "0", trend: "No bookings yet", color: "text-text-muted" },
    { label: "This week", value: "0", trend: "Start growing", color: "text-text-muted" },
    { label: `${currentMonth} revenue`, value: "$0", trend: "0 vs last month", color: "text-text-muted" },
    { label: "New customers", value: "0", trend: "Welcome new guests", color: "text-text-muted" }
  ];

  const bookings: any[] = [];

  if (businessLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] bg-bg-main">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={40} className="text-p animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-main">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif mb-1">Good morning, {firstName}</h2>
          <p className="text-text-secondary text-sm">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · 0 bookings today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-border-main shadow-brand">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">{s.label}</p>
              <h3 className="text-2xl font-serif mb-1">{s.value}</h3>
              <p className={cn("text-[10px] font-bold", s.color)}>{s.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border-main shadow-brand overflow-hidden">
            <div className="p-6 border-b border-border-main flex justify-between items-center">
              <div className="flex gap-6">
                {['Today', 'Upcoming', 'All bookings'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-sm font-bold pb-6 -mb-6 transition-all border-b-2",
                      activeTab === tab ? "text-p border-p" : "text-text-muted border-transparent hover:text-text-secondary"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="text-text-muted hover:text-text-main">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((b, i) => (
                    <div key={b.id} className={cn("flex items-center gap-4", i !== bookings.length - 1 && "pb-6 border-b border-border-main")}>
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", b.color)}>
                        {b.initial}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{b.name}</p>
                        <p className="text-xs text-text-muted">{b.service} · {b.duration} · {b.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{b.time}</p>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          b.status === 'Confirmed' ? "bg-teal-light text-teal-brand" : "bg-amber-light text-amber-brand"
                        )}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center text-text-muted mx-auto mb-4">
                    <CalendarIcon size={32} />
                  </div>
                  <h4 className="font-bold text-text-main mb-1">No bookings found</h4>
                  <p className="text-text-secondary text-sm">Share your link to start receiving bookings</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Booking Link */}
            <div className="bg-white p-6 rounded-2xl border border-border-main shadow-brand">
              <h4 className="text-sm font-bold mb-4">Your booking link</h4>
              <div className="bg-bg-secondary p-3 rounded-xl border border-border-main flex items-center gap-2 mb-4">
                <span className="text-xs text-p font-medium truncate">bookly.app/{config.slug}</span>
                <button className="text-text-muted hover:text-p ml-auto">
                  <Copy size={16} />
                </button>
              </div>
              <button className="w-full bg-white border border-border-dark py-2.5 rounded-xl font-bold text-sm hover:bg-bg-secondary transition-all">
                Copy link
              </button>
            </div>

            {/* Google Calendar */}
            <div className="bg-white p-6 rounded-2xl border border-border-main shadow-brand">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold">Google Calendar</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-text-muted rounded-full"></div>
                  <span className="text-[10px] font-bold text-text-muted uppercase">Not connected</span>
                </div>
              </div>
              <p className="text-xs text-text-muted mb-4">{user?.email}</p>
              <button className="w-full text-text-secondary text-xs font-bold hover:text-p transition-colors">
                Connect calendar
              </button>
            </div>

            {/* Mini Calendar */}
            <div className="bg-white p-6 rounded-2xl border border-border-main shadow-brand">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold">{currentMonth} {currentYear}</h4>
                <div className="flex gap-2">
                  <button className="text-text-muted hover:text-text-main"><ChevronLeft size={18} /></button>
                  <button className="text-text-muted hover:text-text-main"><ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={`${d}-${i}`} className="text-[10px] font-bold text-text-muted">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={cn(
                    "h-8 flex flex-col items-center justify-center rounded-lg text-xs relative",
                    i + 1 === currentDay ? "bg-p text-white font-bold" : "text-text-secondary hover:bg-bg-secondary cursor-pointer"
                  )}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade Card */}
            <div className="bg-p p-6 rounded-2xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Upgrade to Pro</h4>
                <p className="text-white/70 text-xs mb-4">Get custom domains, SMS reminders, and advanced analytics.</p>
                <button className="bg-white text-p px-4 py-2 rounded-full font-bold text-[10px] hover:bg-p-light transition-all">
                  View plans
                </button>
              </div>
              <TrendingUp size={64} className="absolute -bottom-4 -right-4 text-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
