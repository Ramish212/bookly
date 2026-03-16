export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface BusinessConfig {
  name: string;
  category: string;
  phone: string;
  city: string;
  slug: string;
  tagline: string;
  logoUrl: string;
  brandColor: string;
  services: Service[];
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export const DEFAULT_CONFIG: BusinessConfig = {
  name: "Ahmed's Salon",
  category: "Hair Salon",
  phone: "+92 300 1234567",
  city: "Lahore",
  slug: "ahmed-salon",
  tagline: "Lahore · Mon–Sat 9am–6pm",
  logoUrl: "",
  brandColor: "#4F46E5",
  services: [
    { id: '1', name: 'Haircut', duration: 45, price: 15 },
    { id: '2', name: 'Beard trim', duration: 20, price: 8 },
    { id: '3', name: 'Haircut + beard', duration: 60, price: 20 },
  ],
  emailNotifications: true,
  smsNotifications: false,
};
