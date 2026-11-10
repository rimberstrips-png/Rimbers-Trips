import { describe, expect, it } from "vitest";
import { validateHotelInput } from "@/lib/hotel-types";

const validInput = {
  name: "Ocean View Resort",
  location: "Bali, Indonesia",
  imageUrl: "https://example.com/image.jpg",
  price: "150",
  rating: "4.5",
  reviewCount: "120",
};

describe("validateHotelInput", () => {
  it("returns normalized data and no errors for fully valid input", () => {
    const { data, errors } = validateHotelInput(validInput);

    expect(errors).toEqual({});
    expect(data).toEqual({
      name: "Ocean View Resort",
      location: "Bali, Indonesia",
      image_url: "https://example.com/image.jpg",
      price: 150,
      rating: 4.5,
      review_count: 120,
      is_active: true,
    });
  });

  it("trims whitespace from name and location", () => {
    const { data } = validateHotelInput({
      ...validInput,
      name: "  Ocean View  ",
      location: "  Bali, Indonesia  ",
    });

    expect(data?.name).toBe("Ocean View");
    expect(data?.location).toBe("Bali, Indonesia");
  });

  it("defaults rating to 4.5 when left blank", () => {
    const { data, errors } = validateHotelInput({ ...validInput, rating: "" });

    expect(errors.rating).toBeUndefined();
    expect(data?.rating).toBe(4.5);
  });

  it("defaults review count to 0 when left blank", () => {
    const { data, errors } = validateHotelInput({ ...validInput, reviewCount: "" });

    expect(errors.review_count).toBeUndefined();
    expect(data?.review_count).toBe(0);
  });

  it("requires a name", () => {
    const { data, errors } = validateHotelInput({ ...validInput, name: "   " });

    expect(data).toBeNull();
    expect(errors.name).toBe("Name is required.");
  });

  it("requires location in 'City, Country' format", () => {
    const { errors } = validateHotelInput({ ...validInput, location: "Bali" });

    expect(errors.location).toMatch(/City, Country/);
  });

  it("rejects an invalid image URL", () => {
    const { errors } = validateHotelInput({ ...validInput, imageUrl: "not-a-url" });

    expect(errors.image_url).toBe("Enter a valid URL.");
  });

  it("rejects a negative price", () => {
    const { errors } = validateHotelInput({ ...validInput, price: "-10" });

    expect(errors.price).toBe("Price must be a positive number.");
  });

  it("rejects a non-numeric price", () => {
    const { errors } = validateHotelInput({ ...validInput, price: "abc" });

    expect(errors.price).toBe("Price must be a positive number.");
  });

  it("rejects a rating outside the 0-5 range", () => {
    const { errors } = validateHotelInput({ ...validInput, rating: "6" });

    expect(errors.rating).toContain("between 0 and 5");
  });

  it("rejects a non-integer review count", () => {
    const { errors } = validateHotelInput({ ...validInput, reviewCount: "3.5" });

    expect(errors.review_count).toBe("Review count must be a whole number.");
  });

  it("collects multiple errors at once instead of stopping at the first", () => {
    const { data, errors } = validateHotelInput({
      name: "",
      location: "Bali",
      imageUrl: "bad-url",
      price: "-1",
      rating: "10",
      reviewCount: "-2",
    });

    expect(data).toBeNull();
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining([
        "name",
        "location",
        "image_url",
        "price",
        "rating",
        "review_count",
      ]),
    );
  });
});
