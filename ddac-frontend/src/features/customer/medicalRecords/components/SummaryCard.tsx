import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  iconColor?: string;
}

export function SummaryCard({ icon: Icon, value, label, iconColor = 'var(--healthcare-primary)' }: SummaryCardProps) {
  return (
    <div 
      className="p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      style={{ backgroundColor: 'var(--healthcare-bg-white)' }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#E8F6FD]"
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <div className="font-medium mb-1" style={{ color: 'var(--healthcare-text-dark)' }}>
            {value}
          </div>
          <div className="text-sm" style={{ color: 'var(--healthcare-text-light)' }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
