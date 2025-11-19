import { useState } from "react";
import { Calendar, Clock, User, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

interface AppointmentBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAppointment: (appointmentData: AppointmentFormData) => void;
}

export interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}

const doctors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
  { id: "2", name: "Dr. Michael Chen", specialty: "General Practitioner" },
  { id: "3", name: "Dr. Emily Williams", specialty: "Dermatologist" },
  { id: "4", name: "Dr. Robert Martinez", specialty: "Orthopedic Surgeon" },
  { id: "5", name: "Dr. James Thompson", specialty: "Neurologist" },
  { id: "6", name: "Dr. Lisa Anderson", specialty: "Pediatrician" },
];

const availableDates = [
  "Monday, November 25, 2025",
  "Tuesday, November 26, 2025",
  "Wednesday, November 27, 2025",
  "Thursday, November 28, 2025",
  "Friday, November 29, 2025",
  "Monday, December 2, 2025",
  "Tuesday, December 3, 2025",
];

const availableTimes = [
  "9:00 AM - 9:30 AM",
  "10:00 AM - 10:30 AM",
  "11:00 AM - 11:30 AM",
  "1:00 PM - 1:30 PM",
  "2:00 PM - 2:30 PM",
  "3:00 PM - 3:30 PM",
  "4:00 PM - 4:30 PM",
];

export function AppointmentBookingModal({
  open,
  onOpenChange,
  onBookAppointment,
}: AppointmentBookingModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleSubmit = () => {
    if (formData.doctorId && formData.date && formData.time) {
      onBookAppointment(formData);
      // Reset form
      setFormData({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white border-[#DCEFFB] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#1A1A1A]">
            Book New Appointment
          </DialogTitle>
          <DialogDescription className="text-[#7A7A7A]">
            Schedule a visit with one of our healthcare professionals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor" className="text-[#1A1A1A] flex items-center gap-2">
              <User className="h-4 w-4 text-[#4EA5D9]" />
              Select Doctor
            </Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) =>
                setFormData({ ...formData, doctorId: value })
              }
            >
              <SelectTrigger
                id="doctor"
                className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
              >
                <SelectValue placeholder="Choose a doctor..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id} className="hover:bg-[#F5F7FA] cursor-pointer">
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-[#1A1A1A] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4EA5D9]" />
              Appointment Date
            </Label>
            <Select
              value={formData.date}
              onValueChange={(value) =>
                setFormData({ ...formData, date: value })
              }
            >
              <SelectTrigger
                id="date"
                className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
              >
                <SelectValue placeholder="Select a date..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date} className="hover:bg-[#F5F7FA] cursor-pointer">
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-[#1A1A1A] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#4EA5D9]" />
              Appointment Time
            </Label>
            <Select
              value={formData.time}
              onValueChange={(value) =>
                setFormData({ ...formData, time: value })
              }
            >
              <SelectTrigger
                id="time"
                className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
              >
                <SelectValue placeholder="Select a time..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time} className="hover:bg-[#F5F7FA] cursor-pointer">
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-[#1A1A1A] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#4EA5D9]" />
              Reason for Visit (Optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe the reason for your visit..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#DCEFFB] text-[#7A7A7A] hover:bg-[#F5F7FA] rounded-xl cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.doctorId || !formData.date || !formData.time}
            className="bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
