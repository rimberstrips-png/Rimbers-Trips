import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/use-session";
import type { Business, Profile } from "@/lib/business-types";

export function useBusinessProfile() {
  const { session, user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setBusiness(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setProfile((profileRow as Profile) ?? null);

    if (profileRow?.role === "business") {
      const { data: businessRow } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setBusiness((businessRow as Business) ?? null);
    } else {
      setBusiness(null);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (sessionLoading) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoading, user?.id]);

  return {
    session,
    user,
    profile,
    business,
    loading: sessionLoading || loading,
    refresh,
  };
}
