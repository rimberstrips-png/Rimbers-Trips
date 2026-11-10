export type ProfileRole = "customer" | "business";

export type Profile = {
  user_id: string;
  role: ProfileRole;
  created_at: string;
};

export type BusinessStatus = "pending" | "approved" | "rejected";

export type Business = {
  id: number;
  owner_id: string;
  status: BusinessStatus;
  business_name: string;
  business_email: string | null;
  phone: string | null;
  country: string | null;
  business_type: string | null;
  legal_name: string | null;
  display_name: string | null;
  category: string | null;
  license_number: string | null;
  tax_info: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  map_link: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export type BusinessRegistrationInput = Omit<
  Business,
  "id" | "owner_id" | "status" | "created_at" | "reviewed_at" | "reviewed_by"
>;
