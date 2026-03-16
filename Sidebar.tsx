import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar as CalendarIcon, 
  Users, 
  List, 
  Globe, 
  LogOut,
  Loader2
} from 'lucide-react';
import { useBusiness } from '../BusinessContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useBusiness();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Customise page', icon: Globe, path: '/customizer' },
    { label: 'Calendar', icon: CalendarIcon, path: '/calendar' },
    { label: 'Customers', icon: Users, path: '/customers' },
  ];

  const secondaryItems = [
    { label: 'Services', icon: List, path: '/services' },
    { label: 'Google Calendar', icon: CalendarIcon, path: '/gcal' },
    { label: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="w-[220px] bg-white border-r border-border-main p-4 hidden md:flex flex-col h-full">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <div 
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all font-medium text-sm",
              location.pathname === item.path ? "bg-p-light text-p" : "text-text-secondary hover:bg-bg-secondary"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </div>
        ))}
      </div>
      
      <div className="my-4 border-t border-border-main"></div>
      
      <div className="mb-4 px-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-[10px] font-bold text-teal-brand uppercase tracking-wider animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            Saving...
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            <div className="w-1 h-1 bg-teal-brand rounded-full" />
            All changes saved
          </div>
        )}
      </div>

      <div className="space-y-1 flex-1">
        {secondaryItems.map((item) => (
          <div 
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all font-medium text-sm",
              location.pathname === item.path ? "bg-p-light text-p" : "text-text-secondary hover:bg-bg-secondary"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </div>
        ))}
      </div>

      <div 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all font-medium text-sm text-red-brand hover:bg-red-light mt-auto"
      >
        <LogOut size={18} />
        Logout
      </div>
    </div>
  );
};
