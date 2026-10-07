import React, { useState } from 'react';
import { UserRole, Property, SeatStatus } from './types';
import { INITIAL_PROPERTIES, INITIAL_INQUIRIES, INITIAL_COMPLAINTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { StudentHome } from './components/StudentHome';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SmartMatchModal } from './components/SmartMatchModal';
import { MapExplorer } from './components/MapExplorer';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminSafetyDashboard } from './components/AdminSafetyDashboard';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { ShieldCheck, MapPin, Sparkles, Building, Layers, HeartHandshake } from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState<string>('student');

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showSmartMatch, setShowSmartMatch] = useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);

  // 1-Tap Seat Status Toggle (Fast Availability Update)
  const handleToggleSeat = (propertyId: string, seatId: string, newStatus: SeatStatus) => {
    setProperties((prev) =>
      prev.map((prop) => {
        if (prop.id !== propertyId) return prop;

        const updatedRooms = prop.rooms.map((room) => ({
          ...room,
          seats: room.seats.map((seat) =>
            seat.id === seatId ? { ...seat, status: newStatus, updatedAt: new Date().toISOString() } : seat
          ),
        }));

        // Automated recalculation of available seats & rent rollup
        const allSeats = updatedRooms.flatMap((r) => r.seats);
        const availableCount = allSeats.filter((s) => s.status === 'available').length;
        const totalCount = allSeats.length;
        const rents = allSeats.map((s) => s.monthlyRent);
        const rentMin = rents.length > 0 ? Math.min(...rents) : prop.rentMin;
        const rentMax = rents.length > 0 ? Math.max(...rents) : prop.rentMax;

        return {
          ...prop,
          rooms: updatedRooms,
          totalSeats: totalCount,
          availableSeats: availableCount,
          rentMin,
          rentMax,
          lastAvailabilityUpdatedAt: new Date().toISOString(),
        };
      })
    );

    // Also update selectedProperty if open
    setSelectedProperty((prev) => {
      if (!prev || prev.id !== propertyId) return prev;
      const updatedRooms = prev.rooms.map((room) => ({
        ...room,
        seats: room.seats.map((seat) =>
          seat.id === seatId ? { ...seat, status: newStatus, updatedAt: new Date().toISOString() } : seat
        ),
      }));
      const allSeats = updatedRooms.flatMap((r) => r.seats);
      return {
        ...prev,
        rooms: updatedRooms,
        availableSeats: allSeats.filter((s) => s.status === 'available').length,
        totalSeats: allSeats.length,
        lastAvailabilityUpdatedAt: new Date().toISOString(),
      };
    });
  };

  // Freshness reset
  const handleRefreshAvailability = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === propertyId ? { ...prop, lastAvailabilityUpdatedAt: new Date().toISOString() } : prop
      )
    );
  };

  // Field assessment update
  const handleUpdatePropertyCategory = (propId: string, category: 'A' | 'B' | 'C' | 'D', score: number) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === propId
          ? {
              ...prop,
              category,
              score,
              categorySource: 'platform_assessed',
              verificationStatus: 'verified',
              lastVerifiedAt: new Date().toISOString().split('T')[0],
            }
          : prop
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Institutional Top Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] py-1 px-4 border-b border-emerald-900 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="font-semibold text-amber-300">
            {lang === 'bn' ? 'অফিসিয়াল ক্যাম্পাস পোর্টাল:' : 'Official Campus Initiative:'}
          </span>
          <span className="truncate">
            {lang === 'bn'
              ? 'বেগম রোকেয়া বিশ্ববিদ্যালয় প্রশাসন, অনাবাসিক শিক্ষার্থী নিরাপত্তা সেল ও মেস মালিক সমিতি সমন্বিত'
              : 'Begum Rokeya University Admin, Student Safety Cell & Mess Owners Association'}
          </span>
          <span className="ml-auto hidden sm:inline text-emerald-400 font-mono">
            {lang === 'bn' ? 'জরুরি হেল্পলাইন: ০৯৬১২-০০০৭৭৭' : 'Safety Helpline: +880-9612-000777'}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        lang={lang}
        onLangToggle={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Content Area */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'student' && (
          <div className="space-y-6">
            <StudentHome
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onOpenSmartMatch={() => setShowSmartMatch(true)}
              onOpenMap={() => setShowMapModal(true)}
              lang={lang}
            />

            {/* Embedded Map Section */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'bn' ? 'ক্যাম্পাস সংলগ্ন আবাসন ক্লাস্টার মানচিত্র' : 'Campus Cluster Map'}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'গেটের দূরত্ব ও লাইভ সিট খালি থাকার অবস্থান' : 'Live proximity to Gate 1 & 2'}
                  </p>
                </div>
              </div>
              <MapExplorer
                properties={properties}
                onSelectProperty={(prop) => setSelectedProperty(prop)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {activeTab === 'owner' && (
          <OwnerDashboard
            properties={properties}
            inquiries={inquiries}
            onToggleSeat={handleToggleSeat}
            onRefreshAvailability={handleRefreshAvailability}
            lang={lang}
          />
        )}

        {activeTab === 'admin' && (
          <AdminSafetyDashboard
            properties={properties}
            complaints={complaints}
            currentRole={currentRole}
            lang={lang}
            onUpdatePropertyCategory={handleUpdatePropertyCategory}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureDocs />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              BN
            </div>
            <div>
              <p className="font-bold text-white text-sm">BRUR Nest (বেরোবি নেস্ট)</p>
              <p className="text-[11px] text-slate-500">
                {lang === 'bn' ? 'অনাবাসিক শিক্ষার্থী আবাসন ও নিরাপত্তা প্ল্যাটফর্ম' : 'Non-Resident Student Housing Platform'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>পার্ক মোড় • লালবাগ • সর্দারপাড়া • মডার্ন মোড়</span>
            <span>•</span>
            <span className="text-amber-400">নিরাপত্তা সেল হটলাইন: 01700-112233</span>
          </div>

          <p className="text-[11px] text-slate-500">
            © 2026 BRUR Student Housing Platform. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          lang={lang}
          onSeatStatusChange={(seatId, status) => handleToggleSeat(selectedProperty.id, seatId, status)}
          isOwnerView={currentRole === 'owner'}
        />
      )}

      {/* Smart Match Modal */}
      <SmartMatchModal
        isOpen={showSmartMatch}
        onClose={() => setShowSmartMatch(false)}
        properties={properties}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        lang={lang}
      />

      {/* Map Explorer Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-slate-900">
                {lang === 'bn' ? 'ক্যাম্পাস লাইভ মেস মানচিত্র' : 'BRUR Campus Live Housing Map'}
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
            <MapExplorer
              properties={properties}
              onSelectProperty={(prop) => {
                setShowMapModal(false);
                setSelectedProperty(prop);
              }}
              lang={lang}
            />
          </div>
        </div>
      )}

    </div>
  );
}
