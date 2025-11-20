import React, { useState, useEffect } from 'react';
import { X, Save, Smartphone, Globe, Lock, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    autoRandomize: true,
    autoSpoof: true,
    hideRootGlobally: true,
    darkMode: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('vanaclone_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('vanaclone_settings', JSON.stringify(settings));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-900 text-white">
          <h3 className="text-lg font-semibold">Global Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
            {/* Privacy Defaults */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Default Privacy Configuration</h4>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Auto-Randomize Identity</div>
                                <div className="text-xs text-gray-500">Generate new device IDs by default</div>
                            </div>
                         </div>
                         <input 
                            type="checkbox" 
                            checked={settings.autoRandomize}
                            onChange={e => setSettings({...settings, autoRandomize: e.target.checked})}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                         />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Auto-Spoof Location</div>
                                <div className="text-xs text-gray-500">Enable GPS simulation by default</div>
                            </div>
                         </div>
                         <input 
                            type="checkbox" 
                            checked={settings.autoSpoof}
                            onChange={e => setSettings({...settings, autoSpoof: e.target.checked})}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                         />
                    </label>

                     <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Hide Root Globally</div>
                                <div className="text-xs text-gray-500">Apply stealth mode to all clones</div>
                            </div>
                         </div>
                         <input 
                            type="checkbox" 
                            checked={settings.hideRootGlobally}
                            onChange={e => setSettings({...settings, hideRootGlobally: e.target.checked})}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                         />
                    </label>
                </div>
            </div>

            {/* Appearance */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Appearance</h4>
                 <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
                                {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Dark Mode</div>
                                <div className="text-xs text-gray-500">Switch application theme</div>
                            </div>
                         </div>
                         
                         <div 
                            className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setSettings({...settings, darkMode: !settings.darkMode});
                            }}
                         >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                         </div>
                    </label>
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};