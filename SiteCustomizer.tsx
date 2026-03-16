import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, Check, Copy, Database, Loader2, Globe, Sparkles } from 'lucide-react';
import { useBusiness } from '../BusinessContext';
import { useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SiteCustomizer: React.FC = () => {
  const { config, updateConfig, isLoading, saveToSupabase } = useBusiness();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    await saveToSupabase();
    setTimeout(() => setIsPublishing(false), 1000);
  };

  const colors = [
    '#4F46E5', // Indigo
    '#0D9488', // Teal
    '#DC2626', // Red
    '#D97706', // Amber
    '#7C3AED', // Violet
    '#DB2777', // Pink
    '#111827'  // Black
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-white">
      {/* Left Panel: Settings */}
      <div className="w-[340px] border-r border-border-main p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold">Customise page</h3>
          <div className="flex flex-col items-end">
            <button onClick={() => navigate(-1)} className="text-text-muted hover:text-text-main flex items-center gap-1 text-sm font-medium mb-1">
              <ArrowLeft size={16} /> Back
            </button>
            {isLoading && !isPublishing && (
              <span className="text-[10px] text-teal-brand font-bold animate-pulse flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> saving...
              </span>
            )}
            {!isLoading && !isPublishing && (
              <span className="text-[10px] text-text-muted font-bold flex items-center gap-1">
                <Check size={10} /> saved
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <button 
            onClick={handlePublish}
            disabled={isLoading || isPublishing}
            className={cn(
              "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-brand",
              isPublishing ? "bg-teal-brand text-white" : "bg-p text-white hover:bg-p-dark"
            )}
          >
            {isPublishing ? (
              <>
                <Check size={18} />
                Published!
              </>
            ) : isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Globe size={18} />
                Publish changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-8">
          {/* Section 1: Business name */}
          <div className="pb-6 border-b border-border-main">
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Business name</label>
            <input 
              type="text" 
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              className="w-full p-3 rounded-xl border border-border-main focus:border-p outline-none transition-colors text-sm"
            />
          </div>

          {/* Section 2: Logo */}
          <div className="pb-6 border-b border-border-main">
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Logo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-1.5 border-dashed border-border-dark rounded-2xl p-6 text-center cursor-pointer hover:border-p transition-colors"
            >
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold overflow-hidden"
                style={{ backgroundColor: config.brandColor }}
              >
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  config.name.charAt(0)
                )}
              </div>
              <p className="text-xs font-bold text-text-main mb-1">Click to upload your logo</p>
              <p className="text-[10px] text-text-muted">PNG or JPG · shown as circle</p>
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          {/* Section 3: Brand color */}
          <div className="pb-6 border-b border-border-main">
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">Brand color</label>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button 
                  key={c}
                  onClick={() => updateConfig({ brandColor: c })}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all relative",
                    config.brandColor === c && "ring-2 ring-offset-2 ring-text-main"
                  )}
                  style={{ backgroundColor: c }}
                >
                  {config.brandColor === c && <Check size={14} className="text-white absolute inset-0 m-auto" />}
                </button>
              ))}
              <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500"></button>
            </div>
          </div>

          {/* Section 4: Page URL */}
          <div className="pb-6 border-b border-border-main">
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Page URL</label>
            <div className="flex items-center text-sm">
              <span className="text-text-muted">bookly.app/</span>
              <input 
                type="text" 
                value={config.slug}
                onChange={(e) => updateConfig({ slug: e.target.value })}
                className="flex-1 p-1 border-b border-border-main focus:border-p outline-none transition-colors ml-1"
              />
            </div>
            <p className="text-[10px] text-text-muted mt-2">bookly.app/{config.slug}</p>
          </div>

          {/* Section 5: Tagline */}
          <div>
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Tagline</label>
            <input 
              type="text" 
              value={config.tagline}
              onChange={(e) => updateConfig({ tagline: e.target.value })}
              className="w-full p-3 rounded-xl border border-border-main focus:border-p outline-none transition-colors text-sm"
            />
          </div>
        </div>

        <div className="mt-12 space-y-3">
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full bg-p text-white py-3 rounded-xl font-bold hover:bg-p-dark transition-all shadow-brand"
          >
            Continue to calendar →
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full text-text-secondary py-3 rounded-xl font-bold hover:bg-bg-secondary transition-all"
          >
            Go to dashboard
          </button>
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="flex-1 bg-bg-secondary p-12 flex flex-col items-center">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-8">Live preview</p>
        
        {/* Phone Frame */}
        <div className="w-[280px] bg-white rounded-[32px] border-[8px] border-text-main shadow-2xl overflow-hidden flex flex-col h-[560px]">
          <div 
            className="p-6 text-white text-center"
            style={{ backgroundColor: config.brandColor }}
          >
            <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-white/20 flex items-center justify-center text-xl font-bold overflow-hidden">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                config.name.charAt(0)
              )}
            </div>
            <h4 className="font-bold text-sm">{config.name}</h4>
            <p className="text-[10px] text-white/70">{config.tagline}</p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-text-muted uppercase mb-3">Choose a service</p>
            <div className="space-y-2 mb-6">
              {config.services.map((s, i) => (
                <div 
                  key={s.id} 
                  className={cn(
                    "p-3 rounded-xl border border-border-main flex justify-between items-center",
                    i === 2 && "border-2 bg-p-light/30"
                  )}
                  style={{ borderColor: i === 2 ? config.brandColor : undefined }}
                >
                  <div>
                    <p className="text-xs font-bold">{s.name}</p>
                    <p className="text-[9px] text-text-muted">{s.duration} min</p>
                  </div>
                  <p className="text-xs font-bold">${s.price}</p>
                </div>
              ))}
            </div>
            
            <button 
              className="w-full text-white py-3 rounded-xl text-xs font-bold shadow-brand"
              style={{ backgroundColor: config.brandColor }}
            >
              Book now
            </button>
            <p className="text-center text-[9px] text-text-muted mt-4">This is what your customers see</p>
          </div>
        </div>

        {/* Link Box */}
        <div className="mt-8 bg-white p-4 rounded-2xl border border-border-main w-[280px]">
          <p className="text-[10px] font-bold text-text-muted uppercase mb-2">Your booking link</p>
          <div className="flex items-center gap-2 bg-bg-secondary p-2 rounded-lg border border-border-main">
            <span className="text-[10px] text-p font-medium truncate">bookly.app/{config.slug}</span>
            <button className="text-text-muted hover:text-p ml-auto">
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
