import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, StatCard, StatusBadge } from "@/components/corp/corp-shell";
import { Button } from "@/components/ui/button";
import { bookings, business, kpis, revenueSeries, reviews } from "@/lib/rimbers-data";

export const Route = createFileRoute("/corporate/")({
  head: () => ({
    meta: [
      { title: "Business Dashboard — Rimbers Trip Business" },
      {
        name: "description",
        content: "Bookings, revenue, check-ins, payouts and property performance for your Rimbers Trip business.",
      },
      { property: "og:title", content: "Business Dashboard — Rimbers Trip Business" },
      { property: "og:description", content: "Track bookings, revenue and property performance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <PageHeader
        title={`Welcome back, ${business.displayName}`}
        subtitle="Here's how your properties are performing today."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/corporate/calendar">Manage availability</Link>
            </Button>
            <Button asChild>
              <Link to="/business/listing-setup">Add property</Link>
            </Button>
          </div>
        }
      />

      {business.verification !== "Verified" ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <StatusBadge status={business.verification} />
          <span>Your documents are being reviewed. Listings stay unpublished until verification completes.</span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Revenue (PKR millions)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-lg font-semibold">Latest reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {business.rating} average from {business.reviews} reviews
          </p>
          <div className="mt-4 space-y-4">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.guest}</span>
                  <span className="text-muted-foreground">{r.rating.toFixed(1)} ★</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/corporate/reviews">Manage reviews</Link>
          </Button>
        </div>
      </div>

      <div className="surface-card mt-6 overflow-x-auto">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold">Today &amp; upcoming</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/corporate/bookings">All bookings</Link>
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead className="border-y bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Booking</th>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Room</th>
              <th className="px-5 py-3">Check-in</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .filter((b) => b.status === "Upcoming" || b.status === "Current stay")
              .map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="px-5 py-3 font-medium">{b.id}</td>
                  <td className="px-5 py-3">{b.guest}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.room}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.checkIn}</td>
                  <td className="px-5 py-3">{b.amount}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
