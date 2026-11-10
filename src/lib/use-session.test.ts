import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useSession } from "@/lib/use-session";

const getSession = vi.fn();
const onAuthStateChange = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSession(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChange(...args),
    },
  },
}));

describe("useSession", () => {
  beforeEach(() => {
    getSession.mockReset();
    onAuthStateChange.mockReset();
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it("starts in a loading state with no user", () => {
    getSession.mockReturnValue(new Promise(() => {})); // never resolves within this test

    const { result } = renderHook(() => useSession());

    expect(result.current.loading).toBe(true);
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("resolves to the current session once getSession settles", async () => {
    const session = { user: { id: "user-1" } };
    getSession.mockResolvedValue({ data: { session } });

    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.session).toEqual(session);
    expect(result.current.user).toEqual(session.user);
  });

  it("resolves to a signed-out state when there is no session, without hanging", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("updates state when the auth-state-change listener fires", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    let capturedCallback: ((event: string, session: unknown) => void) | undefined;
    onAuthStateChange.mockImplementation((cb: (event: string, session: unknown) => void) => {
      capturedCallback = cb;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const newSession = { user: { id: "user-2" } };
    act(() => {
      capturedCallback?.("SIGNED_IN", newSession);
    });

    await waitFor(() => expect(result.current.session).toEqual(newSession));
    expect(result.current.user).toEqual(newSession.user);
  });

  it("unsubscribes from the auth listener on unmount", async () => {
    const unsubscribe = vi.fn();
    getSession.mockResolvedValue({ data: { session: null } });
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe } } });

    const { result, unmount } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
