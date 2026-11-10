import { useEffect, useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  validateHotelInput,
  type Hotel,
  type HotelFormErrors,
  type HotelInput,
} from "@/lib/hotel-types";

type FormValues = {
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  rating: string;
  reviewCount: string;
  isActive: boolean;
};

const EMPTY_VALUES: FormValues = {
  name: "",
  location: "",
  imageUrl: "",
  price: "",
  rating: "4.5",
  reviewCount: "0",
  isActive: true,
};

function hotelToValues(hotel: Hotel): FormValues {
  return {
    name: hotel.name,
    location: hotel.location,
    imageUrl: hotel.image_url,
    price: String(hotel.price),
    rating: String(hotel.rating),
    reviewCount: String(hotel.review_count),
    isActive: hotel.is_active,
  };
}

export function HotelFormDialog({
  open,
  onOpenChange,
  hotel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotel?: Hotel | undefined;
  onSubmit: (input: HotelInput) => Promise<string | void>;
}) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<HotelFormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(hotel ? hotelToValues(hotel) : EMPTY_VALUES);
      setErrors({});
      setMessage(null);
    }
  }, [open, hotel]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    const { data, errors: validationErrors } = validateHotelInput({
      name: values.name,
      location: values.location,
      imageUrl: values.imageUrl,
      price: values.price,
      rating: values.rating,
      reviewCount: values.reviewCount,
    });

    if (!data) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setPending(true);
    const errorMessage = await onSubmit({ ...data, is_active: values.isActive });
    setPending(false);

    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{hotel ? "Edit hotel" : "Add hotel"}</DialogTitle>
          <DialogDescription>
            {hotel ? "Update this hotel's details." : "Add a new hotel to Rimbers Trip."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ubud Jungle Resort"
              className="mt-1.5"
            />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={values.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Bali, Indonesia"
              className="mt-1.5"
            />
            {errors.location ? (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={values.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1.5"
            />
            {errors.image_url ? (
              <p className="mt-1 text-xs text-red-600">{errors.image_url}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="price">Price (USD/night)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={values.price}
                onChange={(e) => update("price", e.target.value)}
                className="mt-1.5"
              />
              {errors.price ? <p className="mt-1 text-xs text-red-600">{errors.price}</p> : null}
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                min={0}
                max={5}
                step="0.1"
                value={values.rating}
                onChange={(e) => update("rating", e.target.value)}
                className="mt-1.5"
              />
              {errors.rating ? <p className="mt-1 text-xs text-red-600">{errors.rating}</p> : null}
            </div>
            <div>
              <Label htmlFor="review_count">Reviews</Label>
              <Input
                id="review_count"
                type="number"
                min={0}
                step="1"
                value={values.reviewCount}
                onChange={(e) => update("reviewCount", e.target.value)}
                className="mt-1.5"
              />
              {errors.review_count ? (
                <p className="mt-1 text-xs text-red-600">{errors.review_count}</p>
              ) : null}
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium text-neutral-700">
            <Checkbox
              checked={values.isActive}
              onCheckedChange={(checked) => update("isActive", checked === true)}
            />
            Active (visible in the app)
          </label>

          {message ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{message}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending}
              className="bg-gradient-to-r from-[#1AB65C] to-[#39E180] text-white hover:opacity-90"
            >
              {pending ? "Saving…" : hotel ? "Save changes" : "Create hotel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
