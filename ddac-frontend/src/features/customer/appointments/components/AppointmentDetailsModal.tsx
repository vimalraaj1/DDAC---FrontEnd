import {
  Calendar,
  Clock,
  MapPin,
  User,
  Stethoscope,
  FileText,
  Phone,
  Mail,
  Pill,
  Ban,
  Users,
  ClipboardPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Appointment } from "./AppointmentCard";

interface AppointmentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export function AppointmentDetailsModal({
  open,
  onOpenChange,
  appointment,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const statusStyles = {
    Approved: "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20",
    Rejected: "bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/20",
    Scheduled: "bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/20",
    Cancelled: "bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/20",
    Completed: "bg-[#3498DB]/10 text-[#3498DB] border-[#3498DB]/20",
    "No Show": "bg-[#95A5A6]/10 text-[#95A5A6] border-[#95A5A6]/20",
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]  max-h-[650px] bg-white border-[#DCEFFB] rounded-2xl h-[90%] overflow-auto ">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-[#1A1A1A] mb-2">
                Appointment Details
              </DialogTitle>
              <DialogDescription className="text-[#7A7A7A]">
                Complete information about your scheduled visit
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className={`${statusStyles[appointment.status]} border`}
            >
              {appointment.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 pb-4">
          {/* Doctor Information */}
          <div className="bg-[#dcf0fc] rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#E8F6FD] border border-[#4EA5D9] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#4EA5D9]">
                  {appointment.doctorInitials}
                </span>
              </div>
              <div>
                <h3 className="text-[#1A1A1A] mb-1">
                  {appointment.doctorName}
                </h3>
                <p className="text-[#7A7A7A]">{appointment.doctorSpecialty}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#3D3D3D]">
                <Phone className="h-4 w-4 text-[#4EA5D9]" />
                <span>{appointment.doctorPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#3D3D3D]">
                <Mail className="h-4 w-4 text-[#4EA5D9]" />
                <span>{appointment.doctorEmail}</span>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="space-y-4">
            <div className="space-y-3 pl-7">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-[#4EA5D9] mt-1" />
                <div>
                  <p className="text-[#7A7A7A] text-sm">Date</p>
                  <p className="text-[#1A1A1A]">{appointment.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#4EA5D9] mt-1" />
                <div>
                  <p className="text-[#7A7A7A] text-sm">Time</p>
                  <p className="text-[#1A1A1A]">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {appointment.status != "Cancelled" ? (
              <div>
                {/* Purpose of Visit */}
                <div>
                  <h4 className="text-[#1A1A1A] flex items-center gap-2">
                    <ClipboardPlus className="h-5 w-5 text-[#4EA5D9]" />
                    Reason to Visit
                  </h4>

                  <div className="bg-[#F5F7FA] rounded-xl p-4 pl-7 mt-3">
                    <p className="text-[#3D3D3D] text-sm">
                      {appointment.purpose}
                    </p>
                  </div>
                </div>
                {/* Additional Notes */}
                <div>
                  <h4 className="text-[#1A1A1A] flex items-center gap-2 mt-5">
                    <FileText className="h-5 w-5 text-[#4EA5D9]" />
                    Additional Information
                  </h4>

                  <div className="bg-[#F5F7FA] rounded-xl p-4 pl-7 mt-3">
                    <p className="text-[#3D3D3D] text-sm">
                      Please arrive 15 minutes early to complete any necessary
                      paperwork. Bring your insurance card and a valid photo ID.
                      If you need to cancel or reschedule, please do so at least
                      24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-[#1A1A1A] flex items-center gap-2">
                  <Ban className="h-5 w-5 text-[#E74C3C]" />
                  Cancellation Reason
                </h4>

                <div className="mt-4 bg-[#FEF3F2] border border-[#E74C3C]/20 rounded-xl p-4">
                  <p className="text-[#E74C3C] text-sm">
                    {appointment.cancellationReason}{" "}
                  </p>
                </div>
              </div>
            )}

            {/* Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                className="cursor-pointer flex-1 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
