import { Calendar, Clock, MapPin } from "lucide-react";

export function UpcomingAppointment() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <h2 className="text-[#1A1A1A]">Your Next Appointment</h2>
      
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#E8F6FD] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#4EA5D9]">ST</span>
          </div>
          <div className="flex-1">
            <p className="text-[#1A1A1A] mb-1">Dr. Sarah Tan</p>
            <p className="text-[#7A7A7A]">Cardiologist</p>
          </div>
          <span className="px-3 py-1 bg-[#E8F6FD] text-[#4EA5D9] rounded-full">
            Confirmed
          </span>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#E6F3FB]">
          <div className="flex items-center gap-3 text-[#3D3D3D]">
            <Calendar className="w-5 h-5 text-[#4EA5D9]" />
            <span>Tuesday, 14 Nov 2025</span>
          </div>
          <div className="flex items-center gap-3 text-[#3D3D3D]">
            <Clock className="w-5 h-5 text-[#4EA5D9]" />
            <span>10:30 AM</span>
          </div>
          <div className="flex items-center gap-3 text-[#3D3D3D]">
            <MapPin className="w-5 h-5 text-[#4EA5D9]" />
            <span>Building A, Room 304</span>
          </div>
        </div>

        <button className="cursor-pointer w-full mt-auto mb-12 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white py-3 px-6 rounded-xl transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
