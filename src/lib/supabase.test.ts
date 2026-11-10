import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSupabaseModule() {
  vi.resetModules();
  return import("@/lib/supabase");
}

describe("supabase client bootstrap", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports configured and builds a client when both env vars are set", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-anon-key");

    const { isSupabaseConfigured, supabase } = await loadSupabaseModule();

    expect(isSupabaseConfigured).toBe(true);
    expect(supabase).toBeDefined();
  });

  it("does not throw and falls back to a placeholder client when env vars are missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    const { isSupabaseConfigured, supabase } = await loadSupabaseModule();

    expect(isSupabaseConfigured).toBe(false);
    expect(supabase).toBeDefined();
  });

  it("reports unconfigured when only the URL is set", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    const { isSupabaseConfigured } = await loadSupabaseModule();

    expect(isSupabaseConfigured).toBe(false);
  });

  it("reports unconfigured when only the anon key is set", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-anon-key");

    const { isSupabaseConfigured } = await loadSupabaseModule();

    expect(isSupabaseConfigured).toBe(false);
  });
});
