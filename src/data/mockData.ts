import { Property, Inquiry, Complaint } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    ownerId: 'owner-1',
    ownerName: 'মো: আব্দুল মালেক',
    ownerPhone: '01712-345678',
    associationName: 'পার্ক মোড় ছাত্রাবাস মালিক সমিতি',
    name: 'Rokeya Chayanir (Boys Mess)',
    nameBn: 'রোকেয়া ছায়ানীড় ছাত্রাবাস',
    address: 'হোন্ডিং #২৪, পার্ক মোড় প্রধান সড়ক, রংপুর',
    areaName: 'Park Mour',
    latitude: 25.7198,
    longitude: 89.2612,
    distanceFromCampusM: 350,
    genderType: 'male',
    category: 'A',
    categorySource: 'platform_assessed',
    totalSeats: 16,
    availableSeats: 3,
    rentMin: 1800,
    rentMax: 2600,
    description: 'Modern 3-storied student residence near BRUR main gate with high-speed WiFi, RO water, and rooftop study area.',
    descriptionBn: 'বিশ্ববিদ্যালয় প্রধান ফটক থেকে মাত্র ৩ মিনিটের হাঁটা দূরত্ব। সার্বক্ষণিক সিসিটিভি, নিজস্ব সাবমার্সিবল ফিল্টার পানি এবং নিরিবিলি পড়ার পরিবেশ।',
    rules: ['Gate closes strictly at 10:30 PM', 'No smoking/drugs inside', 'Guests must log in the register', 'Clean rooms weekly'],
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-28',
    lastAvailabilityUpdatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isFeatured: true,
    amenities: ['wifi', 'generator', 'meal_system', 'cctv', 'filtered_water', 'study_table'],
    score: 88,
    reviewCount: 18,
    avgRating: 4.8,
    photos: [
      { id: 'p1-1', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', type: 'building', sortOrder: 1 },
      { id: 'p1-2', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', type: 'room', sortOrder: 2 },
      { id: 'p1-3', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', type: 'bathroom', sortOrder: 3 },
    ],
    rooms: [
      {
        id: 'r1-1',
        propertyId: 'prop-1',
        floor: 1,
        roomNumber: '101',
        roomType: 'double',
        capacity: 2,
        hasAttachedBath: true,
        seats: [
          { id: 's1', roomId: 'r1-1', seatLabel: '101-Window A', seatType: 'Standard Window', monthlyRent: 2400, status: 'occupied', updatedAt: '2026-10-01' },
          { id: 's2', roomId: 'r1-1', seatLabel: '101-Inside B', seatType: 'Standard Bed', monthlyRent: 2200, status: 'available', updatedAt: '2026-10-05' }
        ]
      },
      {
        id: 'r1-2',
        propertyId: 'prop-1',
        floor: 2,
        roomNumber: '202',
        roomType: 'single',
        capacity: 1,
        hasAttachedBath: false,
        seats: [
          { id: 's3', roomId: 'r1-2', seatLabel: '202-Single VIP', seatType: 'Single Room', monthlyRent: 2600, status: 'available', updatedAt: '2026-10-05' }
        ]
      },
      {
        id: 'r1-3',
        propertyId: 'prop-1',
        floor: 2,
        roomNumber: '203',
        roomType: 'triple',
        capacity: 3,
        hasAttachedBath: true,
        seats: [
          { id: 's4', roomId: 'r1-3', seatLabel: '203-Seat 1', seatType: 'Shared', monthlyRent: 1800, status: 'occupied', updatedAt: '2026-09-20' },
          { id: 's5', roomId: 'r1-3', seatLabel: '203-Seat 2', seatType: 'Shared', monthlyRent: 1800, status: 'occupied', updatedAt: '2026-09-20' },
          { id: 's6', roomId: 'r1-3', seatLabel: '203-Seat 3', seatType: 'Shared Window', monthlyRent: 1900, status: 'available', updatedAt: '2026-10-04' }
        ]
      }
    ]
  },
  {
    id: 'prop-2',
    ownerId: 'owner-2',
    ownerName: 'মোছা: নাসরিন জাহান',
    ownerPhone: '01823-987654',
    associationName: 'লালবাগ ছাত্রীনিবাস কল্যাণ সমিতি',
    name: 'Kallol Konna Nibas (Girls)',
    nameBn: 'কল্লোল কন্যা নিবাস (ছাত্রীনিবাস)',
    address: 'লেন ৪, লালবাগ বাজার সড়ক, রংপুর',
    areaName: 'Lalbagh',
    latitude: 25.7245,
    longitude: 89.2660,
    distanceFromCampusM: 600,
    genderType: 'female',
    category: 'A',
    categorySource: 'platform_assessed',
    totalSeats: 24,
    availableSeats: 5,
    rentMin: 2100,
    rentMax: 3200,
    description: 'Secured female student residence with female caretaker, biometrics door lock, uninterrupted power generator, and nutritious mess food system.',
    descriptionBn: 'সম্পূর্ণ সুরক্ষিত ছাত্রীনিবাস। সার্বক্ষণিক মহিলা কেয়ারটেকার, বায়োমেট্রিক গেট প্রবেশাধিকার, এবং বিশেষ নিরাপত্তা ব্যবস্থা।',
    rules: ['Strict in-time 8:00 PM', 'No male visitors allowed inside premises', 'Self-cook / Mess manager rotation'],
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-25',
    lastAvailabilityUpdatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isFeatured: false,
    amenities: ['wifi', 'generator', 'meal_system', 'cctv', 'filtered_water', 'study_table', 'security_guard'],
    score: 92,
    reviewCount: 31,
    avgRating: 4.9,
    photos: [
      { id: 'p2-1', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', type: 'building', sortOrder: 1 },
      { id: 'p2-2', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', type: 'room', sortOrder: 2 },
    ],
    rooms: [
      {
        id: 'r2-1',
        propertyId: 'prop-2',
        floor: 1,
        roomNumber: 'G-01',
        roomType: 'double',
        capacity: 2,
        hasAttachedBath: true,
        seats: [
          { id: 's21', roomId: 'r2-1', seatLabel: 'G01-A', seatType: 'Attached Bath Double', monthlyRent: 2800, status: 'available', updatedAt: '2026-10-06' },
          { id: 's22', roomId: 'r2-1', seatLabel: 'G01-B', seatType: 'Attached Bath Double', monthlyRent: 2800, status: 'available', updatedAt: '2026-10-06' }
        ]
      },
      {
        id: 'r2-2',
        propertyId: 'prop-2',
        floor: 2,
        roomNumber: 'G-12',
        roomType: 'triple',
        capacity: 3,
        hasAttachedBath: false,
        seats: [
          { id: 's23', roomId: 'r2-2', seatLabel: 'G12-1', seatType: 'Standard', monthlyRent: 2100, status: 'occupied', updatedAt: '2026-10-01' },
          { id: 's24', roomId: 'r2-2', seatLabel: 'G12-2', seatType: 'Standard', monthlyRent: 2100, status: 'available', updatedAt: '2026-10-06' },
          { id: 's25', roomId: 'r2-2', seatLabel: 'G12-3', seatType: 'Standard', monthlyRent: 2100, status: 'available', updatedAt: '2026-10-06' }
        ]
      }
    ]
  },
  {
    id: 'prop-3',
    ownerId: 'owner-3',
    ownerName: 'হাজী রফিকুল ইসলাম',
    ownerPhone: '01911-554433',
    associationName: 'সর্দারপাড়া মেস ওনার্স অ্যাসোসিয়েশন',
    name: 'Sardarpara Green Hostel',
    nameBn: 'সর্দারপাড়া গ্রিন ছাত্রাবাস',
    address: 'ব্লক বি, সর্দারপাড়া, পার্ক মোড় সংলগ্ন, রংপুর',
    areaName: 'Sardarpara',
    latitude: 25.7160,
    longitude: 89.2580,
    distanceFromCampusM: 450,
    genderType: 'male',
    category: 'B',
    categorySource: 'platform_assessed',
    totalSeats: 20,
    availableSeats: 2,
    rentMin: 1500,
    rentMax: 2200,
    description: 'Quiet residential neighborhood with spacious airy rooms, large study hall, and separate dining space.',
    descriptionBn: 'পড়াশোনার জন্য নিরিবিলি পরিবেশ। পরিষ্কার-পরিচ্ছন্ন বাথরুম এবং অভিজ্ঞ বাবুর্চি দ্বারা তিন বেলা খাবার ব্যবস্থা।',
    rules: ['Quiet hours 11:00 PM to 6:00 AM', 'Shared electricity bills equally', 'Rent due by 5th of each month'],
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-15',
    lastAvailabilityUpdatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isFeatured: false,
    amenities: ['wifi', 'meal_system', 'filtered_water', 'study_table'],
    score: 76,
    reviewCount: 14,
    avgRating: 4.4,
    photos: [
      { id: 'p3-1', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', type: 'building', sortOrder: 1 }
    ],
    rooms: [
      {
        id: 'r3-1',
        propertyId: 'prop-3',
        floor: 1,
        roomNumber: '104',
        roomType: 'shared',
        capacity: 4,
        hasAttachedBath: false,
        seats: [
          { id: 's31', roomId: 'r3-1', seatLabel: '104-S1', seatType: 'Shared Seat', monthlyRent: 1500, status: 'available', updatedAt: '2026-10-04' },
          { id: 's32', roomId: 'r3-1', seatLabel: '104-S2', seatType: 'Shared Seat', monthlyRent: 1500, status: 'available', updatedAt: '2026-10-04' }
        ]
      }
    ]
  },
  {
    id: 'prop-4',
    ownerId: 'owner-4',
    ownerName: 'মো: জাহিদুল আলম',
    ownerPhone: '01715-889900',
    associationName: 'পার্ক মোড় ছাত্রাবাস মালিক সমিতি',
    name: 'Ekota Student Home',
    nameBn: 'একতা ছাত্রাবাস',
    address: 'ক্যাম্পাস ২ নং গেট সংলগ্ন, পার্ক মোড়, রংপুর',
    areaName: 'Park Mour',
    latitude: 25.7210,
    longitude: 89.2635,
    distanceFromCampusM: 180,
    genderType: 'male',
    category: 'B',
    categorySource: 'platform_assessed',
    totalSeats: 12,
    availableSeats: 0,
    rentMin: 1600,
    rentMax: 2000,
    description: 'Very close to BRUR Gate 2, just 2 minutes walk. Budget friendly, high occupancy mess.',
    descriptionBn: 'বিশ্ববিদ্যালয় ২ নং গেটের একদম কাছে। অত্যন্ত সাশ্রয়ী ভাড়ায় থাকা-খাওয়ার সুব্যবস্থা।',
    rules: ['In-time 11:00 PM', 'Meal mill calculation computerized'],
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-10',
    lastAvailabilityUpdatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    isFeatured: false,
    amenities: ['wifi', 'meal_system', 'filtered_water'],
    score: 73,
    reviewCount: 9,
    avgRating: 4.2,
    photos: [
      { id: 'p4-1', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', type: 'building', sortOrder: 1 }
    ],
    rooms: [
      {
        id: 'r4-1',
        propertyId: 'prop-4',
        floor: 1,
        roomNumber: 'A1',
        roomType: 'double',
        capacity: 2,
        hasAttachedBath: false,
        seats: [
          { id: 's41', roomId: 'r4-1', seatLabel: 'A1-1', seatType: 'Standard', monthlyRent: 1700, status: 'occupied', updatedAt: '2026-09-30' },
          { id: 's42', roomId: 'r4-1', seatLabel: 'A1-2', seatType: 'Standard', monthlyRent: 1700, status: 'occupied', updatedAt: '2026-09-30' }
        ]
      }
    ]
  },
  {
    id: 'prop-5',
    ownerId: 'owner-5',
    ownerName: 'বেগম রাজিয়া সুলতানা',
    ownerPhone: '01716-123456',
    associationName: 'মেডিকেল পূর্ব গেট মেস সমিতি',
    name: 'Purbashaa Female Mess',
    nameBn: 'পূর্বাশা ছাত্রীনিবাস',
    address: 'মেডিকেল পূর্ব গেট সড়ক, রংপুর',
    areaName: 'Medical Purbo Gate',
    latitude: 25.7310,
    longitude: 89.2550,
    distanceFromCampusM: 1200,
    genderType: 'female',
    category: 'C',
    categorySource: 'platform_assessed',
    totalSeats: 18,
    availableSeats: 4,
    rentMin: 1400,
    rentMax: 2000,
    description: 'Affordable girls mess located near medical eastern gate. Easy transport to BRUR campus via auto-rickshaws.',
    descriptionBn: 'সাশ্রয়ী খরচে ছাত্রীদের জন্য নিরিবিলি বাসা। মেডিকেল মোড় থেকে ক্যাম্পাস অটো যোগাযোগ অত্যন্ত সহজ।',
    rules: ['Gate closes at 8:30 PM', 'No visitors in bedrooms'],
    verificationStatus: 'pending',
    lastVerifiedAt: undefined,
    lastAvailabilityUpdatedAt: new Date(Date.now() - 9 * 86400000).toISOString(), // > 7 days (freshness warning)
    isFeatured: false,
    amenities: ['wifi', 'filtered_water'],
    score: 62,
    reviewCount: 6,
    avgRating: 3.8,
    photos: [
      { id: 'p5-1', url: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?auto=format&fit=crop&w=800&q=80', type: 'building', sortOrder: 1 }
    ],
    rooms: [
      {
        id: 'r5-1',
        propertyId: 'prop-5',
        floor: 1,
        roomNumber: '1',
        roomType: 'triple',
        capacity: 3,
        hasAttachedBath: false,
        seats: [
          { id: 's51', roomId: 'r5-1', seatLabel: '1-A', seatType: 'Standard', monthlyRent: 1500, status: 'available', updatedAt: '2026-09-28' },
          { id: 's52', roomId: 'r5-1', seatLabel: '1-B', seatType: 'Standard', monthlyRent: 1500, status: 'available', updatedAt: '2026-09-28' }
        ]
      }
    ]
  },
  {
    id: 'prop-6',
    ownerId: 'owner-6',
    ownerName: 'তারেক মাহমুদ',
    ownerPhone: '01855-667788',
    name: 'Modern Mor Executive Mess',
    nameBn: 'মডার্ন মোড় এক্সিকিউটিভ ছাত্রাবাস',
    address: 'মডার্ন মোড় গোলচত্বর সংলগ্ন, রংপুর',
    areaName: 'Modern Mor',
    latitude: 25.7115,
    longitude: 89.2730,
    distanceFromCampusM: 1800,
    genderType: 'male',
    category: 'A',
    categorySource: 'platform_assessed',
    totalSeats: 15,
    availableSeats: 6,
    rentMin: 2500,
    rentMax: 3800,
    description: 'Premium executive bachelor residence with AC room options, gym corner, and high-speed fiber internet.',
    descriptionBn: 'মডার্ন মোড় হাইওয়ে সংলগ্ন আধুনিক সুযোগ-সুবিধাসম্পন্ন মেস। সার্বক্ষণিক জেনারেটর এবং অ্যাটাচড বাথরুম সুবিধা।',
    rules: ['Professional student demeanor required', 'Smoking prohibited indoors'],
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-09-20',
    lastAvailabilityUpdatedAt: new Date(Date.now() - 16 * 86400000).toISOString(), // > 15 days (Outdated warning)
    isFeatured: true,
    amenities: ['wifi', 'generator', 'meal_system', 'cctv', 'filtered_water', 'study_table', 'security_guard'],
    score: 85,
    reviewCount: 11,
    avgRating: 4.7,
    photos: [
      { id: 'p6-1', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', type: 'building', sortOrder: 1 }
    ],
    rooms: [
      {
        id: 'r6-1',
        propertyId: 'prop-6',
        floor: 1,
        roomNumber: '101',
        roomType: 'single',
        capacity: 1,
        hasAttachedBath: true,
        seats: [
          { id: 's61', roomId: 'r6-1', seatLabel: '101-Single AC', seatType: 'AC Room', monthlyRent: 3800, status: 'available', updatedAt: '2026-09-21' }
        ]
      }
    ]
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    propertyId: 'prop-1',
    propertyName: 'Rokeya Chayanir (Boys Mess)',
    studentName: 'শাকিল আহমেদ',
    studentDept: 'Computer Science & Engineering (13th Batch)',
    studentPhone: '01799-112233',
    type: 'visit_request',
    message: 'আমি আগামী শুক্রবার বিকেলে ২য় তলার সিঙ্গেল রুমটি সরেজমিনে দেখতে চাই। সিট ফাঁকা থাকবে কি?',
    preferredTime: '2026-10-09 16:30',
    status: 'new',
    createdAt: '2026-10-06T14:20:00Z'
  },
  {
    id: 'inq-2',
    propertyId: 'prop-1',
    propertyName: 'Rokeya Chayanir (Boys Mess)',
    studentName: 'রাকিবুল হাসান',
    studentDept: 'Economics (14th Batch)',
    studentPhone: '01811-223344',
    type: 'call',
    message: 'খাবারের মিল সিস্টেম এবং মোট মাসিক আনুমানিক খরচ জানতে চাই।',
    status: 'contacted',
    createdAt: '2026-10-05T11:00:00Z'
  },
  {
    id: 'inq-3',
    propertyId: 'prop-2',
    propertyName: 'Kallol Konna Nibas (Girls)',
    studentName: 'ফারজানা আক্তার তিশা',
    studentDept: 'English (12th Batch)',
    studentPhone: '01722-334455',
    type: 'visit_request',
    message: 'আমার একজন সহপাঠী সহ ২ জনের সিট বুক করতে চাই। অভিভাবক সহ আসার সময় নির্ধারণ করতে চাই।',
    preferredTime: '2026-10-10 11:00',
    status: 'new',
    createdAt: '2026-10-07T09:15:00Z'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-1',
    propertyId: 'prop-5',
    propertyName: 'Purbashaa Female Mess',
    category: 'utility',
    description: 'গত ৪ দিন ধরে নিচতলায় পানির মোটর নষ্ট থাকায় গোসল ও দৈনন্দিন কাজে মারাত্মক সমস্যা হচ্ছে। মালিক বারবার সময় চেয়েও মেরামত করছেন না।',
    areaName: 'Medical Purbo Gate',
    status: 'under_review',
    isAnonymous: false,
    reporter: 'সাদিয়া বিনতে আলম (বায়োকেমিস্ট্রি)',
    createdAt: '2026-10-04T10:00:00Z'
  },
  {
    id: 'comp-2',
    category: 'security',
    description: 'লালবাগ ২ নং গলির মুখে রাত ৯টার পর পর্যাপ্ত ল্যাম্পপোস্ট আলো না থাকায় ছাত্রীদের যাতায়াতে বখাটেদের উৎপাত বাড়ছে। নিরাপত্তা সেলের নজরদারি প্রয়োজন।',
    areaName: 'Lalbagh',
    status: 'new',
    isAnonymous: true,
    createdAt: '2026-10-06T20:30:00Z'
  },
  {
    id: 'comp-3',
    propertyId: 'prop-3',
    propertyName: 'Sardarpara Green Hostel',
    category: 'rent_dispute',
    description: 'মেস ছাড়ার ২ মাস পূর্বে নোটিশ দেওয়া সত্ত্বেও মালিক সিকিউরিটি ডিপোজিটের ৩০০০ টাকা ফেরত দিতে অস্বীকৃতি জানাচ্ছেন।',
    areaName: 'Sardarpara',
    status: 'resolved',
    isAnonymous: false,
    reporter: 'মোহাম্মদ আলী (ম্যানেজমেন্ট স্টাডিজ)',
    createdAt: '2026-09-29T15:10:00Z'
  }
];
