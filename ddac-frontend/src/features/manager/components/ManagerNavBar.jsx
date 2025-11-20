import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUserInjured,
    FaCalendarCheck,
    FaFileInvoiceDollar,
    FaFileUpload,
    FaStethoscope,
} from "react-icons/fa";
import {FaUserDoctor, FaRightFromBracket, FaUserGroup, FaHospital} from "react-icons/fa6";

export default function ManagerNavBar({ role = "manager" }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/login");
    };
    
    const menuItems = [
        { icon: FaHome, label: "Dashboard", path: "/managerDashboard" },
        { icon: FaUserDoctor, label: "Doctors", path: "/managerDoctors" },
        { icon: FaUserGroup, label: "Staffs", path: "/managerStaffs" },
        { icon: FaUserInjured, label: "Patients", path: "/managerPatients" },
        { icon: FaCalendarCheck, label: "Appointments", path: "/managerAppointments" },
        { icon: FaFileInvoiceDollar, label: "Payments", path: "/managerPayments" },
        { icon: FaFileUpload, label: "Reports", path: "/managerReports" },
    ];

    //const items = menuItems;

    return (
        <aside className="bg-primary w-64 min-h-screen flex flex-col">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-primary-hover">
                <Link to={`/${role}Dashboard`} className="flex items-center gap-3">
                    <div className="bg-white rounded-lg p-2">
                        <FaHospital className="text-primary" size={24} />
                    </div>
                    <h1 className="text-ondark text-xl font-bold">WellSpring Healthcare</h1>
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
                                        ${isActive
                                            ? 'bg-white bg-opacity-10 text-body'
                                            : 'text-ondark text-opacity-80 bg-primary hover:bg-[var(--bg-main)] hover:text-[var(--text-body)]'
                                        }
                  `                 }
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section */}
            {/*<div className="p-4 border-t border-primary-hover">*/}
            {/*    <div className="flex items-center gap-3 px-4 py-3 text-ondark">*/}
            {/*        <div className="bg-white bg-opacity-20 rounded-full p-2">*/}
            {/*            <FaUserCircle size={24} />*/}
            {/*        </div>*/}
            {/*        <div className="flex-1">*/}
            {/*            <p className="font-medium text-sm">*/}
            {/*                {localStorage.getItem("userName") || "User"}*/}
            {/*            </p>*/}
            {/*            <p className="text-xs text-ondark text-opacity-70 capitalize">*/}
            {/*                {role}*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            
            {/*    <button*/}
            {/*        onClick={handleLogout}*/}
            {/*        className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg*/}
            {/*       text-ondark text-opacity-80 */}
            {/*       transition-all duration-200 font-medium*/}
            {/*       hover:bg-white hover:bg-opacity-5 hover:text-body*/}
            {/*       hover:text-[var(--text-body)]"*/}
            {/*    >*/}
            {/*        <FaRightFromBracket size={20} />*/}
            {/*        <span>Logout</span>*/}
            {/*    </button>*/}
            {/*</div>*/}
        </aside>
    );
}