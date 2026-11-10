import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "@/components/admin-hotels/login-form";
import { HotelAdminDashboard } from "@/components/admin-hotels/hotel-admin-dashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Rimbers Trip Admin — Manage hotels" },
      { name: "description", content: "Admin panel for managing hotels shown on Rimbers Trip." },
    ],
  }),
  component: AdminPage,
  ssr: false,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-[#1AB65C]" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm onSignedIn={() => {}} />;
  }

  return <HotelAdminDashboard onSignOut={() => supabase.auth.signOut()} />;
}
