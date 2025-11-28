import { Link } from "react-router-dom";
import ManagerNavBar from "./components/ManagerNavBar.jsx";
import '../../themes/mng.css';
import '../../index.css';
import Layout from '../../components/Layout.jsx';
import {FaCalendarCheck} from "react-icons/fa";
import {FaUserDoctor, FaHourglassHalf} from "react-icons/fa6";
import AppointmentsLineChart from "./components/AppointmentsLineChart.jsx";
import DepartmentPieChart from "./components/DoctorsByDepartmentPieChart.jsx";

const appointmentsData = [
    { date: "2025-11-10", appointments: 5 },
    { date: "2025-11-11", appointments: 18 },
    { date: "2025-11-12", appointments: 14 },
    { date: "2025-11-13", appointments: 22 },
    { date: "2025-11-14", appointments: 20 },
    { date: "2025-11-15", appointments: 26 },
    { date: "2025-11-16", appointments: 30 }
];

const doctorsByDept = [
    { name: "Cardiology", value: 12 },
    { name: "General", value: 18 },
    { name: "Pediatrics", value: 6 },
    { name: "Orthopedics", value: 4 },
    { name: "Dermatology", value: 2 },
    { name: "Surgeon", value: 2 }
];

export default function ManagerDashboard() {
    return (
        <Layout role="manager">
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Manager Dashboard</h1>
                    <p className="text-muted mt-1">WellSpring Healthcare Management Overview</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-card rounded-xl shadow-soft p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg mb-4">
                                <FaCalendarCheck size={24} className="text-ondark"/>
                            </div>
                            {/*<span className="text-accent-success text-sm font-semibold">+12%</span>*/}
                        <h3 className="text-heading text-3xl font-bold mb-1">248</h3>
                        <p className="text-muted text-sm">Total Appointments</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-card rounded-xl shadow-soft p-6  hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg mb-4">
                                <FaUserDoctor size={24} className="text-ondark"/>
                            </div>
                            {/*<span className="text-accent-success text-sm font-semibold">+3</span>*/}
                        <h3 className="text-heading text-3xl font-bold mb-1">42</h3>
                        <p className="text-muted text-sm">Active Doctors</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-card rounded-xl shadow-soft p-6  hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg mb-4">
                                <FaHourglassHalf size={24} className="text-ondark"/>
                            </div>
                            {/*<span className="text-accent-warning text-sm font-semibold">7 pending</span>*/}
                        <h3 className="text-heading text-3xl font-bold mb-1">15</h3>
                        <p className="text-muted text-sm">Pending Approvals</p>
                    </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-card rounded-xl shadow-soft p-6  hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg mb-4">
                                <FaCalendarCheck size={24} className="text-ondark"/>
                            </div>
                            {/*<span className="text-accent-danger text-sm font-semibold">2 critical</span>*/}
                        <h3 className="text-heading text-3xl font-bold mb-1">5</h3>
                        <p className="text-muted text-sm">Patients Check-In</p>
                    </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1 */}
                    <div className="bg-card rounded-xl shadow-soft p-6 ">
                        <h3 className="text-heading text-lg font-semibold mb-4">Appointments Overview</h3>
                        <div className="h-64">
                            <AppointmentsLineChart data={appointmentsData} />
                        </div>
                    </div>

                    {/* Chart 2 */}
                    <div className="bg-card rounded-xl shadow-soft p-6 ">
                        <h3 className="text-heading text-lg font-semibold mb-4">Department Distribution</h3>
                        <div className="h-64">
                            <DepartmentPieChart data={doctorsByDept} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}