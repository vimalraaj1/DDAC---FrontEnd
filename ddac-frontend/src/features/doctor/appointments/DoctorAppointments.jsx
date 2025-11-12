import DoctorNavBar from "../components/DoctorNavBar";
import { useState, useEffect } from "react";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for doctor appointments
        const mockAppointments = [
            {
                id: 1,
                patientName: "John Smith",
                date: "2025-11-12",
                time: "09:00 AM",
                status: "scheduled",
                type: "Consultation"
            },
            {
                id: 2,
                patientName: "Sarah Johnson",
                date: "2025-11-12",
                time: "10:30 AM",
                status: "completed",
                type: "Follow-up"
            },
            {
                id: 3,
                patientName: "Mike Davis",
                date: "2025-11-12",
                time: "02:00 PM",
                status: "scheduled",
                type: "Check-up"
            }
        ];

        // Simulate API call
        setTimeout(() => {
            setAppointments(mockAppointments);
            setLoading(false);
        }, 800);
    }, []);

    const getStatusBadge = (status) => {
        const statusClasses = {
            scheduled: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };

        return `px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-soft">
                <DoctorNavBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading appointments...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-soft">
            <DoctorNavBar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="page-title">My Appointments</h1>
                    <p className="text-gray-neutral text-lg">Manage your patient appointments and schedule.</p>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="section-title">Today's Schedule</h2>
                        <button className="btn-primary">
                            Add Appointment
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-soft">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Patient
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-soft">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment.patientName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.date}</div>
                                            <div className="text-sm text-gray-neutral">{appointment.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={getStatusBadge(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-primary hover:text-primary-hover mr-3">
                                                View
                                            </button>
                                            <button className="text-primary hover:text-primary-hover mr-3">
                                                Edit
                                            </button>
                                            {appointment.status === 'scheduled' && (
                                                <button className="text-green-600 hover:text-green-800">
                                                    Complete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {appointments.length === 0 && (
                        <div className="text-center py-8 text-gray-neutral">
                            No appointments scheduled for today.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}