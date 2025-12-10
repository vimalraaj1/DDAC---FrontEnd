import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUserInjured,
    FaCalendarCheck,
    FaFileInvoiceDollar,
    FaFileUpload,
    FaStethoscope, FaUserCircle,
} from "react-icons/fa";
import {FaUserDoctor, FaUserGroup, FaHospital, FaMessage} from "react-icons/fa6";
import wellspring_logo from "../../../assets/wellspring_logo.png"

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
        { icon: FaUserDoctor, label: "Doctors", path: "/managerDoctorInfo" },
        { icon: FaUserGroup, label: "Staffs", path: "/managerStaffInfo" },
        { icon: FaUserInjured, label: "Patients", path: "/managerPatientInfo" },
        { icon: FaCalendarCheck, label: "Appointments", path: "/managerAppointmentInfo" },
        { icon: FaFileInvoiceDollar, label: "Transactions", path: "/managerTransactionInfo" },
        { icon: FaMessage, label: "Comments", path: "/managerCommentsInfo" },
        { icon: FaFileUpload, label: "Reports", path: "/managerReports" },
        { icon: FaUserCircle, label: "Profile", path: "/managerProfile" },
    ];

    //const items = menuItems;

    return (
        <aside className="bg-primary w-64 min-h-screen flex flex-col">
            {/* Logo/Brand */}
            <div className="p-1 border-primary-hover flex justify-center items-center">
                <Link to={`/${role}Dashboard`} className="flex items-center gap-3">
                    {<img src={wellspring_logo} alt="WellSpring Healthcare Logo" className="w-35 h-auto content-center" />}
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-2">
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