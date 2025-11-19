import { Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { StatusBadge } from "./StatusBadge";

export interface Payment {
  id: string;
  billId: string;
  service: string;
  department: string;
  dateIssued: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

interface PaymentHistoryTableProps {
  payments: Payment[];
  onViewDetails: (payment: Payment) => void;
}

export function PaymentHistoryTable({ payments, onViewDetails }: PaymentHistoryTableProps) {
  const handleDownload = (billId: string) => {
    // Mock download functionality
    console.log(`Downloading receipt for RM {billId}`);
  };

  return (
    <div className="hidden md:block rounded-xl overflow-hidden shadow-sm border" style={{ 
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--input-border)'
    }}>
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <TableHead style={{ color: 'var(--text-heading)' }}>Bill ID</TableHead>
            <TableHead style={{ color: 'var(--text-heading)' }}>Service / Department</TableHead>
            <TableHead style={{ color: 'var(--text-heading)' }}>Date Issued</TableHead>
            <TableHead style={{ color: 'var(--text-heading)' }}>Amount</TableHead>
            <TableHead style={{ color: 'var(--text-heading)' }}>Status</TableHead>
            <TableHead style={{ color: 'var(--text-heading)' }} className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow 
              key={payment.id}
              style={{ 
                backgroundColor: index % 2 === 0 ? 'var(--bg-card)' : 'rgba(248, 250, 252, 0.5)'
              }}
            >
              <TableCell style={{ color: 'var(--primary)' }}>
                {payment.billId}
              </TableCell>
              <TableCell>
                <div>
                  <p style={{ color: 'var(--text-body)' }}>{payment.service}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{payment.department}</p>
                </div>
              </TableCell>
              <TableCell style={{ color: 'var(--text-body)' }}>
                {payment.dateIssued}
              </TableCell>
              <TableCell style={{ color: 'var(--text-heading)' }}>
                RM {payment.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={payment.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(payment)}
                    style={{ color: 'var(--primary)' }}
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(payment.billId)}
                    style={{ color: 'var(--accent-teal)' }}
                    className="hover:bg-[#F5F7FA] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
