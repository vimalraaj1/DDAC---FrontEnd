import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { StarRating } from "./StarRating";
import { Button } from "../../components/ui/button";

interface PastFeedbackCardProps {
  id: string;
  patientName: string;
  date: string;
  rating: number;
  feedback: string;
  onViewMore: () => void;
}

export function PastFeedbackCard({ 
  patientName, 
  date, 
  rating, 
  feedback, 
  onViewMore 
}: PastFeedbackCardProps) {
  const initials = patientName === "Anonymous"
    ? "A"
    : patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div 
      className="p-4 rounded-xl border"
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback style={{ backgroundColor: 'var(--accent-teal)', color: 'white' }}>
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p style={{ color: 'var(--text-heading)' }}>{patientName}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{date}</p>
          </div>

          <div className="mb-2">
            <StarRating rating={rating} interactive={false} size="sm" />
          </div>
          
          <p 
            className="text-sm mb-3 line-clamp-2" 
            style={{ color: 'var(--text-body)' }}
          >
            {feedback}
          </p>
          
          <Button
            variant="link"
            onClick={onViewMore}
            className="p-0 h-auto cursor-pointer"
            style={{ color: 'var(--btn-secondary-text)' }}
          >
            View More →
          </Button>
        </div>
      </div>
    </div>
  );
}
