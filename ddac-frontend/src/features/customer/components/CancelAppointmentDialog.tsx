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
import { Appointment } from "./AppointmentCard";

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onConfirmCancel: (appointmentId: string) => void;
}

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onConfirmCancel,
}: CancelAppointmentDialogProps) {
  if (!appointment) return null;

  const handleConfirm = () => {
    onConfirmCancel(appointment.id);
    onOpenChange(false);
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
              Cancel Appointment
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-[#3D3D3D]">
            Are you sure you want to cancel your appointment with{" "}
            <span className="text-[#1A1A1A]">{appointment.doctorName}</span> on{" "}
            <span className="text-[#1A1A1A]">{appointment.date}</span> at{" "}
            <span className="text-[#1A1A1A]">{appointment.time}</span>?
          </AlertDialogDescription>
          <div className="mt-4 bg-[#FEF3F2] border border-[#E74C3C]/20 rounded-xl p-4">
            <p className="text-[#E74C3C] text-sm">
              <strong>Note:</strong> Please cancel at least 24 hours in advance to avoid 
              cancellation fees. You will receive a confirmation email once the cancellation 
              is processed.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3 mt-4">
          <AlertDialogCancel className="border-[#DCEFFB] text-[#7A7A7A] hover:bg-[#F5F7FA] rounded-xl cursor-pointer">
            Keep Appointment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-[#E74C3C] hover:bg-[#d43f2f] text-white rounded-xl curosr-pointer"
          >
            Yes, Cancel Appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
