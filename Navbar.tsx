import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/onboarding') || 
                     location.pathname.startsWith('/customizer') ||
                     location.pathname.startsWith('/settings') ||
                     location.pathname.startsWith('/customers') ||
                     location.pathname.startsWith('/services');

  if (location.pathname === '/booking') return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-p rounded-lg flex items-center justify-center text-white">
              <Calendar size={20} />
            </div>
            <span className="font-serif text-xl font-bold text-text-main">Bookly</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-text-secondary hover:text-p transition-colors">Home</Link>
            <Link to="/pricing" className="text-text-secondary hover:text-p transition-colors">Pricing</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-text-secondary hover:text-p transition-colors">Dashboard</Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border-main">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-main">
                    <div className="w-8 h-8 bg-bg-secondary rounded-full flex items-center justify-center text-text-secondary">
                      <User size={16} />
                    </div>
                    <span className="max-w-[120px] truncate">{user.email}</span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="text-text-muted hover:text-red-brand transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-text-secondary hover:text-p transition-colors font-medium">Sign In</Link>
                <Link to="/signup" className="bg-p text-white px-5 py-2 rounded-full font-medium hover:bg-p-dark transition-all hover:-translate-y-0.5 active:scale-95 shadow-brand">
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
