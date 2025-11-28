import { QuickActions } from "./components/QuickActions";
import { UpcomingAppointment } from "./components/UpcomingAppointment";
import { HealthSummary } from "./components/HealthSummary";
import FadeInSection from "./components/animations/FadeInSection";
import "../../themes/patient.css";
import Layout from "../../components/Layout";
import { useContext } from "react";
import { CustomerContext } from "./CustomerContext";
import LoadingSpinner from "./components/LoadingSpinner";

export default function CustDashboard() {
  const { patient, loading } = useContext(CustomerContext);

  if(loading) return <LoadingSpinner />

  return (
    <Layout role="customer">
      <div className="min-h-screen">
        <div className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <h1 className="page-title">
              Welcome back,{" "}
              {patient && (
                <span className="text-primary">{patient.firstName}</span>
              )}
            </h1>

            <p className="text-gray-neutral text-lg">
              Manage your appointments, health records, and payments in one
              place.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <FadeInSection>
            <QuickActions />
          </FadeInSection>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeInSection delay={0.3}>
              <UpcomingAppointment />
            </FadeInSection>
            <FadeInSection delay={0.6}>
              <HealthSummary />
            </FadeInSection>
          </div>
        </div>
      </div>
    </Layout>
  );
}
