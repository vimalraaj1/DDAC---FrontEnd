import CustNavBar from "./components/CustNavBar";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { FaLocationDot, FaUserDoctor } from "react-icons/fa6";
import { MdOutlinePayments, MdFeedback } from "react-icons/md";

export default function CustDashboard() {
  const name = localStorage.getItem("userName") || "Customer";

  return (
    <div className="min-h-screen bg-gray-soft">
      <CustNavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="page-title">Welcome back, {name}</h1>
          <p className="text-gray-neutral text-lg">
            Manage your appointments, health records, and payments in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Book Appointment */}
          <Link
            to="/appointments"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center gap-1">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                <FaCalendarAlt color="blue"/>
              </div>

              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                Book Appointment
              </h3>
              <p className="text-sm text-gray-neutral">Schedule a new visit.</p>
            </div>
          </Link>

          {/* View Appointments */}
          <Link
            to="/custProfile"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                 <FaUserDoctor color="blue"/>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  View Appointments
                </h3>
                <p className="text-sm text-gray-neutral">See your schedule</p>
              </div>
            </div>
          </Link>

          {/* Payment History */}
          <Link
            to="/custProfile"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                 <MdOutlinePayments color="blue"/>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Payment History
                </h3>
                <p className="text-sm text-gray-neutral">Track your bills</p>
              </div>
            </div>
          </Link>

          {/* Give Feedback */}
          <Link
            to="/custProfile"
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                 <MdFeedback color="blue"/>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Give Feedback
                </h3>
                <p className="text-sm text-gray-neutral">
                  Share your experience
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 card">
          <h2 className="section-title">Your Next Appointment</h2>
          <div className="justify-between items-center flex">
            <div className="flex flex-row items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <h3 className="text-primary font-semibold text-lg">ST</h3>
              </div>
              <div className="flex flex-col">
                <h3>Dr. Sarah Tan</h3>
                <h3 className="text-sm text-gray-neutral">Cardiologist</h3>
              </div>
            </div>
            <div>
              <h3 className=" px-5 py-2 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                Confirmed
              </h3>
            </div>
          </div>
          <div className="space-y-2 text-gray-neutral">
            {/* Date */}
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <p>Tuesday, 14 Nov 2025</p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
              <FaClock />
              <p>10:30 AM</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FaLocationDot />
              <p>Building A, Room 304</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
