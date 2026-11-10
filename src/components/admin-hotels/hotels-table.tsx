import { Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Hotel } from "@/lib/hotel-types";

export function HotelsTable({
  hotels,
  onEdit,
  onDelete,
  onToggleActive,
  onMove,
}: {
  hotels: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
  onToggleActive: (hotel: Hotel, next: boolean) => void;
  onMove: (hotel: Hotel, direction: "up" | "down") => void;
}) {
  if (hotels.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
        <p className="text-sm text-muted-foreground">No hotels yet. Add your first one above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel, index) => (
              <TableRow key={hotel.id} className={hotel.is_active ? "" : "opacity-50"}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMove(hotel, "up")}
                      aria-label="Move up"
                      className="rounded px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === hotels.length - 1}
                      onClick={() => onMove(hotel, "down")}
                      aria-label="Move down"
                      className="rounded px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="font-medium text-neutral-900">{hotel.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-neutral-600">{hotel.location}</TableCell>
                <TableCell className="font-medium text-neutral-900">
                  ${hotel.price.toLocaleString()}
                  <span className="font-normal text-neutral-400">/night</span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-sm text-neutral-700">
                    <span className="text-amber-500">★</span>
                    {hotel.rating.toFixed(1)}
                    <span className="text-neutral-400">({hotel.review_count})</span>
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={hotel.is_active}
                    onCheckedChange={(checked) => onToggleActive(hotel, checked)}
                    className="data-[state=checked]:bg-[#1AB65C]"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(hotel)}
                      aria-label="Edit"
                      className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(hotel)}
                      aria-label="Delete"
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
