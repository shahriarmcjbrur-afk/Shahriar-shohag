import React, { useState } from 'react';
import { Property } from '../types';
import { Sparkles, Sliders, CheckCircle, MapPin, X, ArrowRight } from 'lucide-react';

interface SmartMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  lang: 'bn' | 'en';
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
  lang,
}) => {
  const [budget, setBudget] = useState<number>(2500);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [maxDistance, setMaxDistance] = useState<number>(1000);
  const [needWifi, setNeedWifi] = useState<boolean>(true);
  const [needGenerator, setNeedGenerator] = useState<boolean>(false);
  const [needAttachedBath, setNeedAttachedBath] = useState<boolean>(false);
  const [needMealSystem, setNeedMealSystem] = useState<boolean>(true);

  if (!isOpen) return null;

  // Transparent scoring algorithm (documented formula):
  // 1. Gender check: Hard gate (0% if wrong gender)
  // 2. Budget proximity (Weight: 30%)
  // 3. Distance proximity to BRUR (Weight: 25%)
  // 4. Institutional Assessment score (Weight: 20%)
  // 5. Selected Amenities matching (Weight: 25%)
  const calculateMatch = (property: Property): number => {
    if (property.genderType !== gender && property.genderType !== 'both') {
      return 0;
    }

    // Budget Score (30%)
    let budgetScore = 0;
    if (budget >= property.rentMax) {
      budgetScore = 30;
    } else if (budget >= property.rentMin) {
      budgetScore = 24;
    } else {
      const diff = property.rentMin - budget;
      budgetScore = Math.max(0, 20 - Math.round(diff / 100) * 2);
    }

    // Distance Score (25%)
    let distanceScore = 0;
    if (property.distanceFromCampusM <= maxDistance) {
      distanceScore = 25;
    } else {
      const excess = property.distanceFromCampusM - maxDistance;
      distanceScore = Math.max(5, 25 - Math.round(excess / 200) * 4);
    }

    // Rating Score (20%)
    const rawScore = property.score ?? 70;
    const ratingScore = Math.round((rawScore / 100) * 20);

    // Amenities Score (25%)
    let requestedCount = 0;
    let satisfiedCount = 0;

    if (needWifi) {
      requestedCount++;
      if (property.amenities.includes('wifi')) satisfiedCount++;
    }
    if (needGenerator) {
      requestedCount++;
      if (property.amenities.includes('generator')) satisfiedCount++;
    }
    if (needMealSystem) {
      requestedCount++;
      if (property.amenities.includes('meal_system')) satisfiedCount++;
    }
    if (needAttachedBath) {
      requestedCount++;
      const hasBath = property.rooms.some((r) => r.hasAttachedBath);
      if (hasBath) satisfiedCount++;
    }

    const amenityScore = requestedCount > 0 ? Math.round((satisfiedCount / requestedCount) * 25) : 25;

    return Math.min(100, budgetScore + distanceScore + ratingScore + amenityScore);
  };

  const scoredProperties = properties
    .map((p) => ({ property: p, score: calculateMatch(p) }))
    .filter((item) => item.score > 25)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-emerald-950 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {lang === 'bn' ? 'স্মার্ট ম্যাচ: আপনার জন্য সেরা মেস' : 'Smart Match: Recommendation Engine'}
              </h3>
              <p className="text-xs text-emerald-100">
                {lang === 'bn' 
                  ? 'আপনার পছন্দ অনুযায়ী স্বয়ংক্রিয় অ্যালগরিদমে ম্যাচিং শতকরা হার' 
                  : 'Transparent weighted matching algorithm based on your exact preferences'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 overflow-y-auto grow space-y-5">
          
          {/* Preferences Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'পছন্দসমূহ নির্ধারণ করুন' : 'Set Your Criteria'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'মেসের ধরণ (লিঙ্গ)' : 'Mess Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1.5 text-xs rounded-lg font-medium border ${
                      gender === 'male' 
                        ? 'bg-emerald-700 text-white border-emerald-700' 
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {lang === 'bn' ? 'ছেলেদের মেস' : 'Boys Mess'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1.5 text-xs rounded-lg font-medium border ${
                      gender === 'female' 
                        ? 'bg-emerald-700 text-white border-emerald-700' 
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {lang === 'bn' ? 'ছাত্রীনিবাস (মেয়েদের)' : 'Girls Mess'}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{lang === 'bn' ? 'সর্বোচ্চ মাসিক বাজেট' : 'Max Monthly Budget'}</span>
                  <span className="font-bold text-emerald-800">৳{budget}</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{lang === 'bn' ? 'ক্যাম্পাস হতে দূরত্ব' : 'Max Distance from BRUR'}</span>
                  <span className="font-bold text-emerald-800">{maxDistance}m</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2500"
                  step="100"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">
                  {lang === 'bn' ? 'অগ্রাধিকার সুবিধা' : 'Priority Amenities'}
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={needWifi}
                      onChange={(e) => setNeedWifi(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>WiFi</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={needMealSystem}
                      onChange={(e) => setNeedMealSystem(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>{lang === 'bn' ? 'মিল ব্যবস্থা' : 'Meal System'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={needAttachedBath}
                      onChange={(e) => setNeedAttachedBath(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>{lang === 'bn' ? 'অ্যাটাচড বাথ' : 'Attach Bath'}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded-md border border-slate-200">
                    <input
                      type="checkbox"
                      checked={needGenerator}
                      onChange={(e) => setNeedGenerator(e.target.checked)}
                      className="accent-emerald-700"
                    />
                    <span>{lang === 'bn' ? 'জেনারেটর' : 'Generator'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
              {lang === 'bn' ? 'ম্যাচিং ফলাফল ক্রম' : 'Top Matched Properties'} ({scoredProperties.length})
            </h4>

            <div className="space-y-2">
              {scoredProperties.map(({ property, score }) => (
                <div
                  key={property.id}
                  onClick={() => {
                    onSelectProperty(property);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/20 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={property.photos[0]?.url}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-800">
                          {lang === 'bn' ? property.nameBn : property.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {property.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {property.areaName} ({property.distanceFromCampusM}m)
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">
                          ৳{property.rentMin} - ৳{property.rentMax}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-700">
                        {score}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lang === 'bn' ? 'ম্যাচ স্কোর' : 'Match'}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
