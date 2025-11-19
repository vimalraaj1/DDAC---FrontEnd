import { useState } from "react";
import { PageHeader } from "./components/PageHeader";
import { FilterBar } from "./components/FilterBar";
import {
  PaymentHistoryTable,
  type Payment,
} from "./components/PaymentHistoryTable";
import { PaymentCard } from "./components/PaymentCard";
import { SummaryPanel } from "./components/SummaryPanel";
import { InvoiceDetailsModal } from "./components/InvoiceDetailsModal";
import CustNavBar from "../components/CustNavBar";
import FadeInSection from "../components/animations/FadeInSection";

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: "1",
    billId: "#INV-20394",
    service: "General Consultation",
    department: "Family Medicine",
    dateIssued: "Nov 15, 2024",
    amount: 200,
    status: "paid",
  },
  {
    id: "2",
    billId: "#INV-20395",
    service: "Blood Test Panel",
    department: "Laboratory",
    dateIssued: "Nov 10, 2024",
    amount: 350,
    status: "paid",
  },
  {
    id: "3",
    billId: "#INV-20396",
    service: "X-Ray Examination",
    department: "Radiology",
    dateIssued: "Nov 8, 2024",
    amount: 300,
    status: "pending",
  },
  {
    id: "4",
    billId: "#INV-20397",
    service: "Physical Therapy",
    department: "Rehabilitation",
    dateIssued: "Nov 5, 2024",
    amount: 225,
    status: "paid",
  },
  {
    id: "5",
    billId: "#INV-20398",
    service: "Dental Checkup",
    department: "Dentistry",
    dateIssued: "Oct 28, 2024",
    amount: 300,
    status: "overdue",
  },
  {
    id: "6",
    billId: "#INV-20399",
    service: "MRI Scan",
    department: "Radiology",
    dateIssued: "Oct 20, 2024",
    amount: 1550,
    status: "paid",
  },
  {
    id: "7",
    billId: "#INV-20400",
    service: "Vaccination",
    department: "Immunology",
    dateIssued: "Oct 15, 2024",
    amount: 75,
    status: "paid",
  },
  {
    id: "8",
    billId: "#INV-20401",
    service: "ECG Test",
    department: "Cardiology",
    dateIssued: "Oct 10, 2024",
    amount: 250,
    status: "pending",
  },
];

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleFilter = (filters: {
    startDate: string;
    endDate: string;
    status: string;
    search: string;
  }) => {
    let filtered = [...mockPayments];

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
          p.service.toLowerCase().includes(searchLower) ||
          p.department.toLowerCase().includes(searchLower)
      );
    }

    // ⭐ DATE RANGE FILTER
    const { startDate, endDate } = filters;

    if (startDate) {
      const start = new Date(startDate); // YYYY-MM-DD from input
      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.dateIssued); // "Oct 10, 2024"
        return paymentDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      // set to end of that day
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((p) => {
        const paymentDate = new Date(p.dateIssued);
        return paymentDate <= end;
      });
    }

    setPayments(filtered);
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPayment(null), 300);
  };

  // Calculate summary data
  const totalPaidThisYear = mockPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingAmount = mockPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueAmount = mockPayments
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      <CustNavBar />
      <PageHeader />
      <FilterBar onFilter={handleFilter} />

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Payment History Section */}
            <div className="flex-1">
              <FadeInSection delay={0}>
                {/* Desktop Table View */}
                <PaymentHistoryTable
                  payments={payments}
                  onViewDetails={handleViewDetails}
                />
              </FadeInSection>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {payments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* Empty State */}
              {payments.length === 0 && (
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
                  totalPaidThisYear={totalPaidThisYear}
                  outstandingAmount={outstandingAmount}
                  overdueAmount={overdueAmount}
                />
              </FadeInSection>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Modal */}
      <InvoiceDetailsModal
        payment={selectedPayment}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
