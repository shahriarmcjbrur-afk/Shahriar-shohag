import React, { useState } from 'react';
import { Database, Code2, Shield, FolderTree, Copy, Check } from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'rls' | 'flutter' | 'seeds'>('sql');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlSchema = `-- ========================================================
-- BRUR NEST: CORE POSTGRESQL SCHEMA WITH HIERARCHY
-- Property -> Room -> Seat (Granular Core Unit)
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'owner', 'admin', 'university_viewer', 'field_verifier');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'both');
CREATE TYPE property_category AS ENUM ('A', 'B', 'C', 'D', 'unrated');
CREATE TYPE category_source AS ENUM ('platform_assessed', 'user_rated', 'owner_submitted');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'suspended');
CREATE TYPE room_type AS ENUM ('single', 'double', 'triple', 'shared');
CREATE TYPE seat_status AS ENUM ('available', 'occupied', 'reserved');
CREATE TYPE photo_category AS ENUM ('building', 'room', 'bathroom', 'dining', 'common', 'exterior');

-- 2. USER PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'student',
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    avatar_url TEXT,
    department TEXT,
    batch TEXT,
    gender gender_type,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROPERTIES & SEAT ROLLUP
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    association_id UUID,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    address TEXT NOT NULL,
    area_name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    distance_from_campus_m INTEGER NOT NULL,
    gender_type gender_type NOT NULL,
    category property_category NOT NULL DEFAULT 'unrated',
    category_source category_source NOT NULL DEFAULT 'owner_submitted',
    total_seats INTEGER NOT NULL DEFAULT 0,
    available_seats INTEGER NOT NULL DEFAULT 0,
    rent_min NUMERIC(10, 2) NOT NULL DEFAULT 0,
    rent_max NUMERIC(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    rules TEXT,
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    last_verified_at TIMESTAMPTZ,
    last_availability_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    featured_until TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROOMS & SEATS
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    floor INTEGER NOT NULL DEFAULT 1,
    room_number TEXT NOT NULL,
    room_type room_type NOT NULL DEFAULT 'double',
    capacity INTEGER NOT NULL DEFAULT 2,
    has_attached_bath BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    seat_label TEXT NOT NULL,
    seat_type TEXT NOT NULL DEFAULT 'standard',
    monthly_rent NUMERIC(10, 2) NOT NULL,
    status seat_status NOT NULL DEFAULT 'available',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AUTOMATED TRIGGER: ROLLUP SEAT COUNTS & RENT RANGE
CREATE OR REPLACE FUNCTION fn_recompute_property_seats()
RETURNS TRIGGER AS $$
DECLARE
    v_property_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT property_id INTO v_property_id FROM rooms WHERE id = OLD.room_id;
    ELSE
        SELECT property_id INTO v_property_id FROM rooms WHERE id = NEW.room_id;
    END IF;

    UPDATE properties
    SET 
        total_seats = (
            SELECT COUNT(s.id) FROM seats s 
            JOIN rooms r ON s.room_id = r.id 
            WHERE r.property_id = v_property_id
        ),
        available_seats = (
            SELECT COUNT(s.id) FROM seats s 
            JOIN rooms r ON s.room_id = r.id 
            WHERE r.property_id = v_property_id AND s.status = 'available'
        ),
        rent_min = COALESCE((
            SELECT MIN(s.monthly_rent) FROM seats s 
            JOIN rooms r ON s.room_id = r.id 
            WHERE r.property_id = v_property_id
        ), 0),
        rent_max = COALESCE((
            SELECT MAX(s.monthly_rent) FROM seats s 
            JOIN rooms r ON s.room_id = r.id 
            WHERE r.property_id = v_property_id
        ), 0),
        last_availability_updated_at = NOW()
    WHERE id = v_property_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_seats_rollup
AFTER INSERT OR UPDATE OR DELETE ON seats
FOR EACH ROW EXECUTE FUNCTION fn_recompute_property_seats();
`;

  const rlsRules = `-- ========================================================
-- BRUR NEST: ROW LEVEL SECURITY (RLS) POLICIES
-- Strict role-based enforcement directly in PostgreSQL
-- ========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 1. Helper function for role lookup
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. PROPERTIES POLICIES:
-- Public can browse active listings
CREATE POLICY "Public can view active properties"
ON properties FOR SELECT
USING (status = 'active');

-- Owners can only mutate their own properties
CREATE POLICY "Owners can manage own properties"
ON properties FOR ALL
USING (auth.uid() = owner_id);

-- Admins and Verifiers full access
CREATE POLICY "Admins full property access"
ON properties FOR ALL
USING (current_user_role() IN ('admin', 'field_verifier'));

-- 3. SEATS POLICIES:
CREATE POLICY "Public can view seats"
ON seats FOR SELECT
USING (TRUE);

CREATE POLICY "Owners can update their mess seats"
ON seats FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM rooms r
    JOIN properties p ON r.property_id = p.id
    WHERE r.id = seats.room_id AND p.owner_id = auth.uid()
  )
);

-- 4. COMPLAINTS PRIVACY POLICY:
-- Raw complaints visible ONLY to Admin and Safety Cell staff
-- University viewer gets aggregated views only!
CREATE POLICY "Complaints restricted to admin and safety cell"
ON complaints FOR SELECT
USING (
  auth.uid() = student_id OR
  current_user_role() IN ('admin', 'field_verifier')
);

CREATE POLICY "Students can submit complaints"
ON complaints FOR INSERT
WITH CHECK (TRUE);
`;

  const flutterArchitecture = `// ========================================================
// BRUR NEST: FLUTTER RIVERPOD ARCHITECTURE
// Feature-First + Material 3 + Bangla i18n
// ========================================================

/*
lib/
├── core/
│   ├── theme/
│   │   ├── app_colors.dart    // Primary: Teal (#006A60), Accent: Amber (#E59500)
│   │   └── app_theme.dart     // Material 3 ColorScheme with Noto Sans Bengali
│   ├── network/
│   │   └── supabase_client.dart
│   └── routing/
│       └── app_router.dart    // go_router with role guards
├── features/
│   ├── student_home/
│   │   ├── presentation/
│   │   │   ├── home_screen.dart
│   │   │   └── widgets/property_card.dart
│   │   └── state/properties_provider.dart
│   ├── smart_match/
│   │   └── presentation/smart_match_screen.dart
│   ├── map_explorer/
│   │   └── presentation/map_screen.dart
│   ├── owner_manager/
│   │   ├── presentation/seat_grid_screen.dart
│   │   └── state/owner_seats_notifier.dart
│   └── safety_cell/
│       └── presentation/incident_report_screen.dart
└── l10n/
    ├── app_bn.arb            // Bengali strings (Default)
    └── app_en.arb            // English strings
*/

// Transparent Smart Match Weighted Algorithm:
int calculateMatchScore({
  required Property property,
  required int budget,
  required String preferredGender,
  required int maxDistanceMeters,
  required bool needWifi,
  required bool needGenerator,
}) {
  if (property.genderType != preferredGender && property.genderType != 'both') {
    return 0; // Hard Gate
  }

  // 1. Budget Score (30%)
  int budgetScore = (budget >= property.rentMax) ? 30 : 20;

  // 2. Distance Score (25%)
  int distanceScore = (property.distanceMeters <= maxDistanceMeters) ? 25 : 12;

  // 3. 100-Point Institutional Rating (20%)
  int ratingScore = ((property.score / 100.0) * 20).round();

  // 4. Amenities Match (25%)
  int amenityScore = 0;
  if (needWifi && property.amenities.contains('wifi')) amenityScore += 15;
  if (needGenerator && property.amenities.contains('generator')) amenityScore += 10;

  return (budgetScore + distanceScore + ratingScore + amenityScore).clamp(0, 100);
}
`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-base">
              BRUR Nest: Architecture & Production Code Assets
            </h3>
            <p className="text-xs text-slate-400">
              Supabase Migrations, PostgreSQL Triggers, RLS Rules, and Flutter Riverpod Blueprint
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'sql' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              PostgreSQL Schema & Triggers
            </button>
            <button
              onClick={() => setActiveTab('rls')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'rls' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Supabase RLS Policies
            </button>
            <button
              onClick={() => setActiveTab('flutter')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'flutter' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Flutter Riverpod Architecture
            </button>
          </div>

          <button
            onClick={() => {
              const text = activeTab === 'sql' ? sqlSchema : activeTab === 'rls' ? rlsRules : flutterArchitecture;
              copyToClipboard(text);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-950 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed max-h-[600px] overflow-y-auto">
        <pre>
          {activeTab === 'sql' && sqlSchema}
          {activeTab === 'rls' && rlsRules}
          {activeTab === 'flutter' && flutterArchitecture}
        </pre>
      </div>
    </div>
  );
};
