import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import * as paymentService from "../services/paymentService";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { formatStaffDate } from "../utils/dateFormat";

export default function PaymentList() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAllPayments();
      setPayments(data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      // Mock data
      setPayments([
        {
          id: 1,
          patient: { firstName: "John", lastName: "Doe" },
          amount: 150.00,
          status: "paid",
          date: "2024-12-20",
          method: "Stripe",
        },
        {
          id: 2,
          patient: { firstName: "Jane", lastName: "Smith" },
          amount: 200.00,
          status: "unpaid",
          date: "2024-12-19",
          method: "Cash",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "patientName",
      label: "Patient",
      render: (value, row) => {
        const p = row.patient || row._patient;
        const label = p ? `${p.firstName || ""} ${p.lastName || ""}`.trim() : value || row.patientName || "N/A";
        return <div className="font-medium text-gray-900">{label}</div>;
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `$${value?.toFixed(2) || "0.00"}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "method",
      label: "Payment Method",
    },
    {
      key: "date",
      label: "Date",
      render: (value) => formatStaffDate(value),
    },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-8">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/staff/payments/${row.id}`);
        }}
        className="text-blue-600 hover:text-blue-800"
        title="View Details"
      >
        <FaEye size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Generate invoice
        }}
        className="text-green-600 hover:text-green-800"
        title="Download Invoice"
      >
        <FaFileInvoice size={20} />
      </button>
    </div>
  );

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
            <p className="text-gray-600">View and manage all payment records</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading payments...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={payments} actions={actions} />
          )}
        </div>
      </div>
    </Layout>
  );
}

