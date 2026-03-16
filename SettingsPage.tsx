import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { useBusiness } from '../BusinessContext';
import { useAuth } from '../AuthContext';
import { User, Mail, Shield, Bell, CreditCard, ExternalLink } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Toggle: React.FC<{ enabled: boolean; onChange: (val: boolean) => void }> = ({ enabled, onChange }) => (
  <button 
    onClick={() => onChange(!enabled)}
    className={cn(
      "w-10 h-5 rounded-full transition-colors relative",
      enabled ? "bg-p" : "bg-border-dark"
    )}
  >
    <div className={cn(
      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
      enabled ? "left-6" : "left-1"
    )} />
  </button>
);

export const SettingsPage: React.FC = () => {
  const { config, updateConfig } = useBusiness();
  const { user } = useAuth();

  const sections = [
    {
      title: 'Account Information',
      icon: User,
      fields: [
        { label: 'Full Name', value: user?.user_metadata?.full_name || 'Not set', editable: true },
        { label: 'Email Address', value: user?.email || 'Not set', editable: false },
        { label: 'Phone Number', value: config.phone || 'Not set', editable: true },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      fields: [
        { label: 'Password', value: '••••••••••••', editable: true },
        { label: 'Two-Factor Auth', value: 'Disabled', editable: true },
      ]
    }
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-main">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif mb-1">Settings</h2>
          <p className="text-text-secondary text-sm">Manage your account preferences and security</p>
        </div>

        <div className="max-w-3xl space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-border-main shadow-brand overflow-hidden">
              <div className="p-6 border-b border-border-main flex items-center gap-3">
                <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center text-text-secondary">
                  <section.icon size={20} />
                </div>
                <h3 className="font-bold text-lg">{section.title}</h3>
              </div>
              <div className="p-6 space-y-6">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase mb-1">{field.label}</p>
                      <p className="text-sm font-medium text-text-main">{field.value}</p>
                    </div>
                    {field.editable && (
                      <button className="text-p text-xs font-bold hover:underline">Edit</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notification Settings Section */}
          <div className="bg-white rounded-2xl border border-border-main shadow-brand overflow-hidden">
            <div className="p-6 border-b border-border-main flex items-center gap-3">
              <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center text-text-secondary">
                <Bell size={20} />
              </div>
              <h3 className="font-bold text-lg">Notification Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-text-main">Email Reminders</p>
                  <p className="text-xs text-text-secondary">Send automated email reminders to customers before their booking</p>
                </div>
                <Toggle 
                  enabled={config.emailNotifications} 
                  onChange={(val) => updateConfig({ emailNotifications: val })} 
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-text-main">SMS Notifications</p>
                  <p className="text-xs text-text-secondary">Send SMS alerts for new bookings and cancellations</p>
                </div>
                <Toggle 
                  enabled={config.smsNotifications} 
                  onChange={(val) => updateConfig({ smsNotifications: val })} 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border-main shadow-brand p-6">
            <h3 className="font-bold text-lg mb-4">Subscription</h3>
            <div className="flex items-center justify-between p-4 bg-p-light/30 rounded-xl border border-p-muted">
              <div className="flex items-center gap-3">
                <CreditCard className="text-p" />
                <div>
                  <p className="text-sm font-bold text-p">Free Plan</p>
                  <p className="text-[10px] text-p/70">Up to 50 bookings / month</p>
                </div>
              </div>
              <button className="bg-p text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-p-dark transition-all">
                Upgrade
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button className="text-red-brand text-sm font-bold hover:underline flex items-center gap-2">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
