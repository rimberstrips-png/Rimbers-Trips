import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useBusinessProfile } from "@/lib/use-business-profile";

const getSession = vi.fn();
const onAuthStateChange = vi.fn();
const from = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSession(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChange(...args),
    },
    from: (...args: unknown[]) => from(...args),
  },
}));

function chainableQuery(result: { data: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
  };
  return builder;
}

const testUser = { id: "user-1" };
const testSession = { user: testUser };

describe("useBusinessProfile", () => {
  beforeEach(() => {
    getSession.mockReset();
    onAuthStateChange.mockReset();
    from.mockReset();
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it("clears profile/business and stops loading when signed out, without querying the database", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    const { result } = renderHook(() => useBusinessProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toBeNull();
    expect(result.current.business).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it("loads a customer profile and skips the business lookup", async () => {
    getSession.mockResolvedValue({ data: { session: testSession } });
    const profileRow = { user_id: testUser.id, role: "customer", created_at: "2026-01-01" };
    from.mockImplementation((table: string) => {
      if (table === "profiles") return chainableQuery({ data: profileRow });
      throw new Error(`unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useBusinessProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toEqual(profileRow);
    expect(result.current.business).toBeNull();
    expect(from).toHaveBeenCalledWith("profiles");
    expect(from).not.toHaveBeenCalledWith("businesses");
  });

  it("loads the owner's business row when the profile role is business", async () => {
    getSession.mockResolvedValue({ data: { session: testSession } });
    const profileRow = { user_id: testUser.id, role: "business", created_at: "2026-01-01" };
    const businessRow = { id: 1, owner_id: testUser.id, status: "pending" };
    from.mockImplementation((table: string) => {
      if (table === "profiles") return chainableQuery({ data: profileRow });
      if (table === "businesses") return chainableQuery({ data: businessRow });
      throw new Error(`unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useBusinessProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toEqual(profileRow);
    expect(result.current.business).toEqual(businessRow);
  });

  it("resolves to a null profile without throwing when no profile row exists yet", async () => {
    getSession.mockResolvedValue({ data: { session: testSession } });
    from.mockImplementation((table: string) => {
      if (table === "profiles") return chainableQuery({ data: null });
      throw new Error(`unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useBusinessProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.profile).toBeNull();
    expect(result.current.business).toBeNull();
  });

  it("re-fetches when refresh() is called", async () => {
    getSession.mockResolvedValue({ data: { session: testSession } });
    const profileRow = { user_id: testUser.id, role: "customer", created_at: "2026-01-01" };
    from.mockImplementation((table: string) => {
      if (table === "profiles") return chainableQuery({ data: profileRow });
      throw new Error(`unexpected table: ${table}`);
    });

    const { result } = renderHook(() => useBusinessProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const callsBeforeRefresh = from.mock.calls.length;
    await result.current.refresh();

    expect(from.mock.calls.length).toBeGreaterThan(callsBeforeRefresh);
  });
});
