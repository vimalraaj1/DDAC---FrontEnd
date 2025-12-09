export default function StatusBadge({ status }) {
  const statusConfig = {
    scheduled: { color: "bg-yellow-100 text-yellow-800", label: "Scheduled" },
    approved: { color: "bg-green-100 text-green-800", label: "Approved" },
    rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    completed: { color: "bg-blue-100 text-blue-800", label: "Completed" },
    cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    "no show": { color: "bg-orange-100 text-orange-800", label: "No Show" },
    "no-show": { color: "bg-orange-100 text-orange-800", label: "No Show" },
    paid: { color: "bg-green-100 text-green-800", label: "Paid" },
    unpaid: { color: "bg-orange-100 text-orange-800", label: "Unpaid" },
    active: { color: "bg-green-100 text-green-800", label: "Active" },
    inactive: { color: "bg-gray-200 text-gray-700", label: "Inactive" },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    color: "bg-gray-100 text-gray-800",
    label: status || "Unknown",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

