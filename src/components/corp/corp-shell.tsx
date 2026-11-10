import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Compass,
  CreditCard,
  LayoutDashboard,
  Settings,
  Star,
  Tags,
  Ticket,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { business } from "@/lib/rimbers-data";

const NAV = [
  { to: "/corporate", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/corporate/properties", label: "Properties", icon: Building2 },
  { to: "/corporate/bookings", label: "Bookings", icon: Ticket },
  { to: "/corporate/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/corporate/pricing", label: "Pricing", icon: Tags },
  { to: "/corporate/reviews", label: "Reviews", icon: Star },
  { to: "/corporate/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/corporate/payments", label: "Payments", icon: CreditCard },
  { to: "/corporate/profile", label: "Business Profile", icon: UserRound },
  { to: "/corporate/settings", label: "Settings", icon: Settings },
] as const;

export function CorpShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2 px-5 py-5 font-display text-base font-bold">
          <Compass className="h-5 w-5" />
          Rimbers <span className="opacity-60">Business</span>
        </Link>
        <div className="mx-3 mb-4 rounded-lg bg-sidebar-accent px-3 py-3">
          <p className="truncate text-sm font-semibold">{business.displayName}</p>
          <p className="mt-1 text-xs opacity-70">
            {business.type} · {business.city}
          </p>
          <Badge variant="secondary" className="mt-2 text-[10px]">
            {business.verification}
          </Badge>
        </div>
        <nav className="flex-1 space-y-1 px-3 pb-6">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-1 overflow-x-auto border-b bg-card px-3 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              activeOptions={{ exact: item.exact ?? false }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Published: "bg-success/12 text-success border-success/30",
    Verified: "bg-success/12 text-success border-success/30",
    Paid: "bg-success/12 text-success border-success/30",
    Cleared: "bg-success/12 text-success border-success/30",
    Completed: "bg-muted text-muted-foreground border-border",
    "Current stay": "bg-primary/12 text-primary border-primary/30",
    Upcoming: "bg-primary/12 text-primary border-primary/30",
    Open: "bg-success/12 text-success border-success/30",
    Limited: "bg-warning/20 text-warning-foreground border-warning/40",
    "Pending Review": "bg-warning/20 text-warning-foreground border-warning/40",
    "Under Review": "bg-warning/20 text-warning-foreground border-warning/40",
    Pending: "bg-warning/20 text-warning-foreground border-warning/40",
    Draft: "bg-muted text-muted-foreground border-border",
    Closed: "bg-muted text-muted-foreground border-border",
    Suspended: "bg-destructive/12 text-destructive border-destructive/30",
    Rejected: "bg-destructive/12 text-destructive border-destructive/30",
    Cancelled: "bg-destructive/12 text-destructive border-destructive/30",
    Refunded: "bg-destructive/12 text-destructive border-destructive/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        map[status] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  trend = "flat",
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
}) {
  const color =
    trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="surface-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {delta ? <p className={`mt-1 text-xs ${color}`}>{delta}</p> : null}
    </div>
  );
}
