export type UserRole = 'student' | 'owner' | 'admin' | 'university_viewer' | 'field_verifier';

export type GenderType = 'male' | 'female' | 'both';

export type PropertyCategory = 'A' | 'B' | 'C' | 'D' | 'unrated';

export type CategorySource = 'platform_assessed' | 'user_rated' | 'owner_submitted';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'suspended';

export type RoomType = 'single' | 'double' | 'triple' | 'shared';

export type SeatStatus = 'available' | 'occupied' | 'reserved';

export interface Seat {
  id: string;
  roomId: string;
  seatLabel: string;
  seatType: string;
  monthlyRent: number;
  status: SeatStatus;
  updatedAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  floor: number;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  hasAttachedBath: boolean;
  seats: Seat[];
}

export interface PropertyPhoto {
  id: string;
  url: string;
  type: 'building' | 'room' | 'bathroom' | 'dining' | 'common' | 'exterior';
  sortOrder: number;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  associationName?: string;
  name: string;
  nameBn: string;
  address: string;
  areaName: string;
  latitude: number;
  longitude: number;
  distanceFromCampusM: number;
  genderType: GenderType;
  category: PropertyCategory;
  categorySource: CategorySource;
  totalSeats: number;
  availableSeats: number;
  rentMin: number;
  rentMax: number;
  description: string;
  descriptionBn: string;
  rules: string[];
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string;
  lastAvailabilityUpdatedAt: string;
  isFeatured: boolean;
  featuredUntil?: string;
  amenities: string[];
  photos: PropertyPhoto[];
  rooms: Room[];
  score?: number;
  reviewCount: number;
  avgRating: number;
}

export interface AssessmentScores {
  roomQuality: number; // 0-20
  bathroom: number; // 0-10
  cleanliness: number; // 0-15
  security: number; // 0-15
  location: number; // 0-10
  utilities: number; // 0-10
  internet: number; // 0-5
  dining: number; // 0-5
  studyEnv: number; // 0-5
  management: number; // 0-5
  notes?: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  studentName: string;
  studentDept: string;
  studentPhone: string;
  type: 'call' | 'message' | 'visit_request';
  message: string;
  preferredTime?: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Complaint {
  id: string;
  propertyId?: string;
  propertyName?: string;
  category: 'security' | 'harassment' | 'theft' | 'rent_dispute' | 'utility' | 'management' | 'emergency' | 'other';
  description: string;
  areaName: string;
  status: 'new' | 'under_review' | 'resolved' | 'dismissed';
  isAnonymous: boolean;
  createdAt: string;
  reporter?: string;
}
