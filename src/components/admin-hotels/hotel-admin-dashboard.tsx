import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Hotel, HotelInput } from "@/lib/hotel-types";
import { HotelsTable } from "./hotels-table";
import { HotelFormDialog } from "./hotel-form-dialog";
import { DeleteHotelDialog } from "./delete-hotel-dialog";
import { BusinessApprovals } from "./business-approvals";

const HOTELS_KEY = ["admin-hotels"];

async function fetchHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Hotel[];
}

export function HotelAdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<"hotels" | "businesses">("hotels");
  const queryClient = useQueryClient();
  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery({ queryKey: HOTELS_KEY, queryFn: fetchHotels });

  const [formOpen, setFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | undefined>(undefined);
  const [deletingHotel, setDeletingHotel] = useState<Hotel | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: HOTELS_KEY });

  const deleteMutation = useMutation({
    mutationFn: async (hotel: Hotel) => {
      const { error } = await supabase.from("hotels").delete().eq("id", hotel.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Hotel deleted.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setDeletingHotel(null),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ hotel, next }: { hotel: Hotel; next: boolean }) => {
      const { error } = await supabase
        .from("hotels")
        .update({ is_active: next })
        .eq("id", hotel.id);
      if (error) throw error;
    },
    onMutate: async ({ hotel, next }) => {
      await queryClient.cancelQueries({ queryKey: HOTELS_KEY });
      const previous = queryClient.getQueryData<Hotel[]>(HOTELS_KEY);
      queryClient.setQueryData<Hotel[]>(HOTELS_KEY, (old) =>
        old?.map((h) => (h.id === hotel.id ? { ...h, is_active: next } : h)),
      );
      return { previous };
    },
    onError: (e: Error, _vars, context) => {
      toast.error(e.message);
      if (context?.previous) queryClient.setQueryData(HOTELS_KEY, context.previous);
    },
    onSettled: invalidate,
  });

  const moveMutation = useMutation({
    mutationFn: async ({ hotel, direction }: { hotel: Hotel; direction: "up" | "down" }) => {
      const current = hotels ?? [];
      const index = current.findIndex((h) => h.id === hotel.id);
      const neighborIndex = direction === "up" ? index - 1 : index + 1;
      const neighbor = current[neighborIndex];
      if (index === -1 || neighborIndex < 0 || neighborIndex >= current.length || !neighbor) return;
      const [{ error: e1 }, { error: e2 }] = await Promise.all([
        supabase.from("hotels").update({ sort_order: neighbor.sort_order }).eq("id", hotel.id),
        supabase.from("hotels").update({ sort_order: hotel.sort_order }).eq("id", neighbor.id),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: invalidate,
  });

  async function handleFormSubmit(input: HotelInput): Promise<string | void> {
    if (editingHotel) {
      const { error } = await supabase.from("hotels").update(input).eq("id", editingHotel.id);
      if (error) return error.message;
      toast.success("Hotel updated.");
    } else {
      const maxSortOrder = hotels?.reduce((max, h) => Math.max(max, h.sort_order), 0) ?? 0;
      const { error } = await supabase
        .from("hotels")
        .insert({ ...input, sort_order: maxSortOrder + 1 });
      if (error) return error.message;
      toast.success("Hotel created.");
    }
    invalidate();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Toaster position="top-right" />
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#1AB65C] to-[#39E180]" />
            <span className="font-semibold text-neutral-900">Rimbers Trip Admin</span>
          </div>
          <nav className="ml-8 hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={() => setTab("hotels")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "hotels"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Hotels
            </button>
            <button
              type="button"
              onClick={() => setTab("businesses")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === "businesses"
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Business approvals
            </button>
          </nav>
          <button
            type="button"
            onClick={onSignOut}
            className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "businesses" ? (
          <BusinessApprovals />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900">Hotels</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {hotels?.length ?? 0} {hotels?.length === 1 ? "hotel" : "hotels"} total
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingHotel(undefined);
                  setFormOpen(true);
                }}
                className="bg-gradient-to-r from-[#1AB65C] to-[#39E180] text-white hover:opacity-90"
              >
                Add hotel
              </Button>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading hotels…</p>
            ) : error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                Failed to load hotels: {(error as Error).message}
              </p>
            ) : (
              <HotelsTable
                hotels={hotels ?? []}
                onEdit={(hotel) => {
                  setEditingHotel(hotel);
                  setFormOpen(true);
                }}
                onDelete={setDeletingHotel}
                onToggleActive={(hotel, next) => toggleMutation.mutate({ hotel, next })}
                onMove={(hotel, direction) => moveMutation.mutate({ hotel, direction })}
              />
            )}
          </>
        )}
      </main>

      <HotelFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        hotel={editingHotel}
        onSubmit={handleFormSubmit}
      />

      <DeleteHotelDialog
        hotel={deletingHotel}
        onOpenChange={(open) => !open && setDeletingHotel(null)}
        onConfirm={(hotel) => deleteMutation.mutate(hotel)}
      />
    </div>
  );
}
