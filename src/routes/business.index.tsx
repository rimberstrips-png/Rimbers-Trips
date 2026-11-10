import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { BUSINESS_TYPES } from "@/lib/rimbers-data";
import { Building2, LineChart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/business/")({
  head: () => ({
    meta: [
      { title: "List Your Business — Rimbers Trip" },
      {
        name: "description",
        content:
          "Register your hotel, resort, apartment, tour company or car rental on Rimbers Trip and manage bookings, pricing and payouts.",
      },
      { property: "og:title", content: "List Your Business — Rimbers Trip" },
      {
        property: "og:description",
        content: "Register your travel business on Rimbers Trip and start welcoming guests.",
      },
    ],
  }),
  component: BusinessLanding,
});

function BusinessLanding() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Pitch */}
      <section className="bg-brand-deep text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Grow your travel business on Rimbers Trip
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">
            List your hotel, apartment, tours or car rental fleet and reach travellers across the region — with a
            professional dashboard for bookings, pricing, payouts and reviews.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/business/signup">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-brand-foreground/40 bg-transparent">
              <Link to="/corporate">Go to my dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6">
        {/* Why list with us */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Building2, title: "List anything travel", body: "Stays, tours, rentals and experiences in one account." },
            { icon: ShieldCheck, title: "Verified businesses only", body: "Documents reviewed before listings go live publicly." },
            { icon: LineChart, title: "Real performance data", body: "Revenue, occupancy, conversion and review analytics." },
          ].map((f) => (
            <div key={f.title} className="surface-card p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Choose business type */}
        <h2 className="mt-14 text-2xl font-bold">Select the type of business you want to list</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick a category to start your registration.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_TYPES.map((t, i) => (
            <div key={t.id} className="surface-card relative flex flex-col p-6">
              {i === 0 ? (
                <span className="absolute -top-3 left-6 rounded bg-success px-2 py-0.5 text-xs font-semibold text-success-foreground">
                  Quick start
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{t.label}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <Button asChild className="mt-5 w-full">
                <Link to="/business/signup" search={{ type: t.id }}>
                  List your business
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="surface-card mt-14 p-6">
          <h2 className="text-xl font-bold">How it works</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              ["1. Business account", "Name, email, phone, country and business type."],
              ["2. Business information", "Legal details, category, license and tax info."],
              ["3. Location", "Address, postal code and map coordinates."],
              ["4. Verification", "Upload documents and get reviewed by our team."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg border p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Already registered */}
        <div className="surface-card mt-14 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-xl font-bold">Already listed with us?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage bookings, pricing, payouts and reviews from your business dashboard.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/corporate">Business dashboard</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
