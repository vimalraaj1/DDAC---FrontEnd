import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppointmentCard, Appointment } from "./components/AppointmentCard";
import {
  AppointmentBookingModal,
  AppointmentFormData,
} from "./components/AppointmentBookingModal";
import { AppointmentDetailsModal } from "./components/AppointmentDetailsModal";
import {
  AppointmentEditModal,
  EditFormData,
} from "./components/AppointmentEditModal";
import { CancelAppointmentDialog } from "./components/CancelAppointmentDialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import CustNavBar from "../components/CustNavBar";
import FadeInSection from "../components/animations/FadeInSection";

// Mock appointment data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorInitials: "SJ",
    date: "Monday, November 25, 2025",
    time: "10:00 AM - 10:30 AM",
    location: "Cardiac Care Center, Room 305",
    status: "Confirmed",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "General Practitioner",
    doctorInitials: "MC",
    date: "Thursday, November 28, 2025",
    time: "2:00 PM - 2:30 PM",
    location: "Main Clinic, Room 102",
    status: "Confirmed",
  },
  {
    id: "3",
    doctorName: "Dr. Emily Williams",
    doctorSpecialty: "Dermatologist",
    doctorInitials: "EW",
    date: "Friday, November 29, 2025",
    time: "11:00 AM - 11:45 AM",
    location: "Dermatology Wing, Room 201",
    status: "Pending",
  },
  {
    id: "4",
    doctorName: "Dr. Robert Martinez",
    doctorSpecialty: "Orthopedic Surgeon",
    doctorInitials: "RM",
    date: "Monday, December 2, 2025",
    time: "9:00 AM - 9:30 AM",
    location: "Orthopedic Center, Room 408",
    status: "Confirmed",
  },
];

const pastAppointments: Appointment[] = [
  {
    id: "5",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorInitials: "SJ",
    date: "Monday, October 21, 2025",
    time: "10:00 AM - 10:30 AM",
    location: "Cardiac Care Center, Room 305",
    status: "Confirmed",
  },
  {
    id: "6",
    doctorName: "Dr. James Thompson",
    doctorSpecialty: "Neurologist",
    doctorInitials: "JT",
    date: "Wednesday, October 9, 2025",
    time: "3:00 PM - 3:45 PM",
    location: "Neurology Department, Room 501",
    status: "Confirmed",
  },
];

const cancelledAppointments: Appointment[] = [
  {
    id: "7",
    doctorName: "Dr. Lisa Anderson",
    doctorSpecialty: "Pediatrician",
    doctorInitials: "LA",
    date: "Friday, November 15, 2025",
    time: "1:00 PM - 1:30 PM",
    location: "Pediatrics Wing, Room 203",
    status: "Cancelled",
  },
];

type TabType = "upcoming" | "past" | "cancelled";

type AppointmentType = {
  id: string;
  doctorName: string;
  doctorInitials: string;
  time: string;
  doctorSpecialty: string;
  location: string;
  date: string;
  status: "Confirmed" | "Pending" | "Cancelled";
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const handleViewDetails = (id: string) => {
    const appointment = getAppointments().find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setDetailsModalOpen(true);
    }
    toast.success("Opening appointment details...");
  };

  const handleEdit = (id: string) => {
    const appointment = getAppointments().find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setEditModalOpen(true);
    }
  };

  const handleCancel = (id: string) => {
    const appointment = getAppointments().find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setCancelDialogOpen(true);
    }
  };

  const handleBookAppointment = (appointmentData: AppointmentFormData) => {
    console.log("Booking new appointment:", appointmentData);
    toast.success("Appointment booked successfully!");
  };

  const handleUpdateAppointment = (
    appointmentId: string,
    updatedData: EditFormData
  ) => {
    console.log("Updating appointment:", appointmentId, updatedData);
    toast.success("Appointment updated successfully!");
  };

  const handleConfirmCancel = (appointmentId: string) => {
    console.log("Cancelling appointment:", appointmentId);
    toast.error("Appointment has been cancelled");
  };

  const getAppointments = () => {
    switch (activeTab) {
      case "upcoming":
        return mockAppointments;
      case "past":
        return pastAppointments;
      case "cancelled":
        return cancelledAppointments;
      default:
        return mockAppointments;
    }
  };

  // Filter appointments based on search query
  const filteredAppointments = getAppointments().filter((appointment) => {
    const query = searchQuery.toLowerCase();
    return (
      appointment.doctorName.toLowerCase().includes(query) ||
      appointment.doctorSpecialty.toLowerCase().includes(query) ||
      appointment.location.toLowerCase().includes(query)
    );
  });

  const appointments = filteredAppointments;

  return (
    <div className="min-h-screen">
      <CustNavBar />

      <div className="max-w-4xl mx-auto mt-8 mb-8">
        {/* Header Section */}
        <div className="bg-[#dcf0fc] rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-[#1A1A1A] mb-2">My Appointments</h1>
              <p className="text-[#7A7A7A]">
                View, manage, and track your upcoming and past visits
              </p>
            </div>
            <Button
              onClick={() => setBookingModalOpen(true)}
              className="bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#7A7A7A]" />
            <Input
              type="text"
              placeholder="Search by doctor name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white border-[#DCEFFB] focus:ring-[#4EA5D9] focus:border-[#4EA5D9] rounded-xl"
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-[#4EA5D9] text-white shadow-md"
                : "bg-white text-[#7A7A7A] hover:bg-[#dcf0fc] hover:text-[#4EA5D9]"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "past"
                ? "bg-[#4EA5D9] text-white shadow-md"
                : "bg-white text-[#7A7A7A] hover:bg-[#dcf0fc] hover:text-[#4EA5D9]"
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-6 py-3 rounded-full transition-all cursor-pointer ${
              activeTab === "cancelled"
                ? "bg-[#4EA5D9] text-white shadow-md"
                : "bg-white text-[#7A7A7A] hover:bg-[#dcf0fc] hover:text-[#4EA5D9]"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Appointment List Section */}
        <FadeInSection>
          <div className="space-y-5">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                <p className="text-[#7A7A7A]">
                  No {activeTab} appointments found.
                </p>
              </div>
            )}
          </div>
        </FadeInSection>
      </div>

      {/* Appointment Booking Modal */}
      <AppointmentBookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        onBookAppointment={handleBookAppointment}
      />
      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        appointment={selectedAppointment}
      />
      {/* Appointment Edit Modal */}
      <AppointmentEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        appointment={selectedAppointment}
        onUpdateAppointment={handleUpdateAppointment}
      />
      {/* Cancel Appointment Dialog */}
      <CancelAppointmentDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        appointment={selectedAppointment}
        onConfirmCancel={handleConfirmCancel}
      />
      <Toaster />
    </div>
  );
}
