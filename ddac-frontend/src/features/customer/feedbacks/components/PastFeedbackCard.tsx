import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { StarRating } from "./StarRating";
import { Button } from "../../components/ui/button";
import { Calendar, Stethoscope } from "lucide-react";
import { convertDateTime } from "../../../../utils/TimeConversion";

interface PastFeedbackCardProps {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  commentTime: string;
  overallRating: number | null;
  staffRating: number | null;
  doctorRating: number | null;
  feedback: string | null;
  onViewMore: () => void;
  onGiveFeedback: () => void;
}

export function PastFeedbackCard({
  doctorName,
  doctorSpecialty,
  appointmentDate,
  appointmentTime,
  patientName,
  commentTime,
  overallRating,
  staffRating,
  doctorRating,
  feedback,
  onViewMore,
  onGiveFeedback,
}: PastFeedbackCardProps) {
  const initials =
    patientName === "Anonymous"
      ? "A"
      : patientName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);


  return (
    <div
      className="p-4 rounded-xl border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback
            style={{ backgroundColor: "var(--accent-teal)", color: "white" }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p style={{ color: "var(--text-heading)" }}>{patientName}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {convertDateTime(commentTime)}
            </p>
          </div>

          <div className="space-y-3 mt-2 mb-2">
            <div className="flex items-center gap-3 text-[#3D3D3D]">
              <Stethoscope className="h-4 w-4 text-[#4EA5D9]" />
              <span className="text-sm text-muted">
                {doctorName} ({doctorSpecialty})
              </span>
            </div>
          </div>
          <div className="space-y-3 mt-2 mb-2">
            <div className="flex items-center gap-3 text-[#3D3D3D]">
              <Calendar className="h-4 w-4 text-[#4EA5D9]" />
              <span className="text-sm text-muted">
                {appointmentDate} • {appointmentTime}
              </span>
            </div>
          </div>

          <div className="mb-2 flex flex-row gap-2">
            <p className="text-sm text-gray-400 w-25">Overall Rating: </p>
            <StarRating rating={overallRating ?? 0} interactive={false} size="sm" />
          </div>
          <div className="mb-2 flex flex-row gap-2">
            <p className="text-sm text-gray-400 w-25">Doctor Rating: </p>
            <StarRating rating={doctorRating ?? 0} interactive={false} size="sm" />
          </div>
          <div className="mb-2 flex flex-row gap-2">
            <p className="text-sm text-gray-400 w-25">Staff Rating: </p>
            <StarRating rating={staffRating ?? 0} interactive={false} size="sm" />
          </div>

          <p
            className="text-sm mb-3 line-clamp-2"
            style={{ color: "var(--text-body)" }}
          >
            {feedback}
          </p>

          {overallRating === null ? (

            <Button
              onClick={onGiveFeedback}
              className="px-4 py-2 rounded-xl h-auto cursor-pointer bg-[#4EA5D9] text-white hover:opacity-[50%]"
            >
              Give Feedback
            </Button>
          ) : (
            <Button
              variant="link"
              onClick={onViewMore}
              className="p-0 h-auto cursor-pointer"
              style={{ color: "var(--btn-secondary-text)" }}
            >
              View More →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
