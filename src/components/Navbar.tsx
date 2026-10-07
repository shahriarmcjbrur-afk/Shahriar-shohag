import React from 'react';
import { UserRole } from '../types';
import { Home, ShieldCheck, UserCheck, Layers, BookOpen, MapPin } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  lang: 'bn' | 'en';
  onLangToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  lang,
  onLangToggle,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('student')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Home className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  BRUR <span className="text-emerald-700">Nest</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  {lang === 'bn' ? 'অনাবাসিক আবাসন' : 'Student Housing'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {lang === 'bn' ? 'বেগম রোকেয়া বিশ্ববিদ্যালয়, রংপুর' : 'Begum Rokeya University, Rangpur'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => onTabChange('student')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'শিক্ষার্থী পোর্টাল' : 'Student App'}
            </button>
            <button
              onClick={() => onTabChange('owner')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'owner'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'মালিক প্যানেল' : 'Owner Portal'}
            </button>
            <button
              onClick={() => onTabChange('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'নিরাপত্তা সেল ও অ্যাডমিন' : 'Safety Cell / Admin'}
            </button>
            <button
              onClick={() => onTabChange('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সিস্টেম আর্কিটেকচার' : 'System Arch & SQL'}</span>
            </button>
          </nav>

          {/* Controls: Role Switcher & Language */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={onLangToggle}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              title="Toggle Bangla / English"
            >
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center gap-1.5 bg-slate-100 pl-2 pr-1 py-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                {lang === 'bn' ? 'রোল:' : 'Role:'}
              </span>
              <select
                value={currentRole}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  onRoleChange(role);
                  if (role === 'student') onTabChange('student');
                  else if (role === 'owner') onTabChange('owner');
                  else onTabChange('admin');
                }}
                className="bg-white font-medium text-slate-800 text-xs rounded-lg py-1 px-2 border-0 focus:ring-1 focus:ring-emerald-600 cursor-pointer shadow-xs"
              >
                <option value="student">{lang === 'bn' ? '👨‍🎓 শিক্ষার্থী' : '👨‍🎓 Student'}</option>
                <option value="owner">{lang === 'bn' ? '🏠 মেস মালিক' : '🏠 Mess Owner'}</option>
                <option value="field_verifier">{lang === 'bn' ? '📋 ফিল্ড ভেরিফায়ার' : '📋 Field Verifier'}</option>
                <option value="university_viewer">{lang === 'bn' ? '🏛️ নিরাপত্তা সেল (Read-only)' : '🏛️ Safety Cell (Aggregated)'}</option>
                <option value="admin">{lang === 'bn' ? '⚡ প্ল্যাটফর্ম অ্যাডমিন' : '⚡ Super Admin'}</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
