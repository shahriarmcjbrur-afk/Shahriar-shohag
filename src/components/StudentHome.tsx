import React, { useState } from 'react';
import { Property } from '../types';
import { 
  Search, SlidersHorizontal, Sparkles, Map, CheckCircle, 
  Clock, AlertTriangle, ArrowUpDown, ShieldCheck, Home, 
  MapPin, Users, Filter, X 
} from 'lucide-react';

interface StudentHomeProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenSmartMatch: () => void;
  onOpenMap: () => void;
  lang: 'bn' | 'en';
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  properties,
  onSelectProperty,
  onOpenSmartMatch,
  onOpenMap,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxRent, setMaxRent] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<'distance' | 'rent_asc' | 'score'>('distance');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Available Areas in Rangpur
  const areas = ['Park Mour', 'Lalbagh', 'Sardarpara', 'Medical Purbo Gate', 'Modern Mor'];

  // Filtering & Sorting
  const filtered = properties
    .filter((p) => {
      // Search term
      if (
        searchTerm &&
        !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !p.nameBn.includes(searchTerm) &&
        !p.areaName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      // Gender
      if (selectedGender !== 'all' && p.genderType !== selectedGender) {
        return false;
      }
      // Area
      if (selectedArea !== 'all' && p.areaName !== selectedArea) {
        return false;
      }
      // Availability
      if (onlyAvailable && p.availableSeats === 0) {
        return false;
      }
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Rent max
      if (p.rentMin > maxRent) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Featured listings rank higher in search, but paid != verified
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      if (sortBy === 'distance') return a.distanceFromCampusM - b.distanceFromCampusM;
      if (sortBy === 'rent_asc') return a.rentMin - b.rentMin;
      if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
      return 0;
    });

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Quick Search */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অনাবাসিক শিক্ষার্থী নিরাপত্তা সেল অংশীদারিত্বে' : 'In Partnership with Student Safety Cell'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {lang === 'bn' 
              ? 'বেরোবি ক্যাম্পাস সংলগ্ন মেসের নির্ভরযোগ্য ঠিকানা' 
              : 'Verified Student Housing around BRUR Campus'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            {lang === 'bn'
              ? 'সরেজমিনে ভেরিফাইড ১০০-পয়েন্ট রেটিং, লাইভ সিট খালি থাকার তথ্য এবং নিরাপদ মেস খোঁজার নির্ভরযোগ্য প্ল্যাটফর্ম।'
              : '100-point inspected residences, live vacant seat status, and zero middleman fee.'}
          </p>

          {/* Quick Search Input */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative grow">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'bn' ? 'মেসের নাম বা এলাকা দিয়ে খুঁজুন (যেমন: পার্ক মোড়, লালবাগ...)' : 'Search by mess name or area (Park Mour, Lalbagh...)'}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md placeholder-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilterDrawer(true)}
              className="px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border border-emerald-600/40 transition shadow-md"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-300" />
              <span>{lang === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
            </button>
          </div>
        </div>

        {/* Action Quick Tiles */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-800/60">
          <button
            onClick={() => { setSelectedGender('male'); setOnlyAvailable(true); }}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-xs text-left transition border border-white/10 group"
          >
            <div className="text-amber-300 font-bold text-xs flex items-center justify-between">
              <span>{lang === 'bn' ? 'ছেলেদের ছাত্রাবাস' : 'Boys Mess'}</span>
              <span className="text-white/60 text-[10px]">খালি সিট</span>
            </div>
            <div className="text-white font-extrabold text-lg mt-1 group-hover:text-amber-300">
              {properties.filter(p => p.genderType === 'male').reduce((acc, c) => acc + c.availableSeats, 0)} {lang === 'bn' ? 'টি সিট' : 'seats'}
            </div>
          </button>

          <button
            onClick={() => { setSelectedGender('female'); setOnlyAvailable(true); }}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-xs text-left transition border border-white/10 group"
          >
            <div className="text-rose-300 font-bold text-xs flex items-center justify-between">
              <span>{lang === 'bn' ? 'ছাত্রীনিবাস (মেয়েদের)' : 'Girls Hostels'}</span>
              <span className="text-white/60 text-[10px]">সুরক্ষিত</span>
            </div>
            <div className="text-white font-extrabold text-lg mt-1 group-hover:text-rose-300">
              {properties.filter(p => p.genderType === 'female').reduce((acc, c) => acc + c.availableSeats, 0)} {lang === 'bn' ? 'টি সিট' : 'seats'}
            </div>
          </button>

          <button
            onClick={onOpenSmartMatch}
            className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-xs text-left transition border border-amber-400/30 group"
          >
            <div className="text-amber-300 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'স্মার্ট ম্যাচ' : 'Smart Match'}</span>
            </div>
            <div className="text-white text-xs mt-1 font-semibold group-hover:text-amber-300">
              {lang === 'bn' ? 'পছন্দ অনুযায়ী খুঁজুন' : 'AI Match Algorithm'}
            </div>
          </button>

          <button
            onClick={onOpenMap}
            className="p-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 backdrop-blur-xs text-left transition border border-teal-400/30 group"
          >
            <div className="text-teal-300 font-bold text-xs flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ক্যাম্পাস ম্যাপ' : 'Campus Map'}</span>
            </div>
            <div className="text-white text-xs mt-1 font-semibold group-hover:text-teal-300">
              {lang === 'bn' ? 'গেট ও এলাকাভিত্তিক' : 'Near Gates 1 & 2'}
            </div>
          </button>
        </div>
      </div>

      {/* Quick Filter Pill Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedGender('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGender === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'bn' ? 'সকল আবাসন' : 'All Housing'}
          </button>
          <button
            onClick={() => setSelectedGender('male')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGender === 'male'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'bn' ? 'ছাত্রাবাস' : 'Boys Mess'}
          </button>
          <button
            onClick={() => setSelectedGender('female')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedGender === 'female'
                ? 'bg-indigo-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'bn' ? 'ছাত্রীনিবাস' : 'Girls Mess'}
          </button>

          <span className="text-slate-300">|</span>

          {/* Area dropdown */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs bg-slate-100 rounded-lg py-1.5 px-2.5 font-medium text-slate-700 border-0 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="all">{lang === 'bn' ? 'সকল এলাকা (রংপুর)' : 'All Areas'}</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Available only toggle */}
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="accent-emerald-700"
            />
            <span>{lang === 'bn' ? 'শুধু খালি সিট আছে' : 'Available Seats Only'}</span>
          </label>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>{lang === 'bn' ? 'সাজান:' : 'Sort:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-semibold text-emerald-800 cursor-pointer border-0 p-0 text-xs focus:ring-0"
          >
            <option value="distance">{lang === 'bn' ? 'ক্যাম্পাসের দূরত্ব অনুযায়ী' : 'Closest to BRUR'}</option>
            <option value="rent_asc">{lang === 'bn' ? 'কম ভাড়া আগে' : 'Lowest Rent'}</option>
            <option value="score">{lang === 'bn' ? 'উচ্চ ১০০-পয়েন্ট রেটিং' : 'Highest Score'}</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((property) => {
          const isStale = Math.floor((Date.now() - new Date(property.lastAvailabilityUpdatedAt).getTime()) / (1000 * 3600 * 24)) >= 7;

          return (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-600/60 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Photo & Badges */}
              <div className="relative h-44 bg-slate-200 overflow-hidden">
                <img
                  src={property.photos[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  {property.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {lang === 'bn' ? 'স্পন্সরড' : 'Sponsored'}
                    </span>
                  )}
                  {property.verificationStatus === 'verified' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {lang === 'bn' ? 'ভেরিফাইড' : 'Verified'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lang === 'bn' ? 'পেন্ডিং' : 'Pending'}
                    </span>
                  )}
                </div>

                {/* Category & Score badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black text-white shadow-md ${
                    property.category === 'A' ? 'bg-indigo-600' :
                    property.category === 'B' ? 'bg-sky-600' :
                    property.category === 'C' ? 'bg-orange-600' : 'bg-slate-600'
                  }`}>
                    {property.score ? `${property.score} pts` : `Cat ${property.category}`}
                  </span>
                </div>

                {/* Gender & Distance tags bottom */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-semibold text-amber-300">
                    <MapPin className="w-3.5 h-3.5" />
                    {property.distanceFromCampusM}m {lang === 'bn' ? 'ক্যাম্পাস থেকে' : 'from BRUR'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    property.genderType === 'female' ? 'bg-indigo-600/90' : 'bg-emerald-600/90'
                  }`}>
                    {property.genderType === 'female' 
                      ? (lang === 'bn' ? 'ছাত্রীনিবাস' : 'Girls') 
                      : (lang === 'bn' ? 'ছাত্রাবাস' : 'Boys')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col grow justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                    {lang === 'bn' ? property.nameBn : property.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {property.address}
                  </p>
                </div>

                {/* Live Seat Availability Unit */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      property.availableSeats > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {property.availableSeats > 0 
                          ? `${property.availableSeats} ${lang === 'bn' ? 'টি সিট খালি' : 'Vacant Seats'}`
                          : (lang === 'bn' ? 'বর্তমানে সকল সিট পূর্ণ' : 'All Seats Full')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {lang === 'bn' ? `মোট ${property.totalSeats} টি সিট` : `Total ${property.totalSeats} seats`}
                      </div>
                    </div>
                  </div>

                  {isStale && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lang === 'bn' ? '৭+ দিন পুরনো' : '7d+ old'}
                    </span>
                  )}
                </div>

                {/* Footer Rent & CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      {lang === 'bn' ? 'মাসিক সিট ভাড়া' : 'Monthly Rent'}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-800">
                      ৳{property.rentMin} - ৳{property.rentMax}
                    </span>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white font-semibold text-xs transition">
                    {lang === 'bn' ? 'সিট দেখুন' : 'View Seats'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">
            {lang === 'bn' ? 'কোন মেস বা ছাত্রাবাস খুঁজে পাওয়া যায়নি' : 'No matching housing found'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn' ? 'আপনার সার্চ কিওয়ার্ড অথবা ফিল্টারের মান পরিবর্তন করে আবার চেষ্টা করুন।' : 'Try loosening filter criteria or searching another area.'}
          </p>
        </div>
      )}

      {/* Filter Drawer / Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'bn' ? 'বিস্তারিত ফিল্টার' : 'Detailed Filters'}
              </h3>
              <button onClick={() => setShowFilterDrawer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ক্যাটাগরি রেটিং' : 'Category Rating'}
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['all', 'A', 'B', 'C'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 rounded-lg font-medium border ${
                      selectedCategory === cat ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {cat === 'all' ? (lang === 'bn' ? 'সকল' : 'All') : `Grade ${cat}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>{lang === 'bn' ? 'সর্বোচ্চ মাসিক ভাড়া' : 'Max Rent'}</span>
                <span className="font-bold text-emerald-800">৳{maxRent}</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4500"
                step="100"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setSelectedGender('all');
                  setSelectedArea('all');
                  setSelectedCategory('all');
                  setOnlyAvailable(false);
                  setMaxRent(4000);
                  setShowFilterDrawer(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700"
              >
                {lang === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white"
              >
                {lang === 'bn' ? 'ফিল্টার প্রয়োগ' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
