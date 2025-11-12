import { Link, useNavigate } from "react-router-dom";

export default function CustNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
              DDAC
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/custDashboard" 
              className="text-gray-neutral hover:text-primary transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/appointments" 
              className="text-gray-neutral hover:text-primary transition-colors font-medium"
            >
              Appointments
            </Link>
            <Link 
              to="/custProfile" 
              className="text-gray-neutral hover:text-primary transition-colors font-medium"
            >
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
