import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { AMENITIES, BUSINESS_TYPES, rooms } from "@/lib/rimbers-data";
import { ImagePlus, Plus } from "lucide-react";

export const Route = createFileRoute("/business/listing-setup")({
  head: () => ({
    meta: [
      { title: "Create your first listing — Rimbers Trip Business" },
      {
        name: "description",
        content: "Add your property details, photos, amenities, policies and room types to publish on Rimbers Trip.",
      },
      { property: "og:title", content: "Create your first listing — Rimbers Trip Business" },
      { property: "og:description", content: "Property details, photos, amenities, policies and room types." },
    ],
  }),
  component: ListingSetup,
});

function ListingSetup() {
  const [tab, setTab] = useState<"property" | "rooms">("property");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold">Set up your first listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your listing stays in Draft until you submit it for review.
        </p>

        <div className="mt-6 inline-flex rounded-lg border p-1">
          {(["property", "rooms"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm capitalize ${
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {t === "property" ? "Property details" : "Rooms"}
            </button>
          ))}
        </div>

        {tab === "property" ? (
          <div className="surface-card mt-6 grid gap-5 p-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Property name</Label>
              <Input placeholder="Rimbers Boutique Islamabad" />
            </div>
            <div className="space-y-1.5">
              <Label>Property type</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {BUSINESS_TYPES.map((t) => (
                  <option key={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={4} placeholder="Describe the property, neighbourhood and standout features…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Photos</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className="flex aspect-4/3 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    <ImagePlus className="h-5 w-5" />
                    Add photo
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="Street 12, F-7 Markaz, Islamabad" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact information</Label>
              <Input placeholder="+92 51 111 0000" />
            </div>
            <div className="space-y-1.5">
              <Label>Check-in time</Label>
              <Input type="time" defaultValue="14:00" />
            </div>
            <div className="space-y-1.5">
              <Label>Check-out time</Label>
              <Input type="time" defaultValue="11:00" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Amenities & facilities</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <Checkbox /> {a}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Property policies</Label>
              <Textarea rows={3} placeholder="Smoking, pets, children, quiet hours, ID requirements…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Cancellation policy</Label>
              <Textarea rows={3} defaultValue="Free cancellation up to 48 hours before check-in. After that, the first night is charged." />
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <Button variant="outline">Save as draft</Button>
              <Button onClick={() => setTab("rooms")}>Continue to rooms</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {rooms.map((r) => (
              <div key={r.id} className="surface-card grid gap-4 p-5 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Room name</Label>
                  <Input defaultValue={r.name} />
                </div>
                <div className="space-y-1.5">
                  <Label>Bed type</Label>
                  <Input defaultValue={r.bed} />
                </div>
                <div className="space-y-1.5">
                  <Label>Guests</Label>
                  <Input type="number" defaultValue={r.guests} />
                </div>
                <div className="space-y-1.5">
                  <Label>Number of rooms</Label>
                  <Input type="number" defaultValue={r.count} />
                </div>
                <div className="space-y-1.5">
                  <Label>Price per night (PKR)</Label>
                  <Input type="number" defaultValue={r.price} />
                </div>
                <div className="space-y-1.5">
                  <Label>Weekend price (PKR)</Label>
                  <Input type="number" defaultValue={r.weekend} />
                </div>
                <div className="space-y-1.5">
                  <Label>Seasonal price (PKR)</Label>
                  <Input type="number" placeholder="Peak season rate" />
                </div>
                <div className="space-y-1.5">
                  <Label>Breakfast</Label>
                  <Input defaultValue={r.breakfast} />
                </div>
                <div className="space-y-1.5">
                  <Label>Availability</Label>
                  <Input defaultValue={r.availability} />
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label>Room description</Label>
                  <Textarea rows={2} placeholder="Room size, view, bathroom, workspace…" />
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label>Room amenities</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {AMENITIES.slice(0, 8).map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm">
                        <Checkbox /> {a}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label>Cancellation policy for this room</Label>
                  <Input defaultValue="Free cancellation up to 48h before check-in" />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add another room type
            </Button>
            <div className="flex justify-end gap-3">
              <Button variant="outline">Save as draft</Button>
              <Button asChild>
                <Link to="/corporate">Submit for review</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
