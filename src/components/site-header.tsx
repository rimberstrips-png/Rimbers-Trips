import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/use-session";

function AccountControl() {
  const { user, loading } = useSession();

  if (loading) return <div className="h-8 w-20" />;

  if (!user) {
    return (
      <a
        href="/sign-in"
        className="text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
      >
        Sign in
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden opacity-80 sm:inline">{user.email}</span>
      <button
        type="button"
        onClick={() => supabase.auth.signOut().then(() => window.location.assign("/"))}
        className="font-medium opacity-80 transition-opacity hover:opacity-100"
      >
        Sign out
      </button>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-brand-deep text-brand-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <Compass className="h-5 w-5" />
          Rimbers Trip
        </Link>
        <nav className="ml-auto hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="opacity-80 transition-opacity hover:opacity-100">
            Stays
          </Link>
          <Link to="/" className="opacity-80 transition-opacity hover:opacity-100">
            Experiences
          </Link>
          <Link to="/admin" className="opacity-80 transition-opacity hover:opacity-100">
            Admin
          </Link>
          <Link to="/business" className="opacity-80 transition-opacity hover:opacity-100">
            For Businesses
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <AccountControl />
          <Button asChild variant="secondary" size="sm">
            <Link to="/business/signup">List Your Business</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <span className="font-display font-semibold text-foreground">Rimbers Trip</span>
        <p>Discover and book travel. List and manage your business. One marketplace.</p>
      </div>
    </footer>
  );
}
