import { Activity, DollarSign, Mail, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const summaryItems = [
  {
    id: 1,
    icon: Stethoscope,
    label: "Past Visits",
    value: "12",
    description: "Total consultations",
  },
  {
    id: 2,
    icon: DollarSign,
    label: "Outstanding Bills",
    value: "$125",
    description: "Pending payment",
  },
  {
    id: 3,
    icon: Mail,
    label: "Messages",
    value: "3",
    description: "From your doctors",
  },
  {
    id: 4,
    icon: Activity,
    label: "Health Score",
    value: "85%",
    description: "Overall wellness",
  },
];

export function HealthSummary() {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <h2 className="text-[#1A1A1A]">Health Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 bg-[#F5F7FA] rounded-xl hover:bg-[#E8F6FD] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#4EA5D9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#7A7A7A] mb-1">{item.label}</p>
                  <p className="text-[#1A1A1A]">{item.value}</p>
                  <p className="text-[#7A7A7A]">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="cursor-pointer w-full border border-[#4EA5D9] text-[#4EA5D9] hover:bg-[#E8F6FD] py-3 px-6 rounded-xl transition-colors"
        onClick={() => navigate("/medicalRecords")}
      >
        View Full Medical History
      </button>
    </div>
  );
}
