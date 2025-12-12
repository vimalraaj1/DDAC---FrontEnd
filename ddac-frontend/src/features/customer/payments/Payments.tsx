import { useContext, useEffect, useState } from "react";
import { PageHeader } from "./components/PageHeader";
import { FilterBar } from "./components/FilterBar";
import {
  PaymentHistoryTable,
  type Payment,
} from "./components/PaymentHistoryTable";
import { PaymentCard } from "./components/PaymentCard";
import { SummaryPanel } from "./components/SummaryPanel";
import CustNavBar from "../components/CustNavBar";
import FadeInSection from "../components/animations/FadeInSection";
import Layout from "../../../components/Layout";
import { getTransactionsByPatientId } from "../../../services/transactionManagementService";
import { toast } from "sonner";
import { CustomerContext } from "../CustomerContext";
import { formatDate } from "../../../utils/DateConversion";

export default function Payments() {
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [originalPayment, setOriginalPayments] = useState<Payment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const { patient, loading } = useContext(CustomerContext);

  useEffect(() => {
    if (patient?.id) {
      fetchTransactionsFromDB(patient.id);
    }
  }, [patient?.id]);

  const fetchTransactionsFromDB = async (patientId: string) => {
    setIsLoadingPayment(true);

    try {
      const data = await getTransactionsByPatientId(patientId);
      const transactions = data.map((t: any) => ({
        billId: t.id,
        amount: t.amount,
        status:
          t.status === "succeede" || t.status === "Paid" ? "Succeed" : t.status, // hardcode for now
        paymentTime: formatDate(t.paymentTime),
        paymentMethod: t.paymentMethod,
        receipt: t.receipt,
        appointmentId: t.appointment.appointmentId,
        appointmentTime: t.appointment.appointmentTime,
        doctorName: t.doctor.firstName + " " + t.doctor.lastName,
        doctorSpecialization: t.doctor.specialization,
      }));
      setPayments(transactions);
      setOriginalPayments(transactions);
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
      setIsLoadingPayment(false);
    }
  };

  const handleFilter = (filters: {
    startDate: string;
    endDate: string;
    status: string;
    search: string;
  }) => {
    let filtered = [...originalPayment];

    // Filter by status
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.billId.toLowerCase().includes(searchLower) ||
          p.doctorSpecialization.toLowerCase().includes(searchLower) ||
          p.doctorName.toLowerCase().includes(searchLower)
      );
    }

    // ⭐ DATE RANGE FILTER
    const { startDate, endDate } = filters;

    if (startDate) {
      const start = new Date(startDate); // YYYY-MM-DD from input
      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.paymentTime); // "Oct 10, 2024"
        return paymentDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      // set to end of that day
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.paymentTime);
        return paymentDate <= end;
      });
    }

    setPayments(filtered);
  };

  // Calculate summary data
  const totalRecords = payments.length;

  const totalPaidThisYear = payments
    .filter((p) => p.status === "Succeed")
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingAmount = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout role="customer">
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        <PageHeader />
        <FilterBar onFilter={handleFilter} />

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Payment History Section */}
              <div className="flex-1 flex flex-col gap-5 ">
                {isLoadingPayment ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#DCEFFB]">
                    <p className="text-[#7A7A7A]">
                      Retrieving transaction records...
                    </p>
                  </div>
                ) : (
                  payments.map((payment) => (
                    <PaymentCard key={payment.billId} payment={payment} />
                  ))
                )}

                {/* Empty State */}
                {(payments.length === 0 && !isLoadingPayment) && (
                  <div
                    className="p-12 rounded-xl text-center"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--input-border)",
                    }}
                  >
                    <p style={{ color: "var(--text-muted)" }}>
                      No payments found matching your filters.
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Panel - Desktop Only */}
              <div className="hidden lg:block w-80">
                <FadeInSection delay={0.6}>
                  <SummaryPanel
                    totalRecords={totalRecords}
                    totalPaidThisYear={totalPaidThisYear}
                    outstandingAmount={outstandingAmount}
                  />
                </FadeInSection>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
