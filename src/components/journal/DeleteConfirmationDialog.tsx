
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

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityType: string | null;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  activityType,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#193175] text-white border border-[#3056b7]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            This will delete all your {activityType} journal entries. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#1A1F2C] text-white border border-[#3056b7] hover:bg-[#1A1F2C]/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 text-white hover:bg-red-600" 
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
