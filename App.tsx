import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid, ShieldCheck, Smartphone, Download, Settings, MoreVertical, Cpu, SlidersHorizontal } from 'lucide-react';
import { Profile, AppState } from './types';
import { CreateProfileModal } from './components/CreateProfileModal';
import { ActiveProfileView } from './components/ActiveProfileView';
import { ProfileCard } from './components/ProfileCard';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    profiles: [],
    activeProfileId: null,
    isModalOpen: false,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("To install VANACLONE on your device:\n\n1. Tap the browser menu icon (⋮)\n2. Select 'Add to Home Screen' or 'Install App'\n\nCompatible with Android 5.0 - 14.0");
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('profilespace_profiles');
    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles);
        setState(prev => ({ ...prev, profiles: parsed }));
      } catch (e) {
        console.error("Failed to load profiles", e);
      }
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    if (state.profiles.length > 0) {
      localStorage.setItem('profilespace_profiles', JSON.stringify(state.profiles));
    }
  }, [state.profiles]);

  const handleCreateProfile = (newProfile: Profile) => {
    setState(prev => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      isModalOpen: false,
    }));
  };

  const handleDeleteProfile = (id: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.filter(p => p.id !== id),
      activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId
    }));
  };

  const handleSelectProfile = (id: string) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
  };

  const handleBackToDashboard = () => {
    setState(prev => ({ ...prev, activeProfileId: null }));
  };

  // If a profile is active, show the "Cloned" environment view
  if (state.activeProfileId) {
    const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
    if (activeProfile) {
      return (
        <ActiveProfileView 
          profile={activeProfile} 
          onBack={handleBackToDashboard} 
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white">
                VANACLONE
              </h1>
              <span className="text-[10px] uppercase bg-indigo-800 px-1.5 py-0.5 rounded text-indigo-200 font-bold tracking-widest">Premium</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="p-2 hover:bg-white/10 rounded-full transition-colors"
               title="Configure Global Settings"
             >
                <SlidersHorizontal className="w-5 h-5 text-indigo-100" />
             </button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-indigo-100" />
             </button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-indigo-100" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Install Prompt */}
        <div onClick={handleInstallClick} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-1 shadow-lg cursor-pointer active:scale-[0.98] transition-transform">
           <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/10 rounded-full animate-pulse">
                    <Download className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h2 className="font-bold text-sm">Install Vanaclone APK</h2>
                    <p className="text-indigo-100 text-xs mt-0.5 opacity-90">Supports Android 5.0 - 14.0</p>
                 </div>
              </div>
              <div className="px-4 py-2 bg-white text-indigo-900 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                 Install
              </div>
           </div>
        </div>

        {/* Privacy Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-full flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-base font-bold text-gray-900">System Status: UNDETECTED</h2>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">ROOT: HIDDEN</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full w-full animate-[shimmer_2s_infinite]"></div>
            </div>
            <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Cpu className="w-3 h-3" />
                    <span>Auto-IMEI Changer</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Smartphone className="w-3 h-3" />
                    <span>Device Spoofing</span>
                </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex items-center justify-between mt-8 mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">My Clones</h3>
            <button 
                onClick={() => setState(prev => ({ ...prev, isModalOpen: true }))}
                className="text-indigo-600 text-xs font-bold uppercase hover:underline"
            >
                + Create New
            </button>
        </div>

        {state.profiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setState(prev => ({ ...prev, isModalOpen: true }))}>
            <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="mt-2 text-base font-bold text-gray-900">Clone Application</h3>
            <p className="mt-1 text-xs text-gray-500 px-8">Tap here to scan installed apps & clone.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {state.profiles.map(profile => (
            <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => handleSelectProfile(profile.id)}
                onDelete={() => handleDeleteProfile(profile.id)}
            />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setState(prev => ({ ...prev, isModalOpen: true }))}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-400/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      {state.isModalOpen && (
        <CreateProfileModal
          onClose={() => setState(prev => ({ ...prev, isModalOpen: false }))}
          onCreate={handleCreateProfile}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default App;