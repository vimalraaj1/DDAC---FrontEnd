import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "../router/ProtectedRoute";
import RoleBasedRedirect from "../features/RoleBasedRedirect";
import CustDashboard from "../features/customer/CustDashboard";
import CustProfile from "../features/customer/profile/CustProfile";
import Appointments from "../features/customer/appointments/Appointments";
import StaffDashboard from "../features/staff/StaffDashboard";
import StaffProfile from "../features/staff/profile/StaffProfile";
import StaffAppointments from "../features/staff/appointments/StaffAppointments";
import ManagePatients from "../features/staff/patientManagement/ManagePatients";
import EditPatient from "../features/staff/patientManagement/EditPatientForm";
import RegisterPatient from "../features/staff/patientManagement/RegisterPatient";
import DoctorDashboard from "../features/doctor/DoctorDashboard";
import DoctorAppointments from "../features/doctor/appointments/DoctorAppointments";
import DoctorProfile from "../features/doctor/profile/DoctorProfile";
import DoctorPatients from "../features/doctor/patients/DoctorPatients";
import DoctorAnalytics from "../features/doctor/analytics/DoctorAnalytics";
import ManagerDashboard from "../features/manager/ManagerDashboard.jsx";
import DoctorInfo from "../features/manager/DoctorInfo.jsx";
import Payments from "../../src/features/customer/payments/Payments.js";
import MedicalRecords from "../features/customer/medicalRecords/MedicalRecords.js";
import Feedbacks from "../features/customer/feedbacks/Feedbacks.js";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/role-based-redirect" element={<RoleBasedRedirect />}/>

        {/* Staff Routes */}
        <Route path="/staffDashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard/></ProtectedRoute>}/>
        <Route path="/staffProfile" element={<ProtectedRoute allowedRoles={['staff']}><StaffProfile/></ProtectedRoute>}/>
        <Route path="/staffAppointments" element={<ProtectedRoute allowedRoles={['staff']}><StaffAppointments/></ProtectedRoute>}/>
        <Route path="/registerPatient" element={<ProtectedRoute allowedRoles={['staff']}><RegisterPatient/></ProtectedRoute>}/>
        <Route path="/managePatients" element={<ProtectedRoute allowedRoles={["staff"]}><ManagePatients /></ProtectedRoute>}/>
        <Route path="/editPatient/:id" element={<ProtectedRoute allowedRoles={["staff"]}><EditPatient /></ProtectedRoute>}/>

        {/* Customer Routes */}
        <Route path="/custDashboard" element={ <ProtectedRoute allowedRoles={['customer']}><CustDashboard/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer']}><CustProfile/></ProtectedRoute>}/>
        <Route path="/appointments" element={<ProtectedRoute allowedRoles={['customer']}><Appointments/></ProtectedRoute>}/>
        <Route path="/payments" element={<ProtectedRoute allowedRoles={['customer']}><Payments/></ProtectedRoute>}/>
        <Route path="/medicalRecords" element={<ProtectedRoute allowedRoles={['customer']}><MedicalRecords/></ProtectedRoute>}/>
        <Route path="/feedbacks" element={<ProtectedRoute allowedRoles={['customer']}><Feedbacks/></ProtectedRoute>}/>

        {/* Doctor Routes */}
        <Route path="/doctorDashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard/></ProtectedRoute>}/>
        <Route path="/doctorAppointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments/></ProtectedRoute>}/>
        <Route path="/doctorPatients" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPatients/></ProtectedRoute>}/>
        <Route path="/doctorAnalytics" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAnalytics/></ProtectedRoute>}/>
        <Route path="/doctorProfile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfile/></ProtectedRoute>}/>

        {/* Manager Routes */}
        <Route path="/managerDashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard/></ProtectedRoute>}/>
        <Route path="/managerDoctorInfo" element={<ProtectedRoute allowedRoles={['manager']}><DoctorInfo/></ProtectedRoute>}/>
        <Route path="/managerStaffInfo" element={<ProtectedRoute allowedRoles={['manager']}><DoctorInfo/></ProtectedRoute>}/>
        <Route path="/managerPatientInfo" element={<ProtectedRoute allowedRoles={['manager']}><DoctorInfo/></ProtectedRoute>}/>
        <Route path="/managerAppointments" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard/></ProtectedRoute>}/>
        <Route path="/managerProfile" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard/></ProtectedRoute>}/>
        
        {/* Unauthorized Route */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
