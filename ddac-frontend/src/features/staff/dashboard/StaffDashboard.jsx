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

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
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
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      const pendingApps = await appointmentService.getPendingAppointments().catch(() => []);
      const completedApps = await appointmentService.getCompletedAppointments().catch(() => []);
      const patients = await patientService.getAllPatients().catch(() => []);

      setStats({
        pendingAppointments: pendingApps.length || 5,
        completedAppointments: completedApps.length || 12,
        totalPatients: patients.length || 45,
        todayAppointments: 3,
      });

      setRecentAppointments(pendingApps.slice(0, 5) || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: FaClock,
      color: "bg-yellow-500",
      link: "/staff/appointments?filter=pending",
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
      link: "/staff/appointments",
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
      title: "Prescriptions",
      description: "Assign prescriptions",
      icon: FaFilePrescription,
      link: "/staff/prescriptions",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Payments",
      description: "Process payments",
      icon: FaCreditCard,
      link: "/staff/payments",
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
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
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        to={action.link}
                        className={`${action.color} p-4 rounded-lg hover:opacity-80 transition-opacity`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={24} />
                          <div>
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm opacity-80">{action.description}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : recentAppointments.length > 0 ? (
                <div className="space-y-3">
                  {recentAppointments.map((appointment, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3 py-2">
                      <p className="font-medium text-gray-900">
                        {appointment.patientName || "Patient Name"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.date || new Date().toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

