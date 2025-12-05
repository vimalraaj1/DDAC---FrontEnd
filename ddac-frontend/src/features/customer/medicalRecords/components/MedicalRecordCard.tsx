import {
  Calendar,
  User,
  Building2,
  FileText,
  Pill,
  Download,
  Eye,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { useState } from "react";
import { getConsultationsByPatientId } from "../../../../services/consultationManagementService";

export interface Medication {
  name: string;
  dosage: string;
  instructions: string;
  duration: string;
}

export interface MedicalRecord {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  appointmentId: string;
  feedbackNotes: string;
  prescriptions: Medication[];
}

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export function MedicalRecordCard({ record }: MedicalRecordCardProps) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);




  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "var(--accent-success)";
      case "Pending":
        return "var(--accent-warning)";
      case "Cancelled":
        return "var(--accent-danger)";
      default:
        return "var(--text-muted)";
    }
  };

  return (
    <div
      className="rounded-xl p-6 shadow-sm border border-gray-400"
      style={{
        backgroundColor: "var(--bg-card)",
      }}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Record ID:
            </span>
            <span className="text-sm" style={{ color: "var(--text-heading)" }}>
              {record.id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Appointment ID:
            </span>
            <span className="text-sm" style={{ color: "var(--text-heading)" }}>
              {record.appointmentId}
            </span>
          </div>
        </div>

        <Badge
          className="px-3 py-1 rounded-full text-xs"
          style={{
            backgroundColor: getStatusColor("Completed") + "20",
            color: getStatusColor("Completed"),
            border: "none",
          }}
        >
          Completed
        </Badge>
      </div>

      {/* Appointment Details */}
      <div
        className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--primary-light)" }}
          >
            <Calendar className="w-5 h-5" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Date & Time
            </p>
            <p className="text-sm" style={{ color: "var(--text-heading)" }}>
              {record.appointmentDate} at {record.appointmentTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-sky)" }}
          >
            <User className="w-5 h-5" style={{ color: "var(--accent-teal)" }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Doctor
            </p>
            <p className="text-sm" style={{ color: "var(--text-heading)" }}>
              {record.doctorName}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Notes Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4" style={{ color: "var(--primary)" }} />
          <h3 className="text-sm" style={{ color: "var(--text-heading)" }}>
            Doctor Notes
          </h3>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: "var(--bg-main)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-body)" }}>
            {record.feedbackNotes}
          </p>
        </div>
      </div>

      {/* Prescription Section */}
      {record.prescriptions && record.prescriptions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <h3 className="text-sm" style={{ color: "var(--text-heading)" }}>
              Prescription
            </h3>
          </div>
          <div className="space-y-3">
            {record.prescriptions.map((med, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: "var(--bg-main)",
                  borderLeftColor: "var(--primary)",
                }}
              >
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--text-heading)" }}
                >
                  {med.name} {med.dosage}
                </p>
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--text-body)" }}
                >
                  {med.instructions}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Duration: {med.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
