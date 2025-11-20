import React from 'react';
import { Trash2, Power, ShieldCheck, Smartphone } from 'lucide-react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onClick: () => void;
  onDelete: () => void;
}

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  rose: 'bg-rose-600 text-white',
  amber: 'bg-amber-600 text-white',
  blue: 'bg-blue-600 text-white',
  violet: 'bg-violet-600 text-white',
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick, onDelete }) => {
  const themeClass = colorMap[profile.themeColor] || colorMap['indigo'];

  return (
    <div 
      className="group relative bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl shadow-md flex items-center justify-center ${themeClass}`}>
            <span className="text-2xl font-bold">{profile.appName ? profile.appName.charAt(0).toUpperCase() : 'A'}</span>
        </div>
        
        <div className="flex flex-col items-end gap-2">
             {profile.privacyConfig.randomizeId && (
                 <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Safe
                 </div>
             )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{profile.name}</h3>
        <div className="text-xs text-gray-500 flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span>Virtual Android • {profile.tags[0]}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
         <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Clone"
        >
            <Trash2 className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
            <Power className="w-3 h-3" /> Launch
        </button>
      </div>
    </div>
  );
};