import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Hotel } from "@/lib/hotel-types";

export function DeleteHotelDialog({
  hotel,
  onOpenChange,
  onConfirm,
}: {
  hotel: Hotel | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (hotel: Hotel) => void;
}) {
  return (
    <AlertDialog open={hotel !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {hotel?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the hotel from the database. This can&apos;t be undone —
            consider toggling it inactive instead if you just want to hide it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => hotel && onConfirm(hotel)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
