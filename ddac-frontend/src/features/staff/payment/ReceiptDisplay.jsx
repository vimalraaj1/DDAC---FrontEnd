import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import { getPaymentById } from "../services/paymentService";
import { getAppointmentById } from "../services/appointmentService";
import { FaPrint, FaDownload, FaReceipt, FaArrowLeft } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReceiptDisplay() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const appointmentId = searchParams.get("appointmentId");
  const navigate = useNavigate();
  const printRef = useRef();
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (transactionId || appointmentId) {
      loadReceiptData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId, appointmentId]);

  const loadReceiptData = async () => {
    try {
      setLoading(true);
      
      // If appointmentId is provided, get transaction from appointment
      if (appointmentId && !transactionId) {
        const apptData = await getAppointmentById(appointmentId);
        if (apptData) {
          setAppointment(apptData);
          // Try to get transaction for this appointment
          const { getPaymentsByAppointment } = await import("../services/paymentService");
          const transactions = await getPaymentsByAppointment(appointmentId);
          const paidTransaction = transactions?.find(t => t.status === 'Paid');
          if (paidTransaction) {
            setTransaction(paidTransaction);
            if (paidTransaction.receipt) {
              const receiptData = typeof paidTransaction.receipt === 'string' 
                ? JSON.parse(paidTransaction.receipt) 
                : paidTransaction.receipt;
              setReceipt(receiptData);
            }
            setLoading(false);
            return;
          }
        }
      }
      
      // Load transaction by transactionId
      if (transactionId) {
        const txnData = await getPaymentById(transactionId);
        
        // Only allow viewing receipts for Paid transactions
        if (txnData.status !== 'Paid') {
          alert("Receipt can only be generated for paid transactions");
          navigate(-1);
          return;
        }
        
        setTransaction(txnData);
        
        // Parse receipt data
        if (txnData.receipt) {
          const receiptData = typeof txnData.receipt === 'string' 
            ? JSON.parse(txnData.receipt) 
            : txnData.receipt;
          setReceipt(receiptData);
        }
        
        // Load appointment details
        if (txnData.appointmentId) {
          const apptData = await getAppointmentById(txnData.appointmentId);
          setAppointment(apptData);
        }
      }
      
    } catch (error) {
      console.error("Error loading receipt:", error);
      alert("Failed to load receipt details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = printRef.current;
      
      // Temporarily add a style tag to override oklch colors
      const styleOverride = document.createElement('style');
      styleOverride.id = 'pdf-color-override';
      styleOverride.innerHTML = `
        * {
          color: inherit !important;
        }
        .text-gray-900, .text-heading { color: #111827 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600, .text-muted { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-blue-600 { color: #2563eb !important; }
        .text-green-800 { color: #166534 !important; }
        .text-red-600 { color: #dc2626 !important; }
        .bg-white, .bg-card { background-color: #ffffff !important; }
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-green-100 { background-color: #dcfce7 !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
        .border-gray-300 { border-color: #d1d5db !important; }
      `;
      document.head.appendChild(styleOverride);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return element.classList?.contains('no-pdf');
        }
      });
      
      // Remove the override style
      document.head.removeChild(styleOverride);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Receipt_${transaction?.id || appointmentId}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-MY', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `RM ${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Layout role="staff">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading receipt...</div>
        </div>
      </Layout>
    );
  }

  if (!transaction || !receipt) {
    return (
      <Layout role="staff">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">Receipt not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Action Buttons - Hidden in print */}
          <div className="mb-6 flex gap-4 print:hidden">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaDownload /> Download PDF
            </button>
          </div>

          {/* Receipt Content - Printable */}
          <div ref={printRef} className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <FaReceipt className="text-blue-600 text-3xl" />
                <h1 className="text-3xl font-bold text-gray-900">Payment Receipt</h1>
              </div>
              <p className="text-gray-600">Healthcare Management System</p>
              <p className="text-sm text-gray-500 mt-2">Transaction ID: {transaction.id}</p>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Transaction Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Date:</span> {formatDate(transaction.paymentTime)}</p>
                  <p><span className="text-gray-600">Time:</span> {formatTime(transaction.paymentTime)}</p>
                  <p><span className="text-gray-600">Status: </span> 
                    <span className="text-gray-600">
                      {transaction.status}
                    </span>
                  </p>
                  <p><span className="text-gray-600">Payment Method:</span> {transaction.paymentMethod || 'N/A'}</p>
                  {transaction.cardLast4 && (
                    <p><span className="text-gray-600">Card:</span> **** **** **** {transaction.cardLast4}</p>
                  )}
                </div>
              </div>

              {appointment && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Appointment Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Appointment ID:</span> {appointment.id}</p>
                    <p><span className="text-gray-600">Date:</span> {formatDate(appointment.date)}</p>
                    <p><span className="text-gray-600">Purpose:</span> {appointment.purpose || 'General Consultation'}</p>
                    <p><span className="text-gray-600">Doctor ID:</span> {appointment.doctorId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Receipt Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-4 text-lg border-b pb-2">Itemized Charges</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-700">Description</th>
                    <th className="text-right py-2 text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(receipt).map(([key, value], index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 capitalize">{key.replace(/_/g, ' ')}</td>
                      <td className="py-3 text-right font-semibold">{formatCurrency(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatCurrency(transaction.amount)}</span>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">
                Currency: {transaction.currency}
              </p>
            </div>

            {/* Notes */}
            {transaction.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
                <p className="text-sm text-gray-600">{transaction.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
              <p>Thank you for your payment!</p>
              <p className="mt-2">For inquiries, please contact our support team.</p>
              <p className="mt-4 text-xs">This is a computer-generated receipt and requires no signature.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${printRef.current} * {
            visibility: visible;
          }
          ${printRef.current} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}

