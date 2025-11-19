import { Link, useNavigate } from "react-router-dom";
import { LogOutDialog } from "./LogoutDialog";
import { useState } from "react";

export default function CustNavBar() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navigate = useNavigate();

  const confirmedLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <Link
              to="/custDashboard"
              className="text-xl font-semibold text-primary hover:text-[#3B82F6] transition-colors"
            >
              Wellspring Healthcare
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/custDashboard"
              className="text-gray-neutral hover:text-primary transition-colors font-medium hover:bg-[#F5F7FA] cursor-pointer px-2 py-5 "
            >
              Dashboard
            </Link>
            <Link
              to="/appointments"
              className="text-gray-neutral hover:text-primary transition-colors font-medium hover:bg-[#F5F7FA] cursor-pointer px-2 py-5"
            >
              Appointments
            </Link>
            <Link
              to="/payments"
              className="text-gray-neutral hover:text-primary transition-colors font-medium hover:bg-[#F5F7FA] cursor-pointer px-2 py-5"
            >
              Payments
            </Link>
            <Link
              to="/feedbacks"
              className="text-gray-neutral hover:text-primary transition-colors font-medium hover:bg-[#F5F7FA] cursor-pointer px-2 py-5"
            >
              Feedbacks
            </Link>
            <Link
              to="/profile"
              className="text-gray-neutral hover:text-primary transition-colors font-medium hover:bg-[#F5F7FA] cursor-pointer px-2 py-5"
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
        </div>
        <LogOutDialog
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
          onConfirmLogout={confirmedLogout}
        />
      </div>
    </nav>
  );
}
