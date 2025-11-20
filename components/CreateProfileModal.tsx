import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Shield, Smartphone, MapPin, EyeOff, Fingerprint, Cpu, Globe, Search, Grid, List, CheckCircle2 } from 'lucide-react';
import { Profile, GeminiSuggestion, PrivacyConfig, DeviceIdentity } from '../types';
import { suggestProfileConfig } from '../services/geminiService';

interface CreateProfileModalProps {
  onClose: () => void;
  onCreate: (profile: Profile) => void;
}

// Mock list of "Installed" apps to simulate native access
const MOCK_INSTALLED_APPS = [
  { name: 'WhatsApp', pkg: 'com.whatsapp', category: 'Social' },
  { name: 'Facebook', pkg: 'com.facebook.katana', category: 'Social' },
  { name: 'Instagram', pkg: 'com.instagram.android', category: 'Social' },
  { name: 'TikTok', pkg: 'com.zhiliaoapp.musically', category: 'Video' },
  { name: 'Messenger', pkg: 'com.facebook.orca', category: 'Social' },
  { name: 'Telegram', pkg: 'org.telegram.messenger', category: 'Social' },
  { name: 'Shopee', pkg: 'com.shopee.id', category: 'Shopping' },
  { name: 'Mobile Legends', pkg: 'com.mobile.legends', category: 'Game' },
  { name: 'PUBG Mobile', pkg: 'com.tencent.ig', category: 'Game' },
  { name: 'Free Fire', pkg: 'com.dts.freefireth', category: 'Game' },
  { name: 'Gojek', pkg: 'com.gojek.app', category: 'Lifestyle' },
  { name: 'Dana', pkg: 'id.dana', category: 'Finance' },
];

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ onClose, onCreate }) => {
  // Stages: 'scanning' -> 'list' -> 'config'
  const [stage, setStage] = useState<'scanning' | 'list' | 'config'>('scanning');
  const [scannedCount, setScannedCount] = useState(0);

  const [appName, setAppName] = useState('');
  const [customName, setCustomName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('indigo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [securityNote, setSecurityNote] = useState('');
  const [deviceIdentity, setDeviceIdentity] = useState<DeviceIdentity | null>(null);
  
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyConfig>({
    randomizeId: false,
    spoofLocation: false,
    incognitoMode: false,
    blockTrackers: false,
    hideRoot: false,
  });

  // Simulate scanning device packages on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setScannedCount(prev => {
        if (prev >= 142) {
          clearInterval(interval);
          setStage('list');
          return 142;
        }
        return prev + Math.floor(Math.random() * 10);
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleAppSelect = async (selectedApp: string) => {
    setAppName(selectedApp);
    setStage('config');
    setIsGenerating(true);
    
    // Immediately trigger config generation
    try {
      const suggestion: GeminiSuggestion = await suggestProfileConfig(selectedApp);
      setDescription(suggestion.description);
      setTheme(suggestion.themeColor.toLowerCase());
      setTags(suggestion.tags);
      setPrivacyConfig(suggestion.privacyConfig);
      setSecurityNote(suggestion.securityNote);
      setDeviceIdentity(suggestion.deviceIdentity);
      setCustomName(`${selectedApp} (Clone)`);
    } catch (error) {
      console.error("Failed to generate suggestion", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: customName || appName,
      appName: appName,
      description,
      themeColor: theme,
      icon: 'Box',
      createdAt: Date.now(),
      stats: {
        itemsCount: 0,
        lastAccessed: Date.now(),
      },
      tags: tags.length > 0 ? tags : ['Cloned'],
      privacyConfig,
      deviceIdentity: deviceIdentity || undefined
    };
    onCreate(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700/10 max-h-[90vh] flex flex-col h-full md:h-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-900 text-white shrink-0">
          <div className="flex items-center gap-2">
             {stage === 'scanning' ? <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> : <Shield className="w-5 h-5 text-emerald-400" />}
             <h3 className="text-lg font-semibold">
                {stage === 'scanning' ? 'System Scan' : stage === 'list' ? 'Select App' : 'Clone Config'}
             </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50">
          
          {/* STAGE 1: SCANNING */}
          {stage === 'scanning' && (
            <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-emerald-500 animate-spin"></div>
                  <Smartphone className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
               </div>
               <div className="text-center">
                  <h4 className="text-lg font-bold text-gray-900">Scanning Packages...</h4>
                  <p className="text-sm text-gray-500 mt-1">Found {scannedCount} installed applications</p>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-100" style={{ width: `${(scannedCount / 142) * 100}%` }}></div>
               </div>
               <div className="font-mono text-xs text-gray-400">
                  /data/app/com.android.vending... OK
               </div>
            </div>
          )}

          {/* STAGE 2: APP LIST */}
          {stage === 'list' && (
            <div className="p-4">
               <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-4 sticky top-0 z-10">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Search installed apps..." 
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-2">
                  {MOCK_INSTALLED_APPS.map((app) => (
                     <button 
                        key={app.pkg}
                        onClick={() => handleAppSelect(app.name)}
                        className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
                     >
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                           {app.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                           <div className="font-bold text-gray-900">{app.name}</div>
                           <div className="text-xs text-gray-500 font-mono">{app.pkg}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                           <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-white" />
                        </div>
                     </button>
                  ))}
                   
                   {/* Manual option */}
                   <button 
                        onClick={() => setStage('config')}
                        className="flex items-center justify-center gap-2 p-4 mt-2 text-indigo-600 font-medium text-sm bg-indigo-50 rounded-xl border border-dashed border-indigo-200 hover:bg-indigo-100"
                     >
                        App not listed? Type manually
                     </button>
               </div>
            </div>
          )}

          {/* STAGE 3: CONFIGURATION */}
          {stage === 'config' && (
             <form onSubmit={handleSubmit} className="p-0">
             <div className="p-6 space-y-6">
               
               {/* If manually entered */}
               {!appName && (
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">App Name</label>
                   <input
                     type="text"
                     value={appName}
                     onChange={(e) => setAppName(e.target.value)}
                     className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                     placeholder="Type application name"
                     required
                   />
                 </div>
               )}

               {/* Loading State */}
               {isGenerating && (
                   <div className="flex flex-col items-center justify-center py-8 space-y-4">
                       <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                       <div className="text-center">
                           <h4 className="font-bold text-gray-900">Generating Identity...</h4>
                           <p className="text-xs text-gray-500">Creating unique IMEI & Location</p>
                       </div>
                   </div>
               )}
   
               {/* Config Section */}
               {(!isGenerating && (appName)) && (
                 <div className="space-y-6 animate-fade-in">
                    
                    {/* Device Spoofing Card */}
                    {deviceIdentity && (
                      <div className="bg-gray-900 rounded-xl p-4 text-white shadow-lg border border-gray-800">
                         <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2 text-emerald-400">
                             <Cpu className="w-4 h-4" />
                             <span className="text-xs font-bold uppercase tracking-wider">Device Identity Spoofing</span>
                           </div>
                           <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/30">ACTIVE</span>
                         </div>
                         
                         <div className="space-y-2 text-sm">
                           <div className="flex justify-between border-b border-gray-800 pb-1">
                             <span className="text-gray-400">Model</span>
                             <span className="font-mono text-gray-200">{deviceIdentity.manufacturer} {deviceIdentity.model}</span>
                           </div>
                           <div className="flex justify-between border-b border-gray-800 pb-1">
                             <span className="text-gray-400">IMEI</span>
                             <span className="font-mono text-yellow-400">{deviceIdentity.imei}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-400">Location</span>
                             <div className="flex items-center gap-1">
                               <Globe className="w-3 h-3 text-blue-400" />
                               <span className="font-mono text-blue-300">{deviceIdentity.location.city}</span>
                             </div>
                           </div>
                         </div>
                      </div>
                    )}
   
                    <div className="space-y-2">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Privacy Options</label>
                       
                       <div className="grid grid-cols-1 gap-2">
                           <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${privacyConfig.randomizeId ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-gray-200'}`}>
                               <div className="flex items-center gap-3">
                                   <Fingerprint className={`w-5 h-5 ${privacyConfig.randomizeId ? 'text-emerald-600' : 'text-gray-400'}`} />
                                   <div>
                                       <div className="text-sm font-bold text-gray-900">Randomize Android ID</div>
                                   </div>
                               </div>
                               <input 
                                   type="checkbox" 
                                   checked={privacyConfig.randomizeId} 
                                   onChange={e => setPrivacyConfig(p => ({...p, randomizeId: e.target.checked}))}
                                   className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                               />
                           </label>
   
                           <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${privacyConfig.spoofLocation ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-gray-200'}`}>
                               <div className="flex items-center gap-3">
                                   <MapPin className={`w-5 h-5 ${privacyConfig.spoofLocation ? 'text-emerald-600' : 'text-gray-400'}`} />
                                   <div>
                                       <div className="text-sm font-bold text-gray-900">Spoof GPS Location</div>
                                   </div>
                               </div>
                               <input 
                                   type="checkbox" 
                                   checked={privacyConfig.spoofLocation} 
                                   onChange={e => setPrivacyConfig(p => ({...p, spoofLocation: e.target.checked}))}
                                   className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                               />
                           </label>
                           
                           <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${privacyConfig.hideRoot ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-gray-200'}`}>
                               <div className="flex items-center gap-3">
                                   <EyeOff className={`w-5 h-5 ${privacyConfig.hideRoot ? 'text-emerald-600' : 'text-gray-400'}`} />
                                   <div>
                                       <div className="text-sm font-bold text-gray-900">Hide Root Access</div>
                                   </div>
                               </div>
                               <input 
                                   type="checkbox" 
                                   checked={privacyConfig.hideRoot} 
                                   onChange={e => setPrivacyConfig(p => ({...p, hideRoot: e.target.checked}))}
                                   className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                               />
                           </label>
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Clone Name</label>
                       <input
                           type="text"
                           value={customName}
                           onChange={(e) => setCustomName(e.target.value)}
                           className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-sm"
                           placeholder="App Name (Clone)"
                       />
                    </div>
                 </div>
               )}
             </div>
   
             {(!isGenerating) && (
                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl sticky bottom-0">
                 <button
                   type="button"
                   onClick={() => setStage('list')}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                 >
                   Back
                 </button>
                 <button
                   type="submit"
                   disabled={!appName}
                   className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-gray-900/20"
                 >
                   <Smartphone className="w-4 h-4" />
                   Create Clone
                 </button>
               </div>
             )}
           </form>
          )}
        </div>
      </div>
    </div>
  );
};