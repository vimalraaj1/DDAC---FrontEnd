import { LogOutDialog } from "./LogoutDialog";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserInjured,
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaFileUpload,
  FaStethoscope,
  FaFileMedical,
  FaUser,
} from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import {
  FaUserDoctor,
  FaRightFromBracket,
  FaUserGroup,
  FaHospital,
} from "react-icons/fa6";

export default function CustNavBar({ role = "customer" }) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navigate = useNavigate();

  const confirmedLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { icon: FaHome, label: "Dashboard", path: "/CustDashboard" },
    {
      icon: FaFileMedical,
      label: "Medical Record",
      path: "/medicalRecords",
    },
    { icon: FaCalendarCheck, label: "Appointments", path: "/appointments" },
    { icon: FaFileInvoiceDollar, label: "Payments", path: "/payments" },
    { icon: MdFeedback, label: "Feedback", path: "/feedbacks" },
    { icon: FaUser, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="bg-primary w-64 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-primary-hover">
        <Link to={`/${role}Dashboard`} className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-2">
            <FaHospital className="text-primary" size={24} />
          </div>
          <h1 className="text-ondark text-xl font-bold">
            WellSpring Healthcare
          </h1>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg
                                        transition-all duration-200 font-medium
                                        ${
                                          isActive
                                            ? "bg-white bg-opacity-10 text-body"
                                            : "text-ondark text-opacity-80 bg-primary hover:bg-[var(--bg-main)] hover:text-[var(--text-body)]"
                                        }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <LogOutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirmLogout={confirmedLogout}
      />
    </aside>
  );
}
