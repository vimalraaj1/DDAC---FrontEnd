import { Calendar, Clock, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";

interface Medication {
  name: string;
  dosage: string;
  duration: string;
  refills: number;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorInitials: string;
  doctorEmail: string;
  doctorPhone: string;
  date: string;
  time: string;
  purpose: string;
  location: string;
  status: "Approved" | "Pending" | "Cancelled";
  prescriptions: Medication[];
  cancellationReason: string | null;
}

interface AppointmentCardProps {
  appointment: Appointment;
  type: "upcoming" | "past" | "cancelled";
  onViewDetails: (id: string) => void;
  onCancel: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  type,
  onViewDetails,
  onCancel,
}: AppointmentCardProps) {
  const statusStyles = {
    Approved: "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20",
    Pending: "bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/20",
    Cancelled: "bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/20",
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-400 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#E8F6FD] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#4EA5D9]">{appointment.doctorInitials}</span>
          </div>

          <div>
            <h3 className="text-[#1A1A1A] mb-1">{appointment.doctorName}</h3>
            <p className="text-[#7A7A7A] text-sm">
              {appointment.doctorSpecialty}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`${statusStyles[appointment.status]} border`}
        >
          {appointment.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-[#3D3D3D]">
          <Calendar className="h-4 w-4 text-[#4EA5D9]" />
          <span className="text-sm">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-3 text-[#3D3D3D]">
          <Clock className="h-4 w-4 text-[#4EA5D9]" />
          <span className="text-sm">{appointment.time}</span>
        </div>
      </div>

      <Separator className="mb-4 bg-[#DCEFFB]" />

      {type === "upcoming" ? (
        <div className="flex gap-3">
          <Button
            onClick={() => onViewDetails(appointment.id)}
            className="flex-1 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl cursor-pointer"
          >
            View Details
          </Button>
          <Button
            onClick={() => onCancel(appointment.id)}
            variant="outline"
            className="flex-1 border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C]/5 rounded-xl cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      ) : type === "past"?  (
        <div className="flex gap-3">
          <Button
               onClick={() => navigate("/medicalRecords")}
            className="flex-1 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl cursor-pointer"
          >
            View Prescription
          </Button>
        </div>
      ): (
        <div className="flex gap-3">
          <Button
            onClick={() => onViewDetails(appointment.id)}
            className="flex-1 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl cursor-pointer"
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  );
}
