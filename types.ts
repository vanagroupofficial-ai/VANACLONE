export interface PrivacyConfig {
  randomizeId: boolean;
  spoofLocation: boolean;
  incognitoMode: boolean;
  blockTrackers: boolean;
  hideRoot: boolean; // New
}

export interface DeviceIdentity {
  imei: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
}

export interface Profile {
  id: string;
  name: string;
  appName: string; // e.g. "WhatsApp", "Facebook"
  description: string;
  themeColor: string; // e.g., 'blue', 'red', 'green'
  icon: string; // Lucide icon name placeholder
  createdAt: number;
  stats: {
    itemsCount: number;
    lastAccessed: number;
  };
  tags: string[];
  privacyConfig: PrivacyConfig;
  deviceIdentity?: DeviceIdentity; // New field for spoofed data
}

export interface AppState {
  profiles: Profile[];
  activeProfileId: string | null;
  isModalOpen: boolean;
}

export interface GeminiSuggestion {
  description: string;
  themeColor: string;
  tags: string[];
  privacyConfig: PrivacyConfig;
  securityNote: string;
  deviceIdentity: DeviceIdentity;
}