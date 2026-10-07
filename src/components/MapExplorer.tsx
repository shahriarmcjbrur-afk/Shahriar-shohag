import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, Navigation, Shield, Info, ArrowUpRight, CheckCircle } from 'lucide-react';

interface MapExplorerProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  lang: 'bn' | 'en';
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  properties,
  onSelectProperty,
  lang,
}) => {
  const [selectedPin, setSelectedPin] = useState<Property | null>(properties[0] || null);
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');

  const filtered = properties.filter((p) => {
    if (filterGender === 'all') return true;
    return p.genderType === filterGender;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Map Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm sm:text-base">
              {lang === 'bn' ? 'বেরোবি ক্যাম্পাস সংলগ্ন মেস মানচিত্র' : 'BRUR Campus Surrounding Housing Map'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'bn' ? 'পার্ক মোড়, লালবাগ, সর্দারপাড়া ও মডার্ন মোড় ক্লাস্টার' : 'Park Mour, Lalbagh, Sardarpara & Modern Mor Clusters'}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterGender('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterGender === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'সকল মেস' : 'All'}
          </button>
          <button
            onClick={() => setFilterGender('male')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterGender === 'male' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'ছাত্রাবাস' : 'Boys'}
          </button>
          <button
            onClick={() => setFilterGender('female')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              filterGender === 'female' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {lang === 'bn' ? 'ছাত্রীনিবাস' : 'Girls'}
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Simulation */}
      <div className="relative h-96 bg-slate-100 overflow-hidden select-none">
        {/* Campus Map Background Graphics */}
        <svg className="absolute inset-0 w-full h-full text-slate-300 stroke-current opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main roads */}
          <path d="M 0,200 Q 250,180 500,210 T 1000,190" fill="none" stroke="#94a3b8" strokeWidth="12" />
          <path d="M 450,0 Q 480,200 460,400" fill="none" stroke="#94a3b8" strokeWidth="8" />
          <path d="M 200,190 L 120,380" fill="none" stroke="#cbd5e1" strokeWidth="6" />
        </svg>

        {/* BRUR Campus Center Landmark */}
        <div className="absolute top-[40%] left-[44%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center">
          <div className="p-3 bg-emerald-800 text-white rounded-2xl shadow-xl border-2 border-amber-400 flex flex-col items-center">
            <span className="text-base font-black tracking-wider">🏛️ BRUR</span>
            <span className="text-[10px] font-semibold text-amber-300">ক্যাম্পাস প্রধান এলাকা</span>
          </div>
          <div className="mt-1 flex gap-2 justify-center">
            <span className="bg-white/90 text-slate-800 text-[10px] px-1.5 py-0.5 rounded shadow-xs font-bold border border-slate-200">
              ১ নং গেট (পার্ক মোড়)
            </span>
            <span className="bg-white/90 text-slate-800 text-[10px] px-1.5 py-0.5 rounded shadow-xs font-bold border border-slate-200">
              ২ নং গেট
            </span>
          </div>
        </div>

        {/* Pin Markers */}
        <div className="absolute inset-0 z-20">
          {filtered.map((prop, idx) => {
            // Simulated coordinates offset for visual map representation
            const positions = [
              { top: '30%', left: '32%' }, // Park Mour
              { top: '22%', left: '65%' }, // Lalbagh
              { top: '65%', left: '28%' }, // Sardarpara
              { top: '48%', left: '38%' }, // Near Gate 2
              { top: '15%', left: '20%' }, // Medical Purbo Gate
              { top: '78%', left: '72%' }, // Modern Mor
            ];
            const pos = positions[idx % positions.length];
            const isSelected = selectedPin?.id === prop.id;
            const isFull = prop.availableSeats === 0;

            return (
              <div
                key={prop.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedPin(prop)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
              >
                {/* Female Housing Privacy Radius Halo */}
                {prop.genderType === 'female' && (
                  <div className="absolute -inset-4 rounded-full bg-indigo-500/20 border border-indigo-400/40 animate-pulse pointer-events-none" />
                )}

                <div
                  className={`px-2 py-1 rounded-xl shadow-lg border-2 flex items-center gap-1 text-xs font-bold transition-all ${
                    isSelected
                      ? 'ring-4 ring-amber-400 scale-105'
                      : ''
                  } ${
                    isFull
                      ? 'bg-slate-700 text-slate-200 border-slate-600'
                      : prop.genderType === 'female'
                      ? 'bg-indigo-600 text-white border-white'
                      : 'bg-emerald-600 text-white border-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {isFull 
                      ? (lang === 'bn' ? 'ভরাট' : 'Full')
                      : `${prop.availableSeats} সিট`}
                  </span>
                </div>

                <div className="text-[10px] font-semibold text-slate-800 bg-white/90 px-1 rounded shadow-xs mt-0.5 whitespace-nowrap text-center">
                  {lang === 'bn' ? prop.nameBn.split(' ')[0] : prop.name.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety & Privacy Notice Pill */}
        <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-xs text-[11px] text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {lang === 'bn' 
              ? 'ছাত্রীদের সুরক্ষার্থে ছাত্রীনিবাসের সুনির্দিষ্ট কক্ষ বিবরণী কেবল বুকিং অনুরোধের পর প্রদর্শিত হয়।'
              : 'Female housing exact room layout is masked until visit confirmation.'}
          </span>
        </div>
      </div>

      {/* Selected Property Preview Bar */}
      {selectedPin && (
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
              <img
                src={selectedPin.photos[0]?.url}
                alt={selectedPin.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {lang === 'bn' ? selectedPin.nameBn : selectedPin.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  selectedPin.genderType === 'female' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedPin.genderType === 'female' ? (lang === 'bn' ? 'ছাত্রীনিবাস' : 'Girls') : (lang === 'bn' ? 'ছাত্রাবাস' : 'Boys')}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  ক্যাটাগরি {selectedPin.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedPin.areaName} • {selectedPin.distanceFromCampusM}m ক্যাম্পাস থেকে • 
                <span className="font-bold text-emerald-800 ml-1">৳{selectedPin.rentMin} - ৳{selectedPin.rentMax}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectProperty(selectedPin)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition"
          >
            <span>{lang === 'bn' ? 'বিস্তারিত ও সিট দেখুন' : 'View Full Details'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
