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
  getAppointmentByAppointmentId,
  getAppointmentsByPatientId,
  registerAppointments,
  updateAppointment,
} from "../../../services/appointmentManagementService";
import {
  formatDate,
  reverseFormatDate,
} from "../../../../../utils/DateConversion";
import LoadingOverlay from "../components/LoadingOverlay";


type TabType = "upcoming" | "past" | "cancelled";

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

  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<
    Appointment[]
  >([]);

  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // get appointments data from db
  useEffect(() => {
    if (patient?.id) {
      fetchAppointmentDataDB(patient.id);
    }
  }, [patient?.id]);

  useEffect(() => {
    if (appointmentsData.length > 0) {
      filterAppointmentsBasedOnStatus();
    }
  }, [appointmentsData]);

  if (loading || !patient) return <LoadingSpinner />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
        doctorEmail: data.doctorEmail,
        doctorPhone: data.doctorPhone,
        date: formatDate(data.date),
        time: convertTime(data.time),
        status: data.status,
        prescriptions: [],
        cancellationReason: data.cancellationReason,
      }));

      setAppointmentsData(formattedAppointments); // single state update
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

  const filterAppointmentsBasedOnStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: typeof appointmentsData = [];
    const past: typeof appointmentsData = [];
    const cancelled: typeof appointmentsData = [];

    appointmentsData.forEach((a) => {
      const appointmentDate = new Date(a.date);
      appointmentDate.setHours(0, 0, 0, 0);

      if (a.status === "Cancelled") {
        cancelled.push(a);
      } else if (appointmentDate < today) {
        past.push(a);
      } else {
        upcoming.push(a);
      }
    });

    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
    setCancelledAppointments(cancelled);
  };

  const handleViewDetails = (id: string) => {
    const appointment = getAppointments()?.find((a) => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setDetailsModalOpen(true);
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

  const handleConfirmCancel = async (
    appointmentId: string,
    cancellationReason: string
  ) => {
    setLoadingCancel(true);

    try {
      const existing = await getAppointmentByAppointmentId(appointmentId);
      const payload = {
        ...existing,
        status: "Cancelled",
        cancellationReason: cancellationReason.trim(),
      };

      await updateAppointment(appointmentId, payload);

      toast.success("Appointment has been cancelled!", {
        style: {
          background: "var(--accent-success)",
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
      setLoadingCancel(false);
      fetchAppointmentDataDB(patient.id);
    }
  };

  const getAppointments = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingAppointments;
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
      appointment.doctorSpecialty.toLowerCase().includes(query)
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
                placeholder="Search by doctor name or specialty"
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
                appointments.map((appointment) => {
                  let type: "upcoming" | "past" | "cancelled" = "upcoming";
                  
                  if (appointment.status === "Cancelled") type = "cancelled";
                  else if (new Date(appointment.date) < today)
                    type = "past";

                  return (
                    <AppointmentCard
                      key={appointment.id}
                      type={type}
                      appointment={appointment}
                      onViewDetails={handleViewDetails}
                      onCancel={handleCancel}
                    />
                  );
                })
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

        <LoadingOverlay
          isLoading={loadingBooking}
          message="Booking your appointment..."
        />

        <LoadingOverlay
          isLoading={loadingCancel}
          message="Cancelling your appointment..."
        />
      </div>
    </Layout>
  );
}
