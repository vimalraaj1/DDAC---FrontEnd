import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOutDialog } from "../../customer/components/LogoutDialog";
import { useState } from "react";
import {
  FaHome,
  FaCalendarCheck,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaFilePrescription,
  FaCreditCard,
  FaStar,
} from "react-icons/fa";
import { FaHospital } from "react-icons/fa6";
import wellspring_logo from "../../../assets/wellspring_logo.png"

export default function StaffNavBar({ role = "staff" }) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const confirmedLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { icon: FaHome, label: "Dashboard", path: "/staff/dashboard" },
    { icon: FaUsers, label: "Patients", path: "/staff/patients" },
    {
      icon: FaCalendarCheck,
      label: "Appointments",
      path: "/staff/appointments",
    },
    { icon: FaUser, label: "Doctors", path: "/staff/doctors" },
    // { icon: FaFilePrescription, label: "Prescriptions", path: "/staff/prescriptions" },
    { icon: FaCreditCard, label: "Payment", path: "/staff/payment" },
    { icon: FaStar, label: "Ratings", path: "/staff/ratings" },
    { icon: FaUser, label: "Profile", path: "/staff/profile" },
  ];

  return (
    <aside className="bg-primary w-64 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-1 border-primary-hover flex justify-center items-center">
        <Link to={`/${role}Dashboard`} className="flex items-center gap-3">
          {
            <img
              src={wellspring_logo}
              alt="WellSpring Healthcare Logo"
              className="w-35 h-auto content-center"
            />
          }
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

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
