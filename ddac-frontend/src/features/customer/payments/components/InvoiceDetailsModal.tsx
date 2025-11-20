import { Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import type { Payment } from "./PaymentHistoryTable";

interface InvoiceDetailsModalProps {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
}

// Mock service items for the invoice
const getServiceItems = (service: string) => {
  const items = {
    "General Consultation": [
      { name: "Doctor Consultation Fee", price: 150 },
      { name: "Medical Records", price: 20 },
      { name: "Prescription", price: 30 },
    ],
    "Blood Test Panel": [
      { name: "Complete Blood Count", price: 80 },
      { name: "Lipid Panel", price: 120 },
      { name: "Thyroid Function Test", price: 150 },
    ],
    "X-Ray Examination": [
      { name: "Chest X-Ray", price: 200 },
      { name: "Radiologist Review", price: 100 },
    ],
    "Physical Therapy": [
      { name: "Therapy Session (60 min)", price: 180 },
      { name: "Exercise Equipment", price: 45 },
    ],
    "Dental Checkup": [
      { name: "Oral Examination", price: 120 },
      { name: "Teeth Cleaning", price: 100 },
      { name: "Dental X-Ray", price: 80 },
    ],
    "MRI Scan": [
      { name: "MRI Brain Scan", price: 1200 },
      { name: "Contrast Material", price: 150 },
      { name: "Radiologist Consultation", price: 200 },
    ],
    Vaccination: [
      { name: "Flu Vaccine", price: 50 },
      { name: "Administration Fee", price: 25 },
    ],
    "ECG Test": [
      { name: "12-Lead ECG", price: 150 },
      { name: "Cardiologist Review", price: 100 },
    ],
  };

  return (
    items[service as keyof typeof items] || [{ name: service, price: 200 }]
  );
};

export function InvoiceDetailsModal({
  payment,
  open,
  onClose,
}: InvoiceDetailsModalProps) {
  if (!payment) return null;

  const serviceItems = getServiceItems(payment.service);
  const subtotal = serviceItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleDownload = () => {
    console.log(`Downloading receipt for RM {payment.billId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="max-h-[80vh] overflow-y-auto px-6 py-4 modal-scroll">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span style={{ color: "var(--text-heading)" }}>
                Invoice Details
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                style={{ color: "var(--text-muted)" }}
              ></Button>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Detailed breakdown of the invoice for {payment.billId}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Bill ID and Status */}
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Bill ID
                </p>
                <h3 style={{ color: "var(--primary)" }}>{payment.billId}</h3>
              </div>
              <StatusBadge status={payment.status} />
            </div>

            {/* Date and Patient Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Date Issued
                </p>
                <p style={{ color: "var(--text-body)" }}>
                  {payment.dateIssued}
                </p>
              </div>
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Patient Name
                </p>
                <p style={{ color: "var(--text-body)" }}>John Doe</p>
              </div>
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Patient ID
                </p>
                <p style={{ color: "var(--text-body)" }}>P-2024-001</p>
              </div>
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Department
                </p>
                <p style={{ color: "var(--text-body)" }}>
                  {payment.department}
                </p>
              </div>
            </div>

            <Separator />

            {/* Service Items */}
            <div>
              <h4 className="mb-4">Service Breakdown</h4>
              <div className="space-y-3">
                {serviceItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <p style={{ color: "var(--text-body)" }}>{item.name}</p>
                    <p style={{ color: "var(--text-heading)" }}>
                      RM {item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p style={{ color: "var(--text-muted)" }}>Subtotal</p>
                <p style={{ color: "var(--text-body)" }}>
                  RM {subtotal.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: "var(--text-muted)" }}>Tax (8%)</p>
                <p style={{ color: "var(--text-body)" }}>RM {tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <h4>Total Amount</h4>
                <h3 style={{ color: "var(--primary)" }}>
                  RM {total.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDownload}
                className="flex-1 hover:opacity-[50%] cursor-pointer"
                style={{
                  backgroundColor: "var(--btn-primary)",
                  color: "var(--text-on-dark)",
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 hover:bg-[#F5F7FA] cursor-pointer"
                style={{
                  borderColor: "var(--input-border)",
                  color: "var(--text-body)",
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
