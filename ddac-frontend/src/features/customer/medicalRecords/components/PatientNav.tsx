import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function PatientNav() {
  return (
    <nav className="sticky top-0 z-50 border-b" style={{ 
      backgroundColor: 'var(--healthcare-bg-light)', 
      borderColor: 'var(--healthcare-border)' 
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--healthcare-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2V18M2 10H18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-medium" style={{ color: 'var(--healthcare-text-dark)' }}>
              Patient Portal
            </span>
          </div>

          {/* Center: Page Title */}
          <div className="hidden md:block">
            <h1 className="font-medium" style={{ color: 'var(--healthcare-text-medium)' }}>
              Medical Records
            </h1>
          </div>

          {/* Right: Patient Avatar & Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Sarah Johnson" />
                <AvatarFallback style={{ backgroundColor: 'var(--healthcare-primary-light)', color: 'var(--healthcare-primary-dark)' }}>
                  SJ
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline" style={{ color: 'var(--healthcare-text-dark)' }}>
                Sarah Johnson
              </span>
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--healthcare-text-light)' }} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Appointments</DropdownMenuItem>
              <DropdownMenuItem>Medical Records</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
