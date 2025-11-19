import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Appointment } from "../appointments/components/AppointmentCard";

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLogout: () => void;
}

export function LogOutDialog({
  open,
  onOpenChange,
  onConfirmLogout,
}: CancelAppointmentDialogProps) {

  const handleConfirm = () => {
    onOpenChange(false);
    onConfirmLogout();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-[#DCEFFB] rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-[#E74C3C]/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-[#E74C3C]" />
            </div>
            <AlertDialogTitle className="text-[#1A1A1A]">
              Logout Confirmation
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-[#3D3D3D]">
            Are you sure you want to logout from your account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3 mt-4">
          <AlertDialogCancel className="border-[#DCEFFB] text-[#7A7A7A] hover:bg-[#F5F7FA] rounded-xl cursor-pointer">
           Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-[#E74C3C] hover:bg-[#d43f2f] text-white rounded-xl cursor-pointer"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
