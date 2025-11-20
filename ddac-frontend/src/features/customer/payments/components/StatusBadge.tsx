import { Badge } from "../../components/ui/badge";

interface StatusBadgeProps {
  status: "paid" | "pending" | "overdue";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "paid":
        return {
          backgroundColor: 'var(--accent-success)',
          color: 'white'
        };
      case "pending":
        return {
          backgroundColor: 'var(--accent-warning)',
          color: 'white'
        };
      case "overdue":
        return {
          backgroundColor: 'var(--accent-danger)',
          color: 'white'
        };
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge 
      style={getStatusStyles()}
      className="px-3 py-1"
    >
      {getStatusText()}
    </Badge>
  );
}
