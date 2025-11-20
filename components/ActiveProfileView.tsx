import React, { useState } from 'react';
import { ArrowLeft, Shield, Wifi, Battery, Signal, MoreVertical, Loader2, Lock, MapPin, Smartphone, Fingerprint } from 'lucide-react';
import { Profile } from '../types';

interface ActiveProfileViewProps {
  profile: Profile;
  onBack: () => void;
}

export const ActiveProfileView: React.FC<ActiveProfileViewProps> = ({ profile, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate app booting with variable time
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const themeColor = profile.themeColor;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center md:p-8">
      {/* Phone Container */}
      <div className="w-full max-w-md bg-white md:rounded-[2.5rem] md:border-8 md:border-gray-800 md:shadow-2xl h-screen md:h-[850px] overflow-hidden flex flex-col relative">
        
        {/* Status Bar */}
        <div className={`h-8 bg-${themeColor}-600 w-full flex items-center justify-between px-4 text-white text-xs select-none`}>
            <span className="font-medium">12:42</span>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-bold">4G</span>
                    <Signal className="w-3 h-3" />
                </div>
                <Battery className="w-3 h-3" />
            </div>
        </div>

        {/* Top Nav */}
        <div className={`h-14 bg-${themeColor}-600 w-full flex items-center justify-between px-2 shadow-md z-10`}>
             <button onClick={onBack} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="text-white font-bold text-lg tracking-wide">{profile.appName}</div>
             <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
             </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-100 relative flex flex-col">
             {isLoading ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                     <div className="relative">
                        <div className={`w-24 h-24 bg-${themeColor}-50 rounded-3xl flex items-center justify-center mb-6 animate-pulse`}>
                            <span className={`text-4xl font-bold text-${themeColor}-600`}>
                                {profile.appName ? profile.appName.charAt(0).toUpperCase() : 'A'}
                            </span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white">
                            <Shield className="w-4 h-4" />
                        </div>
                     </div>
                     
                     <Loader2 className={`w-8 h-8 text-${themeColor}-600 animate-spin mb-4`} />
                     <h3 className="text-gray-900 font-bold text-lg">Starting Engine...</h3>
                     <p className="text-gray-500 text-sm mb-8">Injecting fake signatures</p>
                     
                     <div className="w-64 space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Spoofing IMEI...</span>
                            <span className="text-emerald-600 font-bold">Done</span>
                        </div>
                         <div className="flex justify-between text-xs text-gray-500">
                            <span>Mocking GPS...</span>
                            <span className="text-emerald-600 font-bold">Done</span>
                        </div>
                         <div className="flex justify-between text-xs text-gray-500">
                            <span>Hiding Root...</span>
                            <span className="text-emerald-600 font-bold">Done</span>
                        </div>
                     </div>
                 </div>
             ) : (
                 <div className="flex-1 flex flex-col">
                     {/* Spoof Info Header */}
                     <div className="bg-gray-900 text-white p-3 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Stealth Mode Active</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">V 2.4.1</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-800 p-2 rounded border border-gray-700">
                                <div className="text-gray-400 mb-0.5 flex items-center gap-1"><Fingerprint className="w-3 h-3"/> Spoofed IMEI</div>
                                <div className="font-mono text-yellow-500 truncate">{profile.deviceIdentity?.imei || 'Generating...'}</div>
                            </div>
                            <div className="bg-gray-800 p-2 rounded border border-gray-700">
                                <div className="text-gray-400 mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3"/> Virtual Location</div>
                                <div className="font-mono text-blue-400 truncate">{profile.deviceIdentity?.location.city || 'Unknown'}</div>
                            </div>
                        </div>
                     </div>

                     {/* Simulated App Area */}
                     <div className="p-4 flex-1 overflow-y-auto">
                         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center space-y-4">
                            <div className={`w-16 h-16 mx-auto bg-${themeColor}-100 rounded-2xl flex items-center justify-center`}>
                                <Smartphone className={`w-8 h-8 text-${themeColor}-600`} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{profile.appName}</h2>
                                <p className="text-sm text-gray-500">Running in Virtual {profile.deviceIdentity?.model}</p>
                            </div>
                            
                            <div className="py-4 border-t border-b border-gray-100 text-left space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Device Status</span>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Clean</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Root Access</span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg">Hidden</span>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Android ID</span>
                                    <span className="font-mono text-xs text-gray-400">e3b0c44298fc1c14...</span>
                                </div>
                            </div>

                            <div className="text-xs text-gray-400 pt-2">
                                This application believes it is running on a {profile.deviceIdentity?.manufacturer} {profile.deviceIdentity?.model} in {profile.deviceIdentity?.location.city}.
                            </div>
                         </div>

                         <div className="mt-6 flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                             <p className="text-gray-400 text-sm font-medium">Application Interface</p>
                             <p className="text-xs text-gray-400 mt-1">Waiting for user input...</p>
                         </div>
                     </div>
                 </div>
             )}
        </div>

        {/* Fake Android Nav Bar */}
        <div className="h-12 bg-black w-full flex items-center justify-around px-10 text-gray-500 shrink-0">
            <button onClick={onBack} className="p-2 active:text-white"><div className="w-4 h-4 border-2 border-current rounded-sm transform rotate-45"></div></button>
            <button className="p-2 active:text-white"><div className="w-4 h-4 border-2 border-current rounded-full"></div></button>
            <button className="p-2 active:text-white"><div className="w-4 h-4 border-2 border-current rounded-sm"></div></button>
        </div>

      </div>
      
      <div className="mt-4 text-gray-500 text-sm font-medium md:block hidden flex items-center gap-2">
        <Lock className="w-4 h-4" /> Encrypted Sandbox Environment
      </div>
    </div>
  );
};