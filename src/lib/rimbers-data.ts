export const BUSINESS_TYPES = [
  { id: "hotel", label: "Hotel", desc: "Accommodations with restaurants, meeting rooms and guest services" },
  { id: "resort", label: "Resort", desc: "Leisure destinations with on-site facilities and activities" },
  { id: "apartment", label: "Apartment", desc: "Furnished, self-catering places rented as a whole" },
  { id: "villa", label: "Villa", desc: "Private standalone homes, often with pool and garden" },
  { id: "guest-house", label: "Guest House", desc: "Private home with separate living facilities for host and guest" },
  { id: "hostel", label: "Hostel", desc: "Budget stays with dorm-style beds and social atmosphere" },
  { id: "travel-agency", label: "Travel Agency", desc: "Packaged trips, bookings and travel advisory" },
  { id: "tour-operator", label: "Tour Operator", desc: "Guided tours, excursions and multi-day itineraries" },
  { id: "car-rental", label: "Car Rental Company", desc: "Self-drive and chauffeur vehicle rentals" },
  { id: "experience", label: "Experience Provider", desc: "Activities, tickets, adventures and local experiences" },
  { id: "other", label: "Other Travel Business", desc: "Any other travel or hospitality service" },
] as const;

export const COUNTRIES = [
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Turkey",
  "United Kingdom",
  "Malaysia",
  "Thailand",
  "Indonesia",
  "United States",
];

export type ListingStatus = "Draft" | "Pending Review" | "Published" | "Suspended" | "Rejected";
export type VerificationStatus = "Pending" | "Under Review" | "Verified" | "Rejected";

export const business = {
  name: "Rimbers Hospitality Group",
  displayName: "Rimbers Hospitality",
  type: "Hotel",
  verification: "Under Review" as VerificationStatus,
  city: "Islamabad",
  country: "Pakistan",
  email: "corporate@rimbershospitality.com",
  phone: "+92 51 111 0000",
  website: "https://rimbershospitality.com",
  rating: 4.7,
  reviews: 312,
  since: "2023",
  description:
    "A family-run hospitality group operating boutique hotels and mountain lodges across northern Pakistan, focused on warm service and locally sourced experiences.",
};

export const kpis = [
  { label: "Total bookings", value: "1,284", delta: "+12.4%", trend: "up" as const },
  { label: "Upcoming bookings", value: "96", delta: "+6", trend: "up" as const },
  { label: "Today's check-ins", value: "14", delta: "4 pending", trend: "flat" as const },
  { label: "Today's check-outs", value: "9", delta: "2 late", trend: "flat" as const },
  { label: "Revenue (30d)", value: "PKR 8.42M", delta: "+18.1%", trend: "up" as const },
  { label: "Pending payouts", value: "PKR 1.13M", delta: "Next: 02 Sep", trend: "flat" as const },
  { label: "Property views", value: "42,918", delta: "+9.7%", trend: "up" as const },
  { label: "Conversion rate", value: "3.9%", delta: "-0.3%", trend: "down" as const },
];

export const revenueSeries = [
  { month: "Jan", revenue: 4.1, bookings: 78, occupancy: 54 },
  { month: "Feb", revenue: 4.8, bookings: 91, occupancy: 61 },
  { month: "Mar", revenue: 5.6, bookings: 104, occupancy: 66 },
  { month: "Apr", revenue: 6.2, bookings: 118, occupancy: 71 },
  { month: "May", revenue: 7.4, bookings: 132, occupancy: 78 },
  { month: "Jun", revenue: 8.1, bookings: 141, occupancy: 82 },
  { month: "Jul", revenue: 9.3, bookings: 158, occupancy: 88 },
  { month: "Aug", revenue: 8.4, bookings: 149, occupancy: 84 },
];

export const roomMix = [
  { name: "Deluxe Twin", value: 38 },
  { name: "Executive Suite", value: 26 },
  { name: "Mountain View King", value: 21 },
  { name: "Shared Dorm", value: 15 },
];

export type Property = {
  id: string;
  name: string;
  type: string;
  city: string;
  rooms: number;
  rating: number;
  price: string;
  status: ListingStatus;
  views: number;
};

export const properties: Property[] = [
  { id: "PR-1041", name: "Rimbers Boutique Islamabad", type: "Hotel", city: "Islamabad", rooms: 42, rating: 4.8, price: "PKR 24,500", status: "Published", views: 18420 },
  { id: "PR-1042", name: "Hunza Ridge Lodge", type: "Guest House", city: "Hunza", rooms: 14, rating: 4.9, price: "PKR 16,900", status: "Published", views: 11230 },
  { id: "PR-1043", name: "Swat Riverside Resort", type: "Resort", city: "Swat", rooms: 68, rating: 4.5, price: "PKR 31,000", status: "Pending Review", views: 6410 },
  { id: "PR-1044", name: "Lahore Executive Apartments", type: "Apartment", city: "Lahore", rooms: 20, rating: 4.4, price: "PKR 19,750", status: "Draft", views: 2140 },
  { id: "PR-1045", name: "Skardu Basecamp Hostel", type: "Hostel", city: "Skardu", rooms: 12, rating: 4.2, price: "PKR 5,600", status: "Suspended", views: 4718 },
];

export type Room = {
  id: string;
  name: string;
  bed: string;
  guests: number;
  count: number;
  price: number;
  weekend: number;
  breakfast: string;
  availability: string;
};

