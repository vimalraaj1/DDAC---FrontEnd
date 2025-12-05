import { Badge } from "../../components/ui/badge";

interface StatusBadgeProps {
  status: "Succeed" | "Pending" | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Succeed":
        return {
          backgroundColor: 'var(--accent-success)',
          color: 'white'
        };
      case "Pending":
        return {
          backgroundColor: 'var(--accent-warning)',
          color: 'white'
        };
    }
  };

  const getStatusText = () => {
    if(status != null)
    return status?.charAt(0).toUpperCase() + status?.slice(1);
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
