import DoctorNavBar from "./components/DoctorNavBar";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
    return (
        <div className="min-h-screen bg-gray-soft">
            <DoctorNavBar/>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="page-title">Welcome to the Doctor Dashboard</h1>
                    <p className="text-gray-neutral text-lg">Manage your patients, appointments and profile from here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link 
                        to="/doctorAppointments" 
                        className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Appointments</h3>
                                <p className="text-sm text-gray-neutral">View and manage patient appointments</p>
                            </div>
                        </div>
                    </Link>

                    <Link 
                        to="/doctorPatients" 
                        className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Patients</h3>
                                <p className="text-sm text-gray-neutral">View patient records and history</p>
                            </div>
                        </div>
                    </Link>

                    <Link 
                        to="/doctorProfile" 
                        className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Profile</h3>
                                <p className="text-sm text-gray-neutral">Update your personal information</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-8 card">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="space-y-2 text-gray-neutral">
                        <p>• View today's appointments</p>
                        <p>• Access patient records</p>
                        <p>• Update your availability</p>
                        <p>• Manage medical notes</p>
                    </div>
                </div>
            </div>
        </div>
    )
}