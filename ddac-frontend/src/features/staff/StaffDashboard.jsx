import StaffNavBar from "./components/StaffNavBar";
import { Link } from "react-router-dom";

export default function CustDashboard() {
    return (
        <div className="min-h-screen bg-gray-soft">
            <StaffNavBar/>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="page-title">Welcome to the Staff Dashboard</h1>
                    <p className="text-gray-neutral text-lg">Manage your appointments and profile from here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link 
                        to="/staffAppointments" 
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
                                <p className="text-sm text-gray-neutral">View and manage your appointments</p>
                            </div>
                        </div>
                    </Link>

                    <Link 
                        to="/registerPatient" 
                        className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">Register Patient</h3>
                                <p className="text-sm text-gray-neutral">Register new patients</p>
                            </div>
                        </div>
                    </Link>

                    <Link 
                        to="/staffProfile" 
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

                    <div className="card">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gray-soft p-3 rounded-lg">
                                <svg className="w-6 h-6 text-gray-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Coming Soon</h3>
                                <p className="text-sm text-gray-neutral">More features on the way</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 card">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="space-y-2 text-gray-neutral">
                        <p>• Register new patients</p>
                        <p>• Add new appointments</p>
                        <p>• View your bookings</p>
                        <p>• Update your profile information</p>
                    </div>
            </div>
        </div>
    </div>
  );
}