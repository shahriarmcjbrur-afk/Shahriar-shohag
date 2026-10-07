import React, { useState } from 'react';
import { Property, Inquiry, Seat } from '../types';
import { 
  Building2, Users, CheckCircle2, Clock, AlertTriangle, 
  Phone, MessageSquare, Plus, RefreshCw, Upload, ShieldCheck, Check 
} from 'lucide-react';

interface OwnerDashboardProps {
  properties: Property[];
  inquiries: Inquiry[];
  onToggleSeat: (propertyId: string, seatId: string, status: 'available' | 'occupied' | 'reserved') => void;
  onRefreshAvailability: (propertyId: string) => void;
  lang: 'bn' | 'en';
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  properties,
  inquiries,
  onToggleSeat,
  onRefreshAvailability,
  lang,
}) => {
  // Select first property belonging to owner for demonstration
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');
  const currentProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const [activeTab, setActiveTab] = useState<'seats' | 'leads' | 'settings'>('seats');
  const [csvNotice, setCsvNotice] = useState<string | null>(null);

  if (!currentProperty) return null;

  // Staleness check
  const lastUpdated = new Date(currentProperty.lastAvailabilityUpdatedAt);
  const diffDays = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 3600 * 24));
  const isStale = diffDays >= 7;
  const isOutdated = diffDays >= 15;

  const handleCsvUpload = () => {
    setCsvNotice(lang === 'bn' ? 'মালিক সমিতি সিএসভি ফরম্যাট প্রস্তুত আছে। ১০টি রুম ও ২৪টি সিট সফলভাবে ইমপোর্ট প্রিভিউতে প্রস্তুত।' : 'Association CSV format validated. 10 rooms & 24 seats mapped successfully.');
    setTimeout(() => setCsvNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Property Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? 'মেস মালিক ড্যাশবোর্ড' : 'Mess Owner Dashboard'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? `মালিক: ${currentProperty.ownerName} (${currentProperty.areaName})` : `Owner: ${currentProperty.ownerName} (${currentProperty.areaName})`}
              </p>
            </div>
          </div>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মেস নির্বাচন:' : 'Select Mess:'}
          </label>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-1 focus:ring-emerald-600"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {lang === 'bn' ? p.nameBn : p.name} ({p.areaName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Freshness Alert Warnings (Automation Rule 7d & 15d) */}
      {isOutdated ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-between gap-3 text-rose-900 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-sm">
                {lang === 'bn' ? 'সতর্কতা: আপনার মেস "আউটডেটেড/অবিশ্বস্ত" ব্যাজে চিহ্নিত!' : 'Alert: Listing flagged as "Outdated"'}
              </p>
              <p>
                {lang === 'bn' 
                  ? `১৫ দিন ধরে সিট আপডেট করা হয়নি (${diffDays} দিন অতিবাহিত)। অবিলম্বে আপডেট না করলে শিক্ষার্থীদের সার্চে নিচে নামানো হবে।`
                  : `Availability not updated for 15+ days (${diffDays} days). Refresh now to maintain verified ranking.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onRefreshAvailability(currentProperty.id)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition"
          >
            {lang === 'bn' ? '১-ক্লিকে সিট আপডেট নিশ্চিত করুন' : 'Confirm Seats Current'}
          </button>
        </div>
      ) : isStale ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">
                {lang === 'bn' ? 'রিমাইন্ডার: ৭ দিন ধরে সিট স্ট্যাটাস আপডেট করা হয়নি' : 'Reminder: 7 Days Since Last Seat Update'}
              </p>
              <p>
                {lang === 'bn' ? 'লাইভ সিট সঠিক রাখতে নিচের বোতামে চাপ দিয়ে আপডেট রিফ্রেশ করুন।' : 'Keep your listing fresh and ranked top by confirming availability.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onRefreshAvailability(currentProperty.id)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs whitespace-nowrap shadow-xs"
          >
            {lang === 'bn' ? 'আপডেট নিশ্চিত করুন' : 'Update Now'}
          </button>
        </div>
      ) : null}

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট সিট সংখ্যা' : 'Total Seats'}
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {currentProperty.totalSeats}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {currentProperty.rooms.length} {lang === 'bn' ? 'টি রুম' : 'rooms'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="text-xs text-emerald-800 font-semibold flex items-center justify-between">
            <span>{lang === 'bn' ? 'খালি সিট (লাইভ)' : 'Available Seats'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {currentProperty.availableSeats}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            {lang === 'bn' ? 'শিক্ষার্থীরা দেখতে পাচ্ছে' : 'Visible to students'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'ভরাট সিট' : 'Occupied Seats'}
          </div>
          <div className="text-2xl font-black text-slate-700 mt-1">
            {currentProperty.totalSeats - currentProperty.availableSeats}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {Math.round(((currentProperty.totalSeats - currentProperty.availableSeats) / (currentProperty.totalSeats || 1)) * 100)}% {lang === 'bn' ? 'অকুপেন্সি' : 'Occupancy'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'নতুন ইনকোয়ারি ও ভিজিট' : 'Pending Leads'}
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {inquiries.filter(i => i.status === 'new').length}
          </div>
          <div className="text-[11px] text-indigo-600 mt-0.5">
            {lang === 'bn' ? 'শিক্ষার্থী যোগাযোগ করেছে' : 'Students interested'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('seats')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'seats'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'bn' ? '১-ট্যাপ লাইভ সিট ম্যানেজার' : '1-Tap Live Seat Manager'}
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'leads'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'bn' ? 'শিক্ষার্থী ইনকোয়ারি ও লিড' : 'Leads & Inquiries'} ({inquiries.length})
        </button>
      </div>

      {/* 1-TAP SEAT MANAGER TAB */}
      {activeTab === 'seats' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                {lang === 'bn' ? 'দ্রুত পরিবর্তন নির্দেশিকা:' : 'Quick toggle guide:'}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> ফাঁকা (Available)
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> ভরাট (Occupied)
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> বুকড (Reserved)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCsvUpload}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 font-medium flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'CSV বাল্ক ইমপোর্ট' : 'CSV Bulk Import'}</span>
              </button>

              <button
                onClick={() => onRefreshAvailability(currentProperty.id)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'আজকের তারিখ আপডেট' : 'Refresh Freshness'}</span>
              </button>
            </div>
          </div>

          {csvNotice && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{csvNotice}</span>
            </div>
          )}

          {/* Rooms and Seats 1-Tap Toggles */}
          <div className="space-y-4">
            {currentProperty.rooms.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {lang === 'bn' ? `কক্ষ নম্বর: ${room.roomNumber}` : `Room Number: ${room.roomNumber}`}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({room.floor} {lang === 'bn' ? 'তলা' : 'Floor'}) • {room.capacity} {lang === 'bn' ? 'সিটের কক্ষ' : 'bed capacity'}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    room.hasAttachedBath ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {room.hasAttachedBath ? (lang === 'bn' ? 'অ্যাটাচড বাথ' : 'Attached Bath') : (lang === 'bn' ? 'কমন বাথ' : 'Common Bath')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {room.seats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`p-3 rounded-xl border transition-all ${
                        seat.status === 'available'
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : seat.status === 'reserved'
                          ? 'bg-amber-50/60 border-amber-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900">{seat.seatLabel}</span>
                        <span className="text-xs font-extrabold text-emerald-800">৳{seat.monthlyRent}</span>
                      </div>

                      {/* 1-Tap Toggle Buttons */}
                      <div className="grid grid-cols-3 gap-1 text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => onToggleSeat(currentProperty.id, seat.id, 'available')}
                          className={`py-1 rounded-md transition ${
                            seat.status === 'available'
                              ? 'bg-emerald-700 text-white font-bold shadow-xs'
                              : 'bg-white hover:bg-emerald-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {lang === 'bn' ? 'ফাঁকা' : 'Vacant'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleSeat(currentProperty.id, seat.id, 'occupied')}
                          className={`py-1 rounded-md transition ${
                            seat.status === 'occupied'
                              ? 'bg-slate-800 text-white font-bold shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {lang === 'bn' ? 'ভরাট' : 'Filled'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleSeat(currentProperty.id, seat.id, 'reserved')}
                          className={`py-1 rounded-md transition ${
                            seat.status === 'reserved'
                              ? 'bg-amber-500 text-white font-bold shadow-xs'
                              : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {lang === 'bn' ? 'বুকড' : 'Booked'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEADS & INQUIRIES TAB */}
      {activeTab === 'leads' && (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{inq.studentName}</span>
                  <span className="text-xs text-slate-500">({inq.studentDept})</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inq.type === 'visit_request' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {inq.type === 'visit_request' ? (lang === 'bn' ? 'সরেজমিনে পরিদর্শনের আবেদন' : 'Visit Request') : (lang === 'bn' ? 'ফোন কল আগ্রহ' : 'Direct Call')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg">
                  "{inq.message}"
                </p>
                {inq.preferredTime && (
                  <p className="text-[11px] text-indigo-600 font-semibold">
                    {lang === 'bn' ? 'প্রস্তাবিত পরিদর্শনের সময়: ' : 'Preferred Time: '} {inq.preferredTime}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${inq.studentPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 hover:bg-emerald-800 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{inq.studentPhone}</span>
                </a>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border">
                  {inq.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
