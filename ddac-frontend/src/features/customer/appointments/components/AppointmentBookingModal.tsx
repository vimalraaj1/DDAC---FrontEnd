import { useEffect, useState } from "react";
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
import { getDoctors } from "../../../../services/doctorManagementService";
import { toast } from "sonner";
import { getAvailabilitiesByDoctorId } from "../../../../services/availabilityManagementService";
import {
  formatDate,
  reverseFormatDate,
} from "../../../../../../utils/DateConversion";

interface AppointmentBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAppointment: (appointmentData: AppointmentFormData) => void;
}

export interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  purpose: string;
}

interface DoctorDropdown {
  id: string;
  name: string;
  specialty: string;
}

interface DoctorAvailability {
  date: string;
  time: string;
  isBooked: boolean;
}

export function AppointmentBookingModal({
  open,
  onOpenChange,
  onBookAppointment,
}: AppointmentBookingModalProps) {
  const [doctorAvailability, setDoctorAvailability] = useState<
    DoctorAvailability[]
  >([]);
  const [doctorDropdown, setDoctorDropdown] = useState<DoctorDropdown[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: "",
    date: "",
    time: "",
    purpose: "",
  });
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isLoadingTimeSlot, setIsLoadingTimeSlot] = useState(false);

  useEffect(() => {
    fetchDoctorDataDB();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchDoctorDataDB = async () => {
    try {
      const datas = await getDoctors();

      const formattedDoctors = datas.map((data: any) => ({
        id: data.id,
        name: data.firstName + " " + data.lastName,
        specialty: data.specialization,
      }));

      setDoctorDropdown(formattedDoctors); // single state update
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    }
  };

  // Retrieve for date and time when patient choose doctor
  const retrieveDoctorAppointment = async (doctorId: string) => {
    setFormData((prev) => ({
      ...prev,
      doctorId: doctorId,
      date: "",
      time: "",
    }));

    setAvailableDates([]); // reset the date list
    setAvailableTimes([]); // reset the time list

    setIsLoadingAvailability(true);

    try {
      const datas: DoctorAvailability[] = await getAvailabilitiesByDoctorId(
        doctorId
      );

      const filteredAvailability = datas.filter((slot) => {
        const slotDate = new Date(slot.date);
        slotDate.setHours(0, 0, 0, 0);

        return !slot.isBooked && slotDate > today;
      });

      setDoctorAvailability(filteredAvailability);
      console.log(filteredAvailability);
      const dates = filteredAvailability.map((slot) => slot.date);

      const formattedDates = dates.map((d) => formatDate(d));
      const uniqueDates = Array.from(new Set(formattedDates));

      setAvailableDates(uniqueDates);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const retrieveTimeSlot = (date: string) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
      time: "",
    }));

    setAvailableTimes([]);

    const rawDate = reverseFormatDate(date);

    const timeSlots: string[] = doctorAvailability
      .filter((d) => d.date === rawDate)
      .map((d) => d.time);

    setAvailableTimes(timeSlots);
  };

  const handleSubmit = () => {
    if (formData.doctorId && formData.date && formData.time) {
      onBookAppointment(formData);
      // Reset form
      setFormData({
        doctorId: "",
        date: "",
        time: "",
        purpose: "",
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
            <Label
              htmlFor="doctor"
              className="text-[#1A1A1A] flex items-center gap-2"
            >
              <User className="h-4 w-4 text-[#4EA5D9]" />
              Select Doctor
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.doctorId}
              onValueChange={(value) => retrieveDoctorAppointment(value)}
            >
              <SelectTrigger
                id="doctor"
                className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
              >
                <SelectValue placeholder="Choose a doctor..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                {doctorDropdown.map((doctor) => (
                  <SelectItem
                    key={doctor.id}
                    value={doctor.id}
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="text-[#1A1A1A] flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-[#4EA5D9]" />
              Appointment Date
              <span className="text-red-500">*</span>
            </Label>
            <Select
              disabled={isLoadingAvailability || availableDates.length === 0}
              value={formData.date}
              onValueChange={(value) => retrieveTimeSlot(value)}
            >
              <SelectTrigger
                id="date"
                className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
              >
                <SelectValue
                  placeholder={
                    isLoadingAvailability
                      ? "Loading dates..."
                      : availableDates.length === 0
                      ? "No available dates for the selected doctor..."
                      : formData.date === ""
                      ? "Select a date..." // show placeholder when date is cleared
                      : formData.date
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                {isLoadingAvailability ? (
                  <div className="p-3 text-sm text-gray-500">
                    Loading available dates...
                  </div>
                ) : (
                  availableDates.map((date) => (
                    <SelectItem
                      key={date}
                      value={date}
                      className="hover:bg-[#F5F7FA] cursor-pointer"
                    >
                      {date}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="time"
              className="text-[#1A1A1A] flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-[#4EA5D9]" />
              Appointment Time
              <span className="text-red-500">*</span>
            </Label>
            <Select
              disabled={isLoadingTimeSlot || availableTimes.length === 0}
              value={formData.time}
              onValueChange={(value) =>
                setFormData({ ...formData, time: value })
              }
            >
              <SelectTrigger
                id="time"
                className="border-[#DCEFFB] focus:ring-[#4EA5D9] rounded-xl hover:bg-[#F5F7FA] cursor-pointer"
              >
                <SelectValue
                  placeholder={
                    isLoadingTimeSlot
                      ? "Loading time slots..."
                      : formData.time === ""
                      ? "Select a time slot..." // show placeholder when date is cleared
                      : formData.time
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#DCEFFB] rounded-xl">
                {availableTimes.map((time) => (
                  <SelectItem
                    key={time}
                    value={time}
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-[#1A1A1A] flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-[#4EA5D9]" />
              Reason for Visit (Optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe the reason for your visit..."
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
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
