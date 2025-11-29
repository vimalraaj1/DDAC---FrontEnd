import { AlertTriangle, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Appointment } from "./AppointmentCard";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useEffect, useState } from "react";

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onConfirmCancel: (appointmentId: string, cancellationReason: string) => void;
}

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onConfirmCancel,
}: CancelAppointmentDialogProps) {
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [isDisableButton, setIsDisableButton] = useState<boolean>(false);

  useEffect(() => {
    const isEmpty =
      cancellationReason === null || cancellationReason.trim() === "";

    setIsDisableButton(isEmpty);
  }, [cancellationReason]);

  if (!appointment) return null;

  const handleConfirm = () => {
    onConfirmCancel(appointment.id, cancellationReason);
    setCancellationReason("");
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
              <strong>Note:</strong> Please cancel at least 24 hours in advance
              to avoid cancellation fees. You will receive a confirmation email
              once the cancellation is processed.
            </p>
          </div>
          <div className="space-y-4 mt-2">
            <Label
              htmlFor="reason"
              className="text-[#1A1A1A] flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-[#4EA5D9]" />
              Reason for Cancellation
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe the reason for your visit..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="border-gray focus:ring-[#4EA5D9] rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-3 mt-2">
          <AlertDialogCancel className="border-[#DCEFFB] text-[#7A7A7A] hover:bg-[#F5F7FA] rounded-xl cursor-pointer">
            Keep Appointment
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDisableButton}
            onClick={handleConfirm}
            className="bg-[#E74C3C] hover:bg-[#d43f2f] text-white rounded-xl cursor-pointer"
          >
            Yes, Cancel Appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
