import { Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Payment } from "./PaymentHistoryTable";

interface PaymentCardProps {
  payment: Payment;
  onViewDetails: (payment: Payment) => void;
}

export function PaymentCard({ payment, onViewDetails }: PaymentCardProps) {
  const handleDownload = (billId: string) => {
    // Mock download functionality
    console.log(`Downloading receipt for ${billId}`);
  };

  return (
    <div 
      className="p-5 rounded-xl shadow-sm border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--input-border)'
      }}
    >
      {/* Bill ID and Date */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p style={{ color: 'var(--primary)' }}>{payment.billId}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {payment.dateIssued}
          </p>
        </div>
        <StatusBadge status={payment.status} />
      </div>

      {/* Service Name */}
      <h4 className="mb-1">{payment.service}</h4>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        {payment.department}
      </p>

      {/* Amount */}
      <div className="mb-4">
        <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Amount</p>
        <p className="text-2xl" style={{ color: 'var(--text-heading)' }}>
          ${payment.amount.toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => onViewDetails(payment)}
          className="flex-1"
          style={{ 
            backgroundColor: 'var(--btn-primary)',
            color: 'var(--text-on-dark)'
          }}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDownload(payment.billId)}
          style={{ 
            borderColor: 'var(--input-border)',
            color: 'var(--accent-teal)'
          }}
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
