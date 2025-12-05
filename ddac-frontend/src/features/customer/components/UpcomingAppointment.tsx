import { Calendar, ClipboardPlus, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Appointment } from "../appointments/components/AppointmentCard";
export function UpcomingAppointment({
  appointment,
}: {
  appointment: Appointment | null;
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <h2 className="text-[#1A1A1A]">Your Next Appointment</h2>

      <div className="space-y-4 flex flex-col h-full">
        {appointment ? (
          <>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#E8F6FD] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#4EA5D9]">
                  {appointment.doctorInitials}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-[#1A1A1A] mb-1">{appointment.doctorName}</p>
                <p className="text-[#7A7A7A]">{appointment.doctorSpecialty}</p>
              </div>

              <span className="px-3 py-1 bg-[#E8F6FD] text-[#4EA5D9] rounded-full">
                {appointment.status}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E6F3FB]">
              <div className="flex items-center gap-3 text-[#3D3D3D]">
                <Calendar className="w-5 h-5 text-[#4EA5D9]" />
                <span>{appointment.date}</span>
              </div>

              <div className="flex items-center gap-3 text-[#3D3D3D]">
                <Clock className="w-5 h-5 text-[#4EA5D9]" />
                <span>{appointment.time}</span>
              </div>
              <div>
                <div className="bg-[#F5F7FA] rounded-xl p-4 pl-5 mt-3 flex gap-2">
                  <p className="text-[#3D3D3D] text-sm">
                    {appointment.purpose}
                  </p>
                </div>
              </div>
             
            </div>

            <div className="">
              <button
                className="cursor-pointer w-full mt-0 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white py-3 px-6 rounded-xl transition-colors"
                onClick={() => navigate("/appointments")}
              >
                View Details
              </button>
            </div>
          </>
        ) : (
          <p className="text-[#7A7A7A]">No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
}
