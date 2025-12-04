import { QuickActions } from "./components/QuickActions";
import { UpcomingAppointment } from "./components/UpcomingAppointment";
import { HealthSummary } from "./components/HealthSummary";
import FadeInSection from "./components/animations/FadeInSection";
import "../../themes/patient.css";
import Layout from "../../components/Layout";
import { useContext, useEffect, useState } from "react";
import { CustomerContext } from "./CustomerContext";
import { Appointment } from "./appointments/components/AppointmentCard";

import LoadingSpinner from "./components/LoadingSpinner";
import { getUpcomingAppointmentByPatientId } from "../../services/appointmentManagementService";
import { formatDate } from "../../../../utils/DateConversion";
import { convertTime } from "../../../../utils/TimeConversion";
import { getInitials } from "../../../../utils/GetInitials";

export default function CustDashboard() {
  const { patient, loading } = useContext(CustomerContext);
  const [upcomingAppointmentData, setUpcomingAppointmentData] =
    useState<Appointment | null>(null);
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(false);

  useEffect(() => {
    if (patient?.id) {
      fetchUpcomingAppointmentFromDB(patient.id);
    }
  }, [patient?.id]);

  if (loading) return <LoadingSpinner />;
  const fetchUpcomingAppointmentFromDB = async (patientId: any) => {
    setIsLoadingAppointment(true);
    try {
      const data = await getUpcomingAppointmentByPatientId(patientId);
      const doctorName = data.doctorFirstName + " " + data.doctorLastName;
      setUpcomingAppointmentData({
        id: data.appointmentId,
        doctorName: doctorName,
        doctorSpecialty: data.doctorSpecialization,
        doctorInitials: getInitials(data.doctorFirstName, data.doctorLastName),
        doctorEmail: data.doctorEmail,
        doctorPhone: data.doctorPhone,
        date: formatDate(data.date),
        time: convertTime(data.time),
        purpose: data.purpose,
        location: "",
        status: "Pending",
        prescriptions: [],
        cancellationReason: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingAppointment(false);
    }
  };

  return (
    <Layout role="customer">
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-secondary py-8 rounded-2xl ">
                <div className="container mx-auto px-8">
                  <h1 className="page-title">
                    Welcome back,{" "}
                    {patient && (
                      <span className="text-primary">{patient.firstName}</span>
                    )}
                  </h1>

                  <p className="text-gray-neutral text-lg">
                    Manage your appointments, health records, and payments in
                    one place.
                  </p>
                </div>
              </div>

              <div className="container mx-auto px-4 py-8">
                <FadeInSection>
                  <QuickActions />
                </FadeInSection>
                <div className="mt-10">
                  {isLoadingAppointment ? (
                    <div className="space-y-4 flex flex-col h-full">
                      <p className="text-[#7A7A7A]">
                        Loading upcoming appointments...
                      </p>
                    </div>
                  ) : !upcomingAppointmentData ? (
                    <UpcomingAppointment appointment={null} />
                  ) : (
                    <UpcomingAppointment
                      appointment={upcomingAppointmentData}
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
