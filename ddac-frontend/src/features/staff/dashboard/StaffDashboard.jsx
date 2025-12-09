import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import {
  FaCalendarCheck,
  FaUserPlus,
  FaUsers,
  FaFilePrescription,
  FaCreditCard,
  FaStar,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import * as appointmentService from "../services/appointmentService";
import * as patientService from "../services/patientService";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    scheduledAppointments: 0,
    completedAppointments: 0,
    totalPatients: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const today = new Date();
    const isSameDay = (dateStr) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    };

    try {
      setLoading(true);
      const allAppointments = await appointmentService
        .getAllAppointments()
        .catch(() => []);
      const patients = await patientService.getAllPatients().catch(() => []);

      const scheduledApps =
        allAppointments?.filter(
          (a) => (a.status || "").toLowerCase() === "scheduled"
        ) || [];
      const completedApps =
        allAppointments?.filter(
          (a) => (a.status || "").toLowerCase() === "completed"
        ) || [];
      const todayApps = allAppointments?.filter((a) => isSameDay(a.date)) || [];
      const todayApprovedApps =
        todayApps.filter(
          (a) => (a.status || "").toLowerCase() === "approved"
        ) || [];

      setStats({
        scheduledAppointments: scheduledApps.length,
        completedAppointments: completedApps.length,
        totalPatients: patients.length,
        todayAppointments: todayApps.length,
      });

      setRecentAppointments(todayApprovedApps.slice(0, 5) || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error(
        "Failed to load dashboard data. Some information may be incomplete."
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Scheduled Appointments",
      value: stats.scheduledAppointments,
      icon: FaClock,
      color: "bg-yellow-500",
      link: "/staff/appointments?filter=scheduled",
    },
    {
      title: "Completed Today",
      value: stats.completedAppointments,
      icon: FaCheckCircle,
      color: "bg-green-500",
      link: "/staff/appointments?filter=completed",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: FaUsers,
      color: "bg-blue-500",
      link: "/staff/patients",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaCalendarCheck,
      color: "bg-purple-500",
      link: "/staff/appointments?filter=today",
    },
  ];

  const quickActions = [
    {
      title: "Appointments",
      description: "View and manage appointments",
      icon: FaCalendarCheck,
      link: "/staff/appointments",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Register Patient",
      description: "Create new patient profile",
      icon: FaUserPlus,
      link: "/staff/patients/new",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Manage Patients",
      description: "View and edit patient records",
      icon: FaUsers,
      link: "/staff/patients",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Payments",
      description: "Process payments",
      icon: FaCreditCard,
      link: "/staff/payment",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Ratings",
      description: "View customer ratings",
      icon: FaStar,
      link: "/staff/ratings",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Staff Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={index}
                  to={stat.link}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments (wider) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Today's Appointments
                </h2>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : recentAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {recentAppointments.map((appointment, index) => {
                      const appointmentId = appointment.id || appointment._id;
                      if (!appointmentId) return null;
                      const doctorLabel =
                        appointment.doctorName ||
                        appointment.doctorId ||
                        "Doctor not specified";
                      const patientLabel =
                        appointment.patientName ||
                        appointment.patientId ||
                        "Patient not specified";
                      return (
                        <Link
                          key={index}
                          to={`/staff/appointments/${appointmentId}`}
                          className="block border-l-4 border-blue-500 pl-4 pr-3 py-3 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                <span className="font-medium">
                                  {appointmentId}
                                </span>
                              </p>
                              <p className="text-sm text-gray-600">
                                Patient:{" "}
                                <span className="font-medium">
                                  {patientLabel}
                                </span>
                              </p>
                              <p className="text-sm text-gray-600">
                                Doctor:{" "}
                                <span className="font-medium">
                                  {doctorLabel}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatStaffDate(
                                  appointment.date || new Date()
                                )}
                                {appointment.time
                                  ? ` • ${appointment.time}`
                                  : ""}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                              View details
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No appointments for today</p>
                )}
              </div>
            </div>

            {/* Quick Actions (narrower) */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        to={action.link}
                        className={`${action.color} p-3 rounded-lg hover:opacity-80 transition-opacity flex items-center gap-3`}
                      >
                        <Icon size={22} />
                        <div>
                          <h3 className="font-semibold text-sm">
                            {action.title}
                          </h3>
                          <p className="text-xs opacity-80">
                            {action.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
