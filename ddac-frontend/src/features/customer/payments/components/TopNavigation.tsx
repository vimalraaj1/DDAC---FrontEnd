import { Hospital, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

export function TopNavigation() {
  return (
    <nav className="sticky top-0 z-50 px-6 py-4 shadow-sm" style={{ backgroundColor: 'var(--bg-topbar)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Hospital Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
            <Hospital className="w-6 h-6" style={{ color: 'var(--text-on-dark)' }} />
          </div>
          <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>
            MediCare Hospital
          </span>
        </div>

        {/* Right: Patient Profile */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              JD
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm" style={{ color: 'var(--text-heading)' }}>John Doe</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Patient ID: P-2024-001</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
