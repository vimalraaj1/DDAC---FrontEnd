import { Link, useNavigate } from "react-router-dom";

export default function ManagerNavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
};

return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-1">
                    <Link
                        to="/managerDashboard"
                        className="text-xl font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                        DDAC
                    </Link>
                </div>

                <div className="flex items-center space-x-6">
                    <Link
                        to="/managerDashboard"
                        className="text-gray-neutral hover:text-primary transition-colors font-medium"
                    >
                        Dashboard
                    </Link>
                    {/*<Link*/}
                    {/*    to="/doctorAppointments"*/}
                    {/*    className="text-gray-neutral hover:text-primary transition-colors font-medium"*/}
                    {/*>*/}
                    {/*    Appointments*/}
                    {/*</Link>*/}
                    <Link
                        to="/managerPatients"
                        className="text-gray-neutral hover:text-primary transition-colors font-medium"
                    >
                        Patients
                    </Link>
                    <Link
                        to="/managerProfile"
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