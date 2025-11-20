import { Calendar, ClipboardList, CreditCard, Star } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    id: 1,
    icon: Calendar,
    label: "Book Appointment",
    description: "Schedule a new visit",
    path: "/appointments",
  },
  {
    id: 2,
    icon: ClipboardList,
    label: "View Appointments",
    description: "See your schedule",
    path: "/appointments",
  },
  {
    id: 3,
    icon: CreditCard,
    label: "Payment History",
    description: "Track your bills",
    path: "/payments",
  },
  {
    id: 4,
    icon: Star,
    label: "Give Feedback",
    description: "Share your experience",
    path: "/feedbacks",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              to={action.path}
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-left group hover:border hover:border-[#4EA5D9]"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-[#E8F6FD] rounded-xl flex items-center justify-center group-hover:bg-[#DCEFFB] transition-colors">
                  <Icon className="w-7 h-7 text-[#4EA5D9]" />
                </div>
                <div>
                  <p className="text-[#1A1A1A] mb-1">{action.label}</p>
                  <p className="text-[#7A7A7A]">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
