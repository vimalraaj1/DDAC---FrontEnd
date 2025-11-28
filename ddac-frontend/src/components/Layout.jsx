import ManagerNavBar from "../features/manager/components/ManagerNavBar.jsx";
import DoctorNavBar from "../features/doctor/components/DoctorNavBar.jsx";
import StaffNavBar from "../features/staff/components/StaffNavBar.jsx";
import CustNavBar from "../features/customer/components/CustNavBar.jsx";
import { useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useContext, useState } from "react";
import { LogOutDialog } from "../features/customer/components/LogoutDialog.js";
import { CustomerContext } from "../features/customer/CustomerContext.js";

export default function Layout({ children, role }) {
    const context = role === "customer" ? useContext(CustomerContext) : null;
    const patient = context?.patient;

  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-main">
      <div className="fixed left-0 top-0 h-min z-11">
        {/* Sidebar */}
        {role === "manager" && <ManagerNavBar />}
        {role === "staff" && <StaffNavBar />}
        {role === "doctor" && <DoctorNavBar />}
        {role === "customer" && <CustNavBar />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-card px-8 py-4 shadow-md">
          <div className="flex justify-end items-center gap-3">
            <div className="text-right">
              <p className="text-heading font-semibold text-sm">
                {role === "customer"
                   ? `${patient?.firstName || "Customer"} ${patient?.lastName || ""}`
                  : localStorage.getItem("userName") || "User"}
              </p>
              <p className="text-muted text-xs capitalize">{role}</p>
            </div>
            <button
              className="w-10 h-10 rounded-full bg-primary text-ondark
                      flex items-center justify-center font-semibold cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <span>
                {role === "customer"
                  ? (patient?.firstName || "U")[0].toUpperCase()
                  : (localStorage.getItem("userName") || "U")[0].toUpperCase()}
              </span>
            </button>
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold
                        bg-accent-danger text-[var(--text-on-dark)]
                        hover:bg-red-700 hover:text-[var(--text-on-dark)] transition duration-150 ease-in-out
                        focus:ring-2 focus:ring-accent-danger focus:ring-opacity-50 cursor-pointer"
            >
              <FaArrowRightFromBracket size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 border-none overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <LogOutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirmLogout={handleLogout}
      />
    </div>
  );
}