export const rooms: Room[] = [
  { id: "RM-01", name: "Deluxe Twin", bed: "2 single beds", guests: 2, count: 12, price: 24500, weekend: 28900, breakfast: "Included", availability: "Open" },
  { id: "RM-02", name: "Executive Suite", bed: "1 king bed", guests: 3, count: 6, price: 41000, weekend: 46500, breakfast: "Included", availability: "Open" },
  { id: "RM-03", name: "Mountain View King", bed: "1 king bed", guests: 2, count: 8, price: 33200, weekend: 37800, breakfast: "Optional (PKR 1,800)", availability: "Limited" },
  { id: "RM-04", name: "Shared Dorm (6 beds)", bed: "6 bunk beds", guests: 1, count: 4, price: 5600, weekend: 6400, breakfast: "Not included", availability: "Closed" },
];

export type BookingStatus = "Upcoming" | "Current stay" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  guest: string;
  property: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: string;
  payment: "Paid" | "Pending" | "Refunded";
  status: BookingStatus;
};

export const bookings: Booking[] = [
  { id: "RB-98214", guest: "Ayesha Malik", property: "Rimbers Boutique Islamabad", room: "Executive Suite", checkIn: "28 Aug 2026", checkOut: "31 Aug 2026", guests: 2, amount: "PKR 123,000", payment: "Paid", status: "Upcoming" },
  { id: "RB-98211", guest: "Daniel Okafor", property: "Hunza Ridge Lodge", room: "Mountain View King", checkIn: "26 Aug 2026", checkOut: "29 Aug 2026", guests: 2, amount: "PKR 99,600", payment: "Paid", status: "Current stay" },
  { id: "RB-98207", guest: "Fatima Zahra", property: "Rimbers Boutique Islamabad", room: "Deluxe Twin", checkIn: "26 Aug 2026", checkOut: "27 Aug 2026", guests: 3, amount: "PKR 24,500", payment: "Pending", status: "Current stay" },
  { id: "RB-98155", guest: "Hamza Sheikh", property: "Swat Riverside Resort", room: "Deluxe Twin", checkIn: "12 Aug 2026", checkOut: "16 Aug 2026", guests: 4, amount: "PKR 98,000", payment: "Paid", status: "Completed" },
  { id: "RB-98132", guest: "Lena Fischer", property: "Skardu Basecamp Hostel", room: "Shared Dorm (6 beds)", checkIn: "05 Aug 2026", checkOut: "08 Aug 2026", guests: 1, amount: "PKR 16,800", payment: "Refunded", status: "Cancelled" },
  { id: "RB-98290", guest: "Omar Farooq", property: "Hunza Ridge Lodge", room: "Executive Suite", checkIn: "02 Sep 2026", checkOut: "06 Sep 2026", guests: 2, amount: "PKR 164,000", payment: "Pending", status: "Upcoming" },
];

export const reviews = [
  {
    id: "RV-4410",
    guest: "Ayesha Malik",
    property: "Rimbers Boutique Islamabad",
    rating: 4.8,
    date: "18 Aug 2026",
    comment:
      "Spotless rooms and the breakfast spread was genuinely excellent. Front desk arranged an early check-in without any fuss.",
    reply:
      "Thank you Ayesha — we're delighted the early check-in worked out. We hope to host you again on your next Islamabad trip.",
  },
  {
    id: "RV-4402",
    guest: "Daniel Okafor",
    property: "Hunza Ridge Lodge",
    rating: 5,
    date: "14 Aug 2026",
    comment: "The valley view from the room is unreal. Heating worked perfectly and the staff arranged a local guide for us.",
    reply: null,
  },
  {
    id: "RV-4388",
    guest: "Hamza Sheikh",
    property: "Swat Riverside Resort",
    rating: 3.6,
    date: "09 Aug 2026",
    comment: "Great location by the river, but the Wi-Fi kept dropping and check-out took a while.",
    reply: null,
  },
];

export const categoryRatings = [
  { label: "Cleanliness", value: 4.8 },
  { label: "Comfort", value: 4.7 },
  { label: "Location", value: 4.9 },
  { label: "Staff", value: 4.8 },
  { label: "Value for money", value: 4.4 },
  { label: "Facilities", value: 4.5 },
];

export const transactions = [
  { id: "TXN-77120", date: "22 Aug 2026", type: "Booking revenue", ref: "RB-98214", amount: "+ PKR 123,000", status: "Cleared" },
  { id: "TXN-77118", date: "20 Aug 2026", type: "Platform fee", ref: "RB-98214", amount: "- PKR 18,450", status: "Cleared" },
  { id: "TXN-77102", date: "18 Aug 2026", type: "Payout", ref: "PO-2261", amount: "- PKR 940,000", status: "Completed" },
  { id: "TXN-77090", date: "15 Aug 2026", type: "Refund", ref: "RB-98132", amount: "- PKR 16,800", status: "Processed" },
  { id: "TXN-77081", date: "12 Aug 2026", type: "Booking revenue", ref: "RB-98155", amount: "+ PKR 98,000", status: "Cleared" },
];

export const verificationDocs = [
  { name: "Business registration certificate", status: "Verified", file: "SECP-registration.pdf" },
  { name: "Tourism license", status: "Under Review", file: "tourism-license-2026.pdf" },
  { name: "Tax / NTN documents", status: "Verified", file: "ntn-certificate.pdf" },
  { name: "Identity / ownership documents", status: "Pending", file: null },
];

export const AMENITIES = [
  "Free Wi-Fi",
  "Parking",
  "Airport shuttle",
  "Swimming pool",
  "Restaurant",
  "Room service",
  "Gym",
  "Spa",
  "Air conditioning",
  "Heating",
  "Laundry",
  "Pet friendly",
  "Family rooms",
  "Business centre",
];
