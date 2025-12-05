import { Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Payment } from "./PaymentHistoryTable";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PaymentCardProps {
  payment: Payment;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  const navigate = useNavigate();

  const viewReceiptValidation = (transaction: Payment) => {
    if (transaction.status === "Pending") {
      toast.warning("Receipt can only be generated for Paid appointments!");
      return false;
    } else if (transaction.receipt === null) {
      toast.error("Receipt is not found!");
      return false;
    } else {
      return true;
    }
  };

  const viewReceipt = (transaction: Payment) => {
    const transactionId = transaction?.billId;
    if (!transactionId) {
      toast.error("Unable to determine transaction identifier.");
      return;
    } else if (!viewReceiptValidation(transaction)) {
      return;
    }
    navigate(`/customer/payments/receipt/view?transactionId=${transactionId}`);
  };

  return (
    <div
      className="p-5 rounded-xl shadow-sm border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--input-border)",
      }}
    >
      {/* Bill ID and Date */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p style={{ color: "var(--primary)" }}>{payment.billId}</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {payment.paymentTime}
          </p>
        </div>
        <StatusBadge status={payment.status} />
      </div>

      {/* Service Name */}
      <h4 className="mb-1">{payment.doctorSpecialization}</h4>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {payment.doctorName}
      </p>

      {/* Amount */}
      <div className="flex justify-between items-start mb-4">
        <div className="mb-4">
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            Amount
          </p>
          <p className="text-2xl" style={{ color: "var(--text-heading)" }}>
            RM {payment.amount.toLocaleString()}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            Payment Type
          </p>
          <p className="text-2xl" style={{ color: "var(--text-heading)" }}>
            {payment.paymentMethod === "" ? "-" : payment.paymentMethod === "Stripe" ? "Credit Card" : payment.paymentMethod}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => viewReceipt(payment)}
          className="flex-1 bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl cursor-pointer"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Receipt Details
        </Button>
      </div>
    </div>
  );
}
