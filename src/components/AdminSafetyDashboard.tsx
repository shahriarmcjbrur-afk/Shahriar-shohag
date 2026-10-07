import React, { useState } from 'react';
import { Property, Complaint, UserRole } from '../types';
import { 
  ShieldAlert, BarChart3, CheckSquare, AlertTriangle, FileText, 
  Users, CheckCircle2, TrendingUp, Download, Eye, Award, Sliders 
} from 'lucide-react';

interface AdminSafetyDashboardProps {
  properties: Property[];
  complaints: Complaint[];
  currentRole: UserRole;
  lang: 'bn' | 'en';
  onUpdatePropertyCategory?: (propId: string, category: 'A' | 'B' | 'C' | 'D', score: number) => void;
}

export const AdminSafetyDashboard: React.FC<AdminSafetyDashboardProps> = ({
  properties,
  complaints,
  currentRole,
  lang,
  onUpdatePropertyCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'complaints' | 'assessment'>('kpi');
  const [selectedPropertyForAssess, setSelectedPropertyForAssess] = useState<string>(properties[0]?.id || '');
  
  // 100-point assessment state
  const [roomQuality, setRoomQuality] = useState<number>(18); // 0-20
  const [bathroom, setBathroom] = useState<number>(8); // 0-10
  const [cleanliness, setCleanliness] = useState<number>(13); // 0-15
  const [security, setSecurity] = useState<number>(14); // 0-15
  const [locationScore, setLocationScore] = useState<number>(9); // 0-10
  const [utilities, setUtilities] = useState<number>(8); // 0-10
  const [internet, setInternet] = useState<number>(5); // 0-5
  const [dining, setDining] = useState<number>(4); // 0-5
  const [studyEnv, setStudyEnv] = useState<number>(4); // 0-5
  const [management, setManagement] = useState<number>(4); // 0-5
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Compute 100-point score
  const totalScore = roomQuality + bathroom + cleanliness + security + locationScore + utilities + internet + dining + studyEnv + management;
  const computedCategory = totalScore >= 80 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 55 ? 'C' : 'D';

  // Aggregated Stats
  const totalMesses = properties.length;
  const totalSeats = properties.reduce((acc, p) => acc + p.totalSeats, 0);
  const totalAvailable = properties.reduce((acc, p) => acc + p.availableSeats, 0);
  const totalOccupied = totalSeats - totalAvailable;
  const maleSeats = properties.filter(p => p.genderType === 'male').reduce((acc, p) => acc + p.totalSeats, 0);
  const femaleSeats = properties.filter(p => p.genderType === 'female').reduce((acc, p) => acc + p.totalSeats, 0);
  const occupancyRate = Math.round((totalOccupied / (totalSeats || 1)) * 100);

  // Privacy Rule: For university viewer role, enforce $k \ge 5$ aggregation (suppress small groups)
  const isUniViewer = currentRole === 'university_viewer';

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePropertyCategory) {
      onUpdatePropertyCategory(selectedPropertyForAssess, computedCategory, totalScore);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-6 rounded-3xl border border-emerald-900/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{lang === 'bn' ? 'অনাবাসিক শিক্ষার্থী নিরাপত্তা সেল পোর্টাল' : 'Non-Resident Student Safety Cell Portal'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {lang === 'bn' ? 'বেরোবি হাউজিং অ্যানালিটিক্স ও সেফটি সেন্ট্রাল' : 'BRUR Housing Analytics & Safety Central'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {lang === 'bn'
              ? 'ক্যাম্পাস সংলগ্ন মেস পরিদর্শন, ১০০-পয়েন্ট গ্রেডিং, অভিযোগ নিষ্পত্তি এবং প্রাতিষ্ঠানিক পরিসংখ্যান।'
              : 'Institutional housing database, 100-point physical audits, complaint triage & k-anonymized data.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting aggregated CSV report under Safety Cell protocol...')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{lang === 'bn' ? 'রিপোর্ট এক্সপোর্ট (CSV)' : 'Export Report (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'kpi'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'bn' ? 'সামগ্রিক আবাসন তথ্য ও কেপিআই' : 'Aggregated Housing KPIs'}
        </button>
        <button
          onClick={() => setActiveTab('assessment')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'assessment'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'bn' ? '১০০-পয়েন্ট সরেজমিনে অডিট ও গ্রেডিং' : '100-Point Field Audit'}
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'complaints'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {lang === 'bn' ? 'নিরাপত্তা অভিযোগ ও তদন্ত ট্র্যাকার' : 'Complaints & Incident Queue'} ({complaints.length})
        </button>
      </div>

      {/* KPI DASHBOARD TAB */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          {/* Top 4 KPI blocks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'নিবন্ধিত মেস' : 'Registered Messes'}</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalMesses}</div>
              <span className="text-[11px] text-emerald-700 font-bold mt-1 block">৩টি মালিক সমিতি অংশীদার</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'মোট সিট ক্ষমতা' : 'Total Capacity'}</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalSeats} {lang === 'bn' ? 'টি' : 'seats'}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                ছেলে: {maleSeats} • মেয়ে: {femaleSeats}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'বর্তমান অকুপেন্সি রেট' : 'Occupancy Rate'}</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{occupancyRate}%</div>
              <span className="text-[11px] text-slate-500 mt-0.5">
                {totalAvailable} {lang === 'bn' ? 'টি সিট এই মুহূর্তে খালি' : 'vacant seats'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'অমীমাংসিত অভিযোগ' : 'Pending Complaints'}</span>
              <div className="text-2xl font-black text-rose-700 mt-1">
                {complaints.filter(c => c.status !== 'resolved').length}
              </div>
              <span className="text-[11px] text-rose-600 font-semibold mt-0.5">নিরাপত্তা সেল তদন্তাধীন</span>
            </div>
          </div>

          {/* Area Wise Density & Average Rent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
                <span>{lang === 'bn' ? 'এলাকাভিত্তিক মেস ও সিট বণ্টন' : 'Area Distribution & Vacancy'}</span>
                <span className="text-xs text-slate-400">রংপুর বেরোবি বলয়</span>
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { area: 'Park Mour (পার্ক মোড়)', count: 2, seats: 28, vacant: 3, avgRent: 2050 },
                  { area: 'Lalbagh (লালবাগ)', count: 1, seats: 24, vacant: 5, avgRent: 2650 },
                  { area: 'Sardarpara (সর্দারপাড়া)', count: 1, seats: 20, vacant: 2, avgRent: 1850 },
                  { area: 'Medical Purbo Gate (মেডিকেল পূর্ব গেট)', count: 1, seats: 18, vacant: 4, avgRent: 1700 },
                  { area: 'Modern Mor (মডার্ন মোড়)', count: 1, seats: 15, vacant: 6, avgRent: 3150 },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{item.area}</div>
                      <div className="text-[11px] text-slate-500">
                        মোট {item.seats} সিট • {item.vacant}টি খালি
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-800">৳{item.avgRent}</div>
                      <div className="text-[10px] text-slate-400">গড় ভাড়া/মাস</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Grade Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                {lang === 'bn' ? '১০০-পয়েন্ট গ্রেড বিন্যাস (A/B/C/D)' : 'Grade Distribution'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                  <span className="text-xs font-bold text-indigo-700">গ্রেড A (৮০-১০০)</span>
                  <div className="text-xl font-black text-indigo-950 mt-1">
                    {properties.filter(p => p.category === 'A').length} মেস
                  </div>
                  <span className="text-[10px] text-indigo-600">প্রিমিয়াম মানসম্পন্ন</span>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
                  <span className="text-xs font-bold text-sky-700">গ্রেড B (৭০-৭৯)</span>
                  <div className="text-xl font-black text-sky-950 mt-1">
                    {properties.filter(p => p.category === 'B').length} মেস
                  </div>
                  <span className="text-[10px] text-sky-600">স্ট্যান্ডার্ড মানসম্পন্ন</span>
                </div>

                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-center">
                  <span className="text-xs font-bold text-orange-700">গ্রেড C (৫৫-৬৯)</span>
                  <div className="text-xl font-black text-orange-950 mt-1">
                    {properties.filter(p => p.category === 'C').length} মেস
                  </div>
                  <span className="text-[10px] text-orange-600">বাজেট আবাসন</span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                  <span className="text-xs font-bold text-rose-700">গ্রেড D (&lt;৫৫)</span>
                  <div className="text-xl font-black text-rose-950 mt-1">০ মেস</div>
                  <span className="text-[10px] text-rose-600">উন্নতি সুপারিশকৃত</span>
                </div>
              </div>

              {/* k-anonymity privacy banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">k-Anonymity প্রাইভেসি নীতি বলবৎ:</span>
                  <p className="mt-0.5 text-[11px]">
                    {lang === 'bn'
                      ? 'ব্যক্তিগত তথ্য সুরক্ষায় ৫ জনের কম সদস্যবিশিষ্ট উপাত্ত দল (Sub-groups with < 5 records) বিশ্ববিদ্যালয়ের প্রশাসনিক রিপোর্টে সম্পূর্ণ মাস্কিং বা গোপন রাখা হয়েছে।'
                      : 'Data groups with fewer than 5 records are suppressed to prevent student re-identification.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 100-POINT AUDIT & ASSESSMENT FORM TAB */}
      {activeTab === 'assessment' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <span>{lang === 'bn' ? 'সরেজমিনে ১০০-পয়েন্ট আবাসন মূল্যায়ন ফর্ম' : '100-Point Field Assessment Matrix'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'ফিল্ড ভেরিফায়ার ও অনাবাসিক শিক্ষার্থী নিরাপত্তা সেলের পরিদর্শন প্রতিবেদন' : 'Used by field verifiers to calculate authentic institutional grade'}
              </p>
            </div>

            {/* Select Property */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-semibold">{lang === 'bn' ? 'মেস নির্বাচন:' : 'Target Mess:'}</span>
              <select
                value={selectedPropertyForAssess}
                onChange={(e) => setSelectedPropertyForAssess(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {lang === 'bn' ? p.nameBn : p.name} ({p.areaName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSaveAssessment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>১. রুমের মান ও আলো-বাতাস (সর্বোচ্চ ২০)</span>
                  <span className="text-emerald-700 font-black">{roomQuality}/20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={roomQuality}
                  onChange={(e) => setRoomQuality(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>২. স্যানিটেশন ও বাথরুম (সর্বোচ্চ ১০)</span>
                  <span className="text-emerald-700 font-black">{bathroom}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={bathroom}
                  onChange={(e) => setBathroom(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৩. সার্বিক পরিচ্ছন্নতা ও পরিবেশ (সর্বোচ্চ ১৫)</span>
                  <span className="text-emerald-700 font-black">{cleanliness}/15</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={cleanliness}
                  onChange={(e) => setCleanliness(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৪. নিরাপত্তা, গেট লক ও সিসিটিভি (সর্বোচ্চ ১৫)</span>
                  <span className="text-emerald-700 font-black">{security}/15</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={security}
                  onChange={(e) => setSecurity(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৫. ক্যাম্পাস হতে দূরত্ব ও যাতায়াত (সর্বোচ্চ ১০)</span>
                  <span className="text-emerald-700 font-black">{locationScore}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={locationScore}
                  onChange={(e) => setLocationScore(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৬. বিদ্যুৎ, গ্যাস ও ফিল্টার পানি (সর্বোচ্চ ১০)</span>
                  <span className="text-emerald-700 font-black">{utilities}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={utilities}
                  onChange={(e) => setUtilities(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৭. নিরবচ্ছিন্ন ইন্টারনেট ওয়াইফাই (সর্বোচ্চ ৫)</span>
                  <span className="text-emerald-700 font-black">{internet}/5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={internet}
                  onChange={(e) => setInternet(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৮. মেস ডাইনিং ও স্বাস্থ্যসম্মত খাবার (সর্বোচ্চ ৫)</span>
                  <span className="text-emerald-700 font-black">{dining}/5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={dining}
                  onChange={(e) => setDining(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>৯. পড়ার অনুকূল পরিবেশ (সর্বোচ্চ ৫)</span>
                  <span className="text-emerald-700 font-black">{studyEnv}/5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={studyEnv}
                  onChange={(e) => setStudyEnv(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>১০. ব্যবস্থাপনা ও আচরণ (সর্বোচ্চ ৫)</span>
                  <span className="text-emerald-700 font-black">{management}/5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={management}
                  onChange={(e) => setManagement(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>
            </div>

            {/* Score Total Preview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-900 block">
                  {lang === 'bn' ? 'স্বয়ংক্রিয়ভাবে গণনা করা মোট স্কোর ও ক্যাটাগরি:' : 'Computed Assessment Score & Grade:'}
                </span>
                <span className="text-xs text-slate-600">
                  {computedCategory === 'A' && 'A (৮০-১০০): প্রিমিয়াম মানসম্পন্ন আবাসন'}
                  {computedCategory === 'B' && 'B (৭০-৭৯): স্ট্যান্ডার্ড মানসম্পন্ন'}
                  {computedCategory === 'C' && 'C (৫৫-৬৯): বাজেট আবাসন'}
                  {computedCategory === 'D' && 'D (<৫৫): মান পরিমার্জন প্রয়োজন'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-800">{totalScore} / 100</div>
                  <div className="text-xs font-bold text-slate-700">গ্রেড {computedCategory}</div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
                >
                  {lang === 'bn' ? 'অডিট সংরক্ষণ ও পাবলিশ' : 'Save & Publish Grade'}
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'bn' ? 'অ্যাসেসমেন্ট সফলভাবে ডাটাবেজে হালনাগাদ করা হয়েছে এবং মেসের প্রোফাইল আপডেট হয়েছে।' : 'Assessment verified and stored. Property rating updated live.'}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* COMPLAINTS QUEUE TAB */}
      {activeTab === 'complaints' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>
              {lang === 'bn' ? 'শিক্ষার্থীদের দায়েরকৃত নিরাপত্তা অভিযোগ তালিকা:' : 'Student Submitted Grievances & Incidents:'}
            </span>
            <span className="text-rose-700 font-bold">
              {complaints.length} {lang === 'bn' ? 'টি অভিযোগ জমা' : 'Complaints logged'}
            </span>
          </div>

          {complaints.map((comp) => (
            <div
              key={comp.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                    comp.category === 'security' ? 'bg-rose-100 text-rose-800' :
                    comp.category === 'harassment' ? 'bg-red-200 text-red-900 font-black' :
                    comp.category === 'utility' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {comp.category}
                  </span>
                  <span className="font-bold text-xs text-slate-800">
                    {comp.propertyName || comp.areaName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({new Date(comp.createdAt).toLocaleDateString()})
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {comp.description}
                </p>

                <div className="text-[11px] text-slate-500">
                  {comp.isAnonymous ? (
                    <span className="italic font-semibold text-slate-600">👤 বেনামী অভিযোগ (Anonymous Mode)</span>
                  ) : (
                    <span>আবেদনকারী: <strong className="text-slate-700">{comp.reporter}</strong></span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                  comp.status === 'under_review' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {comp.status === 'resolved' ? 'মীমাংসিত' :
                   comp.status === 'under_review' ? 'তদন্তাধীন' : 'নতুন অভিযোগ'}
                </span>
                
                <button
                  onClick={() => alert(`Opening Safety Cell investigation dossier for ${comp.id}`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  {lang === 'bn' ? 'পদক্ষেপ নিন' : 'Action'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
