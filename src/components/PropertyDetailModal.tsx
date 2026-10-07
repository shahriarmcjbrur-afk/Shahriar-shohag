import React, { useState } from 'react';
import { Property, Seat } from '../types';
import { 
  X, CheckCircle, AlertTriangle, Shield, MapPin, 
  Wifi, Utensils, Zap, Camera, Phone, Calendar, 
  Sparkles, Clock, AlertCircle, Info 
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  lang: 'bn' | 'en';
  onSeatStatusChange?: (seatId: string, status: 'available' | 'occupied' | 'reserved') => void;
  isOwnerView?: boolean;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  lang,
  onSeatStatusChange,
  isOwnerView = false,
}) => {
  const [activeTab, setActiveTab] = useState<'seats' | 'scorecard' | 'rules'>('seats');
  const [showCallPrompt, setShowCallPrompt] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  if (!property) return null;

  // Freshness calculation
  const lastUpdated = new Date(property.lastAvailabilityUpdatedAt);
  const diffDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 3600 * 24));
  const isStale = diffDays >= 7;
  const isOutdated = diffDays >= 15;

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSubmitted(true);
    setTimeout(() => {
      setShowVisitModal(false);
      setVisitSubmitted(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with image & status badges */}
        <div className="relative h-48 sm:h-56 bg-slate-800 shrink-0">
          <img
            src={property.photos[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
            alt={property.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {property.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'স্পন্সরড মেস' : 'Sponsored Listing'}
              </span>
            )}
            {property.verificationStatus === 'verified' ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'সরেজমিনে ভেরিফাইড' : 'Physically Verified'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-600 text-white shadow-md flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'ভেরিফিকেশন অপেক্ষমান' : 'Pending Verification'}
              </span>
            )}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${
              property.category === 'A' ? 'bg-indigo-600' :
              property.category === 'B' ? 'bg-sky-600' :
              property.category === 'C' ? 'bg-orange-600' : 'bg-slate-600'
            }`}>
              {lang === 'bn' ? `গ্রেড ${property.category}` : `Category ${property.category}`}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {lang === 'bn' ? property.nameBn : property.name}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                {property.areaName} ({property.distanceFromCampusM}m {lang === 'bn' ? 'ক্যাম্পাস থেকে' : 'from BRUR'})
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-300">
                {property.genderType === 'male' 
                  ? (lang === 'bn' ? 'ছাত্রাবাস (ছেলেদের)' : 'Boys Mess') 
                  : (lang === 'bn' ? 'ছাত্রীনিবাস (মেয়েদের)' : 'Girls Mess')}
              </span>
            </div>
          </div>
        </div>

        {/* Freshness banner */}
        {isOutdated ? (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center gap-2 text-rose-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {lang === 'bn' 
                ? 'সতর্কতা: মেস মালিক ১৫ দিনের বেশি সময় সিট আপডেট করেননি। বুকিংয়ের পূর্বে ফোন দিয়ে নিশ্চিত হোন।'
                : 'Warning: Availability not updated for 15+ days. Please call to confirm vacant seats.'}
            </span>
          </div>
        ) : isStale ? (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {lang === 'bn'
                ? `৭ দিন পূর্বে আপডেট করা হয়েছে (${diffDays} দিন আগে)`
                : `Last updated ${diffDays} days ago`}
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 flex items-center gap-2 text-emerald-800 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>
              {lang === 'bn' ? 'সরাসরি লাইভ সিট আপডেট: ' : 'Live availability: '} 
              {property.availableSeats} {lang === 'bn' ? 'টি সিট এই মুহূর্তে খালি আছে' : 'seats currently vacant'}
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2">
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'seats'
                ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'bn' ? 'লাইভ সিট ও রুম তালিকা' : 'Live Rooms & Seats'} ({property.availableSeats}/{property.totalSeats})
          </button>
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'scorecard'
                ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'bn' ? '১০০-পয়েন্ট ভেরিফিকেশন স্কোরকার্ড' : '100-Point Scorecard'}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === 'rules'
                ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'bn' ? 'মেসের নিয়ম ও সুবিধা' : 'Rules & Amenities'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto grow space-y-4">
          
          {/* SEATS TAB */}
          {activeTab === 'seats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {lang === 'bn' ? 'রুম ও সিট কাঠামো:' : 'Room & Seat Breakdown:'}
                </span>
                <span className="font-medium text-emerald-700">
                  {lang === 'bn' ? 'ভাড়া পরিসীমা: ' : 'Rent Range: '} 
                  ৳{property.rentMin} - ৳{property.rentMax}/মাস
                </span>
              </div>

              {property.rooms.map((room) => (
                <div key={room.id} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">
                        {lang === 'bn' ? `রুম #${room.roomNumber}` : `Room #${room.roomNumber}`}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        ({lang === 'bn' ? `${room.floor} তলা` : `Floor ${room.floor}`}) • {room.roomType}
                      </span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                      room.hasAttachedBath ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {room.hasAttachedBath 
                        ? (lang === 'bn' ? 'অ্যাটাচড বাথরুম' : 'Attached Bath')
                        : (lang === 'bn' ? 'কমন বাথরুম' : 'Common Bath')}
                    </span>
                  </div>

                  {/* Seat Units */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {room.seats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          seat.status === 'available'
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : seat.status === 'reserved'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-slate-100/70 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              seat.status === 'available' ? 'bg-emerald-600' :
                              seat.status === 'reserved' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            {seat.seatLabel}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {seat.seatType} • <span className="font-bold text-emerald-800">৳{seat.monthlyRent}</span>/মাস
                          </div>
                        </div>

                        {/* Status chip or interactive toggle for owner */}
                        {isOwnerView && onSeatStatusChange ? (
                          <select
                            value={seat.status}
                            onChange={(e) => onSeatStatusChange(seat.id, e.target.value as any)}
                            className="text-xs font-semibold px-2 py-1 bg-white border border-slate-300 rounded-md cursor-pointer"
                          >
                            <option value="available">{lang === 'bn' ? 'ফাঁকা' : 'Available'}</option>
                            <option value="occupied">{lang === 'bn' ? 'ভরাট' : 'Occupied'}</option>
                            <option value="reserved">{lang === 'bn' ? 'বুকড' : 'Reserved'}</option>
                          </select>
                        ) : (
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            seat.status === 'available' ? 'bg-emerald-600 text-white' :
                            seat.status === 'reserved' ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'
                          }`}>
                            {seat.status === 'available' ? (lang === 'bn' ? 'ফাঁকা' : 'Available') :
                             seat.status === 'reserved' ? (lang === 'bn' ? 'বুকড' : 'Reserved') :
                             (lang === 'bn' ? 'ভরাট' : 'Occupied')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SCORECARD TAB */}
          {activeTab === 'scorecard' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-950 text-base">
                    {lang === 'bn' ? 'প্রাতিষ্ঠানিক অ্যাসেসমেন্ট ফলাফল' : 'Institutional Assessment Result'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {lang === 'bn' 
                      ? 'অনাবাসিক শিক্ষার্থী নিরাপত্তা সেল ও পরিদর্শন টিম কর্তৃক যাচাইকৃত' 
                      : 'Verified by Non-Resident Student Safety Cell Inspection Team'}
                  </p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-xl shadow-xs border border-emerald-300">
                  <div className="text-2xl font-black text-emerald-700">{property.score ?? 85}/100</div>
                  <div className="text-[11px] font-bold text-slate-600">
                    {lang === 'bn' ? `ক্যাটাগরি ${property.category}` : `Grade ${property.category}`}
                  </div>
                </div>
              </div>

              {/* 10 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '১. রুমের মান ও আলো-বাতাস' : '1. Room Quality & Ventilation'}</span>
                    <span className="text-emerald-700 font-bold">18 / 20</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '২. স্যানিটেশন ও বাথরুম' : '2. Bath & Sanitation'}</span>
                    <span className="text-emerald-700 font-bold">9 / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '৩. সার্বিক পরিচ্ছন্নতা' : '3. Cleanliness & Hygiene'}</span>
                    <span className="text-emerald-700 font-bold">13 / 15</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '৪. নিরাপত্তা ও সিসিটিভি' : '4. Security & CCTV'}</span>
                    <span className="text-emerald-700 font-bold">14 / 15</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '93%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '৫. ক্যাম্পাস হতে দূরত্ব ও যাতায়াত' : '5. Location & Campus Proximity'}</span>
                    <span className="text-emerald-700 font-bold">9 / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '৬. ইউটিলিটি ও বিশুদ্ধ পানি' : '6. Utilities & Filtered Water'}</span>
                    <span className="text-emerald-700 font-bold">8 / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '৭. ইন্টারনেট ও ওয়াইফাই' : '7. Internet & Study Hall'}</span>
                    <span className="text-emerald-700 font-bold">5 / 5</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>{lang === 'bn' ? '৮. মেস ডাইনিং ও খাবার' : '8. Mess Dining System'}</span>
                    <span className="text-emerald-700 font-bold">4 / 5</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  {lang === 'bn'
                    ? 'গ্রেডিং স্কেল: A (৮০-১০০ পয়েন্ট: প্রিমিয়াম মান), B (৭০-৭৯ পয়েন্ট: স্ট্যান্ডার্ড), C (৫৫-৬৯: বাজেট), D (<৫৫: পরিমার্জন প্রয়োজন)।'
                    : 'Grading scale: A (80-100: Premium), B (70-79: Standard), C (55-69: Budget), D (<55: Remedial).'}
                </span>
              </div>
            </div>
          )}

          {/* RULES & AMENITIES TAB */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  {lang === 'bn' ? 'উপলব্ধ সুযোগ-সুবিধা' : 'Available Amenities'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((am) => (
                    <div key={am} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-800">
                      {am === 'wifi' && <Wifi className="w-4 h-4 text-emerald-600" />}
                      {am === 'generator' && <Zap className="w-4 h-4 text-amber-500" />}
                      {am === 'meal_system' && <Utensils className="w-4 h-4 text-indigo-500" />}
                      {am === 'cctv' && <Shield className="w-4 h-4 text-rose-500" />}
                      <span>{am.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  {lang === 'bn' ? 'মেসের অভ্যন্তরীণ নিয়ামাবলী' : 'House Rules'}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {property.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                  {lang === 'bn' ? 'মালিক সমিতি ও নিবন্ধন' : 'Association Affiliation'}
                </h4>
                <p className="text-xs text-slate-600">
                  {property.associationName || (lang === 'bn' ? 'তালিকাভুক্ত মেস মালিক সমিতি' : 'Registered Mess Owner Association')}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">
              {lang === 'bn' ? 'মাসিক সিট ভাড়া' : 'Monthly Rent'}
            </div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-800">
              ৳{property.rentMin} - ৳{property.rentMax}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCallPrompt(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'কল করুন' : 'Call Owner'}</span>
            </button>
            <button
              onClick={() => setShowVisitModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ভিজিট নির্ধারণ' : 'Schedule Visit'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* CALL MODAL (PRIVACY PRESERVING) */}
      {showCallPrompt && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {lang === 'bn' ? 'মেস ম্যানেজারের সাথে যোগাযোগ' : 'Contact Mess Manager'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {property.ownerName} ({property.areaName})
            </p>
            <div className="my-4 p-3 rounded-xl bg-slate-100 font-mono font-bold text-lg text-slate-800">
              {property.ownerPhone}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCallPrompt(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
              <a
                href={`tel:${property.ownerPhone}`}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 inline-flex items-center justify-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'সরাসরি ডায়াল' : 'Dial Now'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* VISIT REQUEST MODAL */}
      {showVisitModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {lang === 'bn' ? 'সরেজমিনে মেস পরিদর্শন অনুরোধ' : 'Schedule a Mess Visit'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {property.nameBn} - {property.areaName}
            </p>

            {visitSubmitted ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center text-emerald-800 text-xs space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">{lang === 'bn' ? 'অনুরোধ সফলভাবে পাঠানো হয়েছে!' : 'Visit Request Sent!'}</p>
                <p>{lang === 'bn' ? 'মেস ম্যানেজার শীঘ্রই আপনার সাথে যোগাযোগ করবেন।' : 'The mess manager has been notified and will call you shortly.'}</p>
              </div>
            ) : (
              <form onSubmit={handleBookVisit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    placeholder="e.g. তানভীর আহমেদ"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitPhone}
                    onChange={(e) => setVisitPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    {lang === 'bn' ? 'পরিদর্শনের সম্ভাব্য তারিখ ও সময়' : 'Preferred Date & Time'}
                  </label>
                  <input
                    type="text"
                    required
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    placeholder="e.g. আগামীকাল শুক্রবার বিকাল ৪:০০"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowVisitModal(false)}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {lang === 'bn' ? 'অনুরোধ পাঠান' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
