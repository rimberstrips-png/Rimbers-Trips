export type Hotel = {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  review_count: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type HotelInput = {
  name: string;
  location: string;
  price: number;
  rating: number;
  review_count: number;
  image_url: string;
  is_active: boolean;
};

export type HotelFormErrors = Partial<Record<keyof HotelInput, string>>;

const LOCATION_PATTERN = /^.+,\s*.+$/;

export function validateHotelInput(input: {
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  rating: string;
  reviewCount: string;
}): { data: HotelInput | null; errors: HotelFormErrors } {
  const errors: HotelFormErrors = {};

  const name = input.name.trim();
  const location = input.location.trim();
  const imageUrl = input.imageUrl.trim();

  if (!name) errors.name = "Name is required.";
  if (!location) errors.location = "Location is required.";
  else if (!LOCATION_PATTERN.test(location)) {
    errors.location = 'Use the format "City, Country", e.g. "Bali, Indonesia".';
  }

  if (!imageUrl) errors.image_url = "Image URL is required.";
  else {
    try {
      new URL(imageUrl);
    } catch {
      errors.image_url = "Enter a valid URL.";
    }
  }

  const price = Number(input.price);
  if (!input.price.trim() || Number.isNaN(price) || price < 0) {
    errors.price = "Price must be a positive number.";
  }

  const rating = input.rating.trim() === "" ? 4.5 : Number(input.rating);
  if (Number.isNaN(rating) || rating < 0 || rating > 5) {
    errors.rating = "Rating must be a number between 0 and 5.";
  }

  const reviewCount = input.reviewCount.trim() === "" ? 0 : Number(input.reviewCount);
  if (Number.isNaN(reviewCount) || reviewCount < 0 || !Number.isInteger(reviewCount)) {
    errors.review_count = "Review count must be a whole number.";
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      name,
      location,
      image_url: imageUrl,
      price,
      rating,
      review_count: reviewCount,
      is_active: true,
    },
    errors: {},
  };
}
