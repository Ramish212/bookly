import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessConfig, DEFAULT_CONFIG } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { useAuth } from './AuthContext';

interface BusinessContextType {
  config: BusinessConfig;
  updateConfig: (updates: Partial<BusinessConfig>) => void;
  saveToSupabase: () => Promise<void>;
  isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<BusinessConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured || !user) {
        setConfig(DEFAULT_CONFIG);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('sites')
          .select('id, business_name, phone, city, slug, tagline, logo_url, brand_color, email_notifications, sms_notifications, services(*)')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setConfig({
            name: data.business_name,
            category: DEFAULT_CONFIG.category, // Use default since column is missing in DB
            phone: data.phone || DEFAULT_CONFIG.phone,
            city: data.city || DEFAULT_CONFIG.city,
            slug: data.slug,
            tagline: data.tagline || DEFAULT_CONFIG.tagline,
            logoUrl: data.logo_url || DEFAULT_CONFIG.logoUrl,
            brandColor: data.brand_color || DEFAULT_CONFIG.brandColor,
            services: data.services.map((s: any) => ({
              id: s.id,
              name: s.name,
              duration: s.duration_min,
              price: s.price
            })),
            emailNotifications: data.email_notifications ?? DEFAULT_CONFIG.emailNotifications,
            smsNotifications: data.sms_notifications ?? DEFAULT_CONFIG.smsNotifications,
          });
        } else {
          // If no site exists for this user, start with default config but with a unique slug if possible
          setConfig({
            ...DEFAULT_CONFIG,
            name: user.user_metadata?.full_name ? `${user.user_metadata.full_name}'s Business` : DEFAULT_CONFIG.name,
            slug: user.id.slice(0, 8) // Use a portion of user ID as default slug
          });
        }
      } catch (err) {
        console.error('Error loading from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;
    
    // Don't save on initial load if it's just the default
    const isInitialLoad = JSON.stringify(config) === JSON.stringify(DEFAULT_CONFIG);
    if (isInitialLoad) return;

    const timer = setTimeout(() => {
      saveToSupabase();
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [config, user]);

  const updateConfig = (updates: Partial<BusinessConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const saveToSupabase = async () => {
    if (!isSupabaseConfigured || !user) return;

    setIsLoading(true);
    try {
      // Upsert site
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .upsert({
          user_id: user.id,
          slug: config.slug,
          business_name: config.name,
          brand_color: config.brandColor,
          tagline: config.tagline,
          logo_url: config.logoUrl,
          city: config.city,
          phone: config.phone,
          // category: config.category, // Removed to fix PGRST204 error
          email_notifications: config.emailNotifications,
          sms_notifications: config.smsNotifications,
        }, { onConflict: 'user_id' }) // Conflict on user_id now
        .select()
        .single();

      if (siteError) throw siteError;

      // Upsert services
      if (config.services.length > 0) {
        const servicesToUpsert = config.services.map(s => ({
          site_id: siteData.id,
          name: s.name,
          duration_min: s.duration,
          price: s.price
        }));

        const { error: svcError } = await supabase
          .from('services')
          .upsert(servicesToUpsert);

        if (svcError) throw svcError;
      }
      
      console.log('Auto-saved to Supabase');
    } catch (err) {
      console.error('Error saving to Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BusinessContext.Provider value={{ config, updateConfig, saveToSupabase, isLoading }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
  return context;
};
