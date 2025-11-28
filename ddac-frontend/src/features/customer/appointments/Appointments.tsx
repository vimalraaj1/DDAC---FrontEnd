import { useContext, useEffect, useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
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
import Layout from "../../../components/Layout";
import { CustomerContext } from "../CustomerContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getAppointmentsByPatientId,
  registerAppointments,
} from "../../../services/appointmentManagementService";
import {
  formatDate,
  reverseFormatDate,
} from "../../../../../utils/DateConversion";


const pastAppointments: Appointment[] = [
  {
    id: "5",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorInitials: "SJ",
    date: "Monday, October 21, 2025",
    time: "10:00 AM - 10:30 AM",
    location: "Cardiac Care Center, Room 305",
    status: "Approved",
    prescriptions: [
      {
        name: "Atorvastatin 20mg",
        dosage: "1 tablet after dinner",
        duration: "30 days",
        refills: 2,
      },
      {
        name: "Lisinopril 10mg",
        dosage: "1 tablet in the morning",
        duration: "30 days",
        refills: 3,
      },
      {
        name: "Aspirin 81mg",
        dosage: "1 tablet daily with food",
        duration: "90 days",
        refills: 1,
      },
    ],
  },
  {
    id: "6",
    doctorName: "Dr. James Thompson",
    doctorSpecialty: "Neurologist",
    doctorInitials: "JT",
    date: "Wednesday, October 9, 2025",
    time: "3:00 PM - 3:45 PM",
    location: "Neurology Department, Room 501",
    status: "Approved",
    prescriptions: [
      {
        name: "Atorvastatin 20mg",
        dosage: "1 tablet after dinner",
        duration: "30 days",
        refills: 2,
      },
      {
        name: "Lisinopril 10mg",
        dosage: "1 tablet in the morning",
        duration: "30 days",
        refills: 3,
      },
      {
        name: "Aspirin 81mg",
        dosage: "1 tablet daily with food",
        duration: "90 days",
        refills: 1,
      },
    ],
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
    prescriptions: [
      {
        name: "Atorvastatin 20mg",
        dosage: "1 tablet after dinner",
        duration: "30 days",
        refills: 2,
      },
      {
        name: "Lisinopril 10mg",
        dosage: "1 tablet in the morning",
        duration: "30 days",
        refills: 3,
      },
      {
        name: "Aspirin 81mg",
        dosage: "1 tablet daily with food",
        duration: "90 days",
        refills: 1,
      },
    ],
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
  status: "Approved" | "Pending" | "Cancelled";
};

export default function Appointments() {
  const { patient, loading } = useContext(CustomerContext);

  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);

  // get appointments data from db
  useEffect(() => {
    if (patient?.id) {
      fetchAppointmentDataDB(patient.id);
    }
  }, [patient?.id]);

  if (loading || !patient) return <LoadingSpinner />;

  const getInitials = (firstName: string, lastName: string) => {
    return firstName[0] + lastName[0];
  };

  const convertTime = (time24: string) => {
    const [hour, minute] = time24.split(":");
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const fetchAppointmentDataDB = async (id: any) => {
    try {
      setLoadingAppointment(true);
      const datas = await getAppointmentsByPatientId(id);

      const formattedAppointments = datas.map((data: any) => ({
        id: data.appointmentId,
        doctorName: data.doctorFirstName + " " + data.doctorLastName,
        doctorSpecialty: data.doctorSpecialization,
        doctorInitials: getInitials(data.doctorFirstName, data.doctorLastName),
        date: formatDate(data.date),
        time: convertTime(data.time),
        location: "",
        status: data.status,
        prescriptions: [],
      }));

      setAppointmentsData(formattedAppointments); // single state update
      console.log(formattedAppointments);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } finally {
      setLoadingAppointment(false);
    }
  };

  const handleViewDetails = (id: string) => {
    const appointment = getAppointments()?.find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setDetailsModalOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const appointment = getAppointments()?.find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setEditModalOpen(true);
    }
  };

  const handleCancel = (id: string) => {
    const appointment = getAppointments()?.find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setCancelDialogOpen(true);
    }
  };

  const handleBookAppointment = async (
    appointmentData: AppointmentFormData
  ) => {
    setLoadingBooking(true);

    const payload = {
      ...appointmentData,
      date: reverseFormatDate(appointmentData.date),
      patientId: patient.id,
      status: "Pending",
      staffId: "ST000001", // hard coded for now
      cancellationReason: null,
    };

    try {
      await registerAppointments(payload);

      toast.success("Appointment booked successfully!", {
        style: {
          background: "#2ECC71",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } catch (err) {
      console.log("Error: ", err);
      toast.error("Booking failed!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } finally {
      setLoadingBooking(false);
      fetchAppointmentDataDB(patient.id);
    }
  };

  const handleUpdateAppointment = (
    appointmentId: string,
    updatedData: EditFormData
  ) => {
    console.log("Updating appointment:", appointmentId, updatedData);
    toast.success("Appointment updated successfully!", {
      style: {
        background: "var(--accent-success)",
        color: "#ffffff",
        borderRadius: "10px",
      },
    });
  };

  const handleConfirmCancel = (appointmentId: string) => {
    console.log("Cancelling appointment:", appointmentId);
    toast.success("Appointment has been cancelled!", {
      style: {
        background: "var(--accent-success)",
        color: "#ffffff",
        borderRadius: "10px",
      },
    });
  };

  const getAppointments = () => {
    switch (activeTab) {
      case "upcoming":
        return appointmentsData;
      case "past":
        return pastAppointments;
      case "cancelled":
        return cancelledAppointments;
      default:
        return [];
    }
  };

  // Filter appointments based on search query
  const filteredAppointments = getAppointments()?.filter((appointment) => {
    const query = searchQuery.toLowerCase();
    return (
      appointment.doctorName.toLowerCase().includes(query) ||
      appointment.doctorSpecialty.toLowerCase().includes(query) ||
      appointment.location.toLowerCase().includes(query)
    );
  });

  const appointments = filteredAppointments;

  return (
    <Layout role="customer">
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto mb-8">
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
              {loadingAppointment ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                  <p className="text-[#7A7A7A]">Retrieving appointments...</p>
                </div>
              ) : appointments && appointments.length > 0 ? (
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

        {loadingBooking && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-[#4EA5D9]" />
              <p className="text-sm font-medium text-gray-700">
                Booking your appointment...
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
