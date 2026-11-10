import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { BUSINESS_TYPES, reviews } from "@/lib/rimbers-data";
import { supabase } from "@/lib/supabase";
import type { Hotel } from "@/lib/hotel-types";
import { MapPin, Search, Star, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rimbers Trip — Find stays, tours and experiences" },
      {
        name: "description",
        content:
          "Search and book hotels, apartments, resorts, tours and experiences across the region with Rimbers Trip.",
      },
      { property: "og:title", content: "Rimbers Trip — Find stays, tours and experiences" },
      {
        property: "og:description",
        content: "Compare prices and book your next stay, tour or experience on Rimbers Trip.",
      },
    ],
  }),
  component: Index,
});

function cityOf(location: string) {
  return location.split(",")[0]?.trim() ?? location;
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

async function fetchActiveHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Hotel[];
}

function HotelCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="h-48 animate-pulse bg-muted" />
      <div className="space-y-2 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function Index() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const today = useMemo(todayISO, []);

  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-hotels"],
    queryFn: fetchActiveHotels,
  });

  const destinations = useMemo(() => {
    const byCity = new Map<string, { count: number; image: string }>();
    for (const h of hotels ?? []) {
      const city = cityOf(h.location);
      const existing = byCity.get(city);
      if (existing) {
        existing.count += 1;
      } else {
        byCity.set(city, { count: 1, image: h.image_url });
      }
    }
    return Array.from(byCity.entries()).map(([city, v]) => ({ city, ...v }));
  }, [hotels]);

  const results = useMemo(() => {
    if (!destination.trim()) return hotels ?? [];
    const q = destination.trim().toLowerCase();
    return (hotels ?? []).filter((h) => h.location.toLowerCase().includes(q));
  }, [hotels, destination]);

  function handleCheckInChange(value: string) {
    setCheckIn(value);
    if (checkOut && value && checkOut < value) setCheckOut(value);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (checkIn && checkIn < today) {
      setDateError("Check-in date can't be in the past.");
      return;
    }
    if (checkOut && checkIn && checkOut < checkIn) {
      setDateError("Check-out date must be the same as or after check-in.");
      return;
    }

    setDateError(null);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero + search */}
      <section className="bg-brand-deep text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 md:pt-20">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
            Find your next stay
          </h1>
          <p className="mt-3 max-w-xl text-base opacity-85 md:text-lg">
            Search hotels, resorts and stays around the world — compare prices and book direct.
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 md:pb-14">
          <form
            onSubmit={handleSearchSubmit}
            className="surface-card grid gap-3 p-4 text-foreground sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end"
          >
            <div>
              <Label htmlFor="destination">Destination</Label>
              <div className="relative mt-1.5">
                <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="City or country, e.g. Bali"
                  className="pl-8"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="checkin">Check-in</Label>
              <Input
                id="checkin"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="checkout">Check-out</Label>
              <Input
                id="checkout"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="guests">Guests</Label>
              <div className="relative mt-1.5">
                <Users className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="guests" type="number" min={1} defaultValue={2} className="pl-8" />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full lg:w-auto">
              <Search className="h-4 w-4" />
              Search
            </Button>
            {dateError ? (
              <p className="text-sm font-medium text-destructive sm:col-span-2 lg:col-span-5">
                {dateError}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
        {/* Popular destinations */}
        {destinations.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold">Popular destinations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked places travellers love right now.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {destinations.map((d) => (
                <button
                  key={d.city}
                  type="button"
                  onClick={() => {
                    setDestination(d.city);
                    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="group relative h-36 overflow-hidden rounded-xl text-left shadow-sm transition-shadow hover:shadow-lg"
                >
                  <img
                    src={d.image}
                    alt={d.city}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="h-3.5 w-3.5" />
                      {d.city}
                    </span>
                    <span className="text-xs opacity-90">
                      {d.count} {d.count === 1 ? "stay" : "stays"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {/* Featured stays */}
        <section ref={resultsRef} className="mt-14 scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Featured stays</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLoading
                  ? "Loading stays…"
                  : `${results.length} ${results.length === 1 ? "stay" : "stays"}${
                      destination ? ` in "${destination}"` : ""
                    }`}
              </p>
            </div>
            {destination ? (
              <Button variant="ghost" size="sm" onClick={() => setDestination("")}>
                Clear filter
              </Button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <HotelCardSkeleton key={i} />)
            ) : error ? (
              <div className="surface-card col-span-full p-8 text-center text-sm text-red-600">
                Failed to load stays: {(error as Error).message}
              </div>
            ) : results.length === 0 ? (
              <div className="surface-card col-span-full p-8 text-center text-sm text-muted-foreground">
                No stays match your search. Try another destination.
              </div>
            ) : (
              results.map((hotel) => (
                <div
                  key={hotel.id}
                  className="surface-card group overflow-hidden p-0 transition-shadow hover:shadow-lg"
                >
                  <div className="h-48 overflow-hidden bg-muted">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold leading-snug">{hotel.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {hotel.location}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {hotel.rating.toFixed(1)}
                        <span className="text-muted-foreground">({hotel.review_count})</span>
                      </span>
                      <span className="text-sm">
                        <span className="font-bold">${hotel.price.toLocaleString()}</span>{" "}
                        <span className="text-muted-foreground">/ night</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">What travellers are saying</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="surface-card p-5">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {r.rating}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">&ldquo;{r.comment}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold">{r.guest}</p>
                <p className="text-xs text-muted-foreground">{r.property}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Business CTA */}
        <section className="surface-card mt-14 flex flex-wrap items-center justify-between gap-4 bg-brand-deep p-8 text-brand-foreground">
          <div>
            <h2 className="text-xl font-bold">Own a hotel, resort or tour business?</h2>
            <p className="mt-1 max-w-xl text-sm opacity-85">
              List your{" "}
              {BUSINESS_TYPES.slice(0, 3)
                .map((t) => t.label.toLowerCase())
                .join(", ")}{" "}
              and more on Rimbers Trip and start welcoming guests.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link to="/business">List Your Business</Link>
          </Button>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
