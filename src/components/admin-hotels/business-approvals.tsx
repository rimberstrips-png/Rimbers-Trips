import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import type { Business, BusinessStatus } from "@/lib/business-types";

const BUSINESSES_KEY = ["admin-businesses"];

async function fetchBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Business[];
}

function statusVariant(status: BusinessStatus): "default" | "secondary" | "destructive" {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "secondary";
}

export function BusinessApprovals() {
  const queryClient = useQueryClient();
  const {
    data: businesses,
    isLoading,
    error,
  } = useQuery({ queryKey: BUSINESSES_KEY, queryFn: fetchBusinesses });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: BUSINESSES_KEY });

  const reviewMutation = useMutation({
    mutationFn: async ({ business, status }: { business: Business; status: BusinessStatus }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("businesses")
        .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user?.id })
        .eq("id", business.id);
      if (error) throw error;
    },
    onSuccess: (_data, { status }) => {
      toast.success(status === "approved" ? "Business approved." : "Business rejected.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pendingCount = businesses?.filter((b) => b.status === "pending").length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Business approvals</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {pendingCount} pending · {businesses?.length ?? 0} total registrations
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading businesses…</p>
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load businesses: {(error as Error).message}
        </p>
      ) : !businesses || businesses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
          <p className="text-sm text-muted-foreground">No business registrations yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead>Business</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-medium text-neutral-900">{b.business_name}</p>
                      {b.legal_name ? (
                        <p className="text-xs text-muted-foreground">{b.legal_name}</p>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {b.category || b.business_type || "—"}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {[b.city, b.country].filter(Boolean).join(", ") || "—"}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      <div className="flex flex-col">
                        {b.business_email ? <span>{b.business_email}</span> : null}
                        {b.phone ? (
                          <span className="text-xs text-muted-foreground">{b.phone}</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(b.status)} className="capitalize">
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {b.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              reviewMutation.mutate({ business: b, status: "approved" })
                            }
                            className="rounded-lg bg-success px-2.5 py-1.5 text-xs font-semibold text-success-foreground hover:opacity-90"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              reviewMutation.mutate({ business: b, status: "rejected" })
                            }
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-muted-foreground">
                          {b.reviewed_at ? new Date(b.reviewed_at).toLocaleDateString() : "—"}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
