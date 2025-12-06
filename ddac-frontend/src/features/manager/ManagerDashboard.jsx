import { Link } from "react-router-dom";
import ManagerNavBar from "./components/ManagerNavBar.jsx";
import '../../themes/mng.css';
import '../../index.css';
import Layout from '../../components/Layout.jsx';
import {FaCalendarCheck, FaHome} from "react-icons/fa";
import {FaUserDoctor, FaHourglassHalf, FaUserGroup} from "react-icons/fa6";
import AppointmentsLineChart from "./components/AppointmentsLineChart.jsx";
import DepartmentPieChart from "./components/DoctorsByDepartmentPieChart.jsx";
import {useEffect, useMemo, useState} from "react";
import {getDoctors} from "../../services/doctorManagementService.js";
import {getPatients} from "../../services/patientManagementService.js";
import {getStaffs} from "../../services/staffManagementService.js";
import {getAppointments, GetAppointmentsWithDetails} from "../../services/appointmentManagementService.js";

export default function ManagerDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        getDashboardData();
    }, [])
    
    const getDashboardData = async () => {
        setLoading(true);
        setError(null);
        try{
            // Promise.all() is used to run all APIs simultaneously
            const [doctorsData, patientsData, staffsData, appointmentsData] = await Promise.all([
                getDoctors(),
                getPatients(),
                getStaffs(),
                GetAppointmentsWithDetails(),
            ]);
            if (!Array.isArray(doctorsData) || !Array.isArray(patientsData) ||
                !Array.isArray(staffsData) || !Array.isArray(appointmentsData)) {
                throw new Error('One or more data sources returned an invalid format.');
            }
            setDoctors(doctorsData);
            setPatients(patientsData);
            setStaffs(staffsData);
            setAppointments(appointmentsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', err);
            setError(error.message || 'Failed to load dashboard data.');
            setDoctors([]);
            setPatients([]);
            setStaffs([]);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }
    
    const appointmentsData = useMemo(() => {
        if (appointments.length === 0) return [];
        const countsMap = appointments.reduce((acc, appointment) => {
            const date = appointment.date;
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(countsMap).map((key) => ({
            date: key,
            appointments: countsMap[key],
        }))
    }, [appointments]);
    
    const doctorsBySpecialization = useMemo(() => {
        if (doctors.length === 0) return [];
        const countsMap = doctors.reduce((acc, doctor) => {
            const spec = doctor.specialization || "Unassigned";
            acc[spec] = (acc[spec] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(countsMap).map(key => ({
            name: key,
            value: countsMap[key]
        }));
    }, [doctors]);

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading dashboard information...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // Error state
    if (error) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FaHome size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Dashboard</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getDashboardData}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }
    
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
                        <h3 className="text-heading text-3xl font-bold mb-1">{appointments.length}</h3>
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
                        <h3 className="text-heading text-3xl font-bold mb-1">{doctors.filter(d => d.status.toLowerCase() === 'active').length}</h3>
                        <p className="text-muted text-sm">Active Doctors</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-card rounded-xl shadow-soft p-6  hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg mb-4">
                                <FaUserGroup size={24} className="text-ondark"/>
                            </div>
                            {/*<span className="text-accent-warning text-sm font-semibold">7 pending</span>*/}
                        <h3 className="text-heading text-3xl font-bold mb-1">{staffs.filter(s => s.status.toLowerCase() === 'active').length}</h3>
                        <p className="text-muted text-sm">Active Staffs</p>
                    </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-card rounded-xl shadow-soft p-6  hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg mb-4">
                                <FaCalendarCheck size={24} className="text-ondark"/>
                            </div>
                            {/*<span className="text-accent-danger text-sm font-semibold">2 critical</span>*/}
                        <h3 className="text-heading text-3xl font-bold mb-1">{patients.length}</h3>
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
                            <DepartmentPieChart data={doctorsBySpecialization} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}