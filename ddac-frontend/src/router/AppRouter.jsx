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
// New staff module components
import StaffDashboardNew from "../features/staff/dashboard/StaffDashboard";
import PatientList from "../features/staff/patientManagement/PatientList";
import PatientDetails from "../features/staff/patientManagement/PatientDetails";
import PatientForm from "../features/staff/patientManagement/PatientForm";
import AppointmentList from "../features/staff/appointments/AppointmentList";
import AppointmentDetails from "../features/staff/appointments/AppointmentDetails";
import PrescriptionForm from "../features/staff/prescriptions/PrescriptionForm";
import PrescriptionList from "../features/staff/prescriptions/PrescriptionList";
import PaymentForm from "../features/staff/payments/PaymentForm";
import PaymentList from "../features/staff/payments/PaymentList";
import CustomerRatings from "../features/staff/ratings/CustomerRatings";
import StaffProfileNew from "../features/staff/profile/StaffProfile";
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

        {/* Staff Routes - New Nested Structure */}
        <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboardNew/></ProtectedRoute>}/>
        <Route path="/staff/patients" element={<ProtectedRoute allowedRoles={['staff']}><PatientList/></ProtectedRoute>}/>
        <Route path="/staff/patients/new" element={<ProtectedRoute allowedRoles={['staff']}><PatientForm/></ProtectedRoute>}/>
        <Route path="/staff/patients/:id" element={<ProtectedRoute allowedRoles={['staff']}><PatientDetails/></ProtectedRoute>}/>
        <Route path="/staff/patients/:id/edit" element={<ProtectedRoute allowedRoles={['staff']}><PatientForm/></ProtectedRoute>}/>
        <Route path="/staff/appointments" element={<ProtectedRoute allowedRoles={['staff']}><AppointmentList/></ProtectedRoute>}/>
        <Route path="/staff/appointments/:id" element={<ProtectedRoute allowedRoles={['staff']}><AppointmentDetails/></ProtectedRoute>}/>
        <Route path="/staff/prescriptions" element={<ProtectedRoute allowedRoles={['staff']}><PrescriptionList/></ProtectedRoute>}/>
        <Route path="/staff/prescriptions/new" element={<ProtectedRoute allowedRoles={['staff']}><PrescriptionForm/></ProtectedRoute>}/>
        <Route path="/staff/payments" element={<ProtectedRoute allowedRoles={['staff']}><PaymentList/></ProtectedRoute>}/>
        <Route path="/staff/payments/new" element={<ProtectedRoute allowedRoles={['staff']}><PaymentForm/></ProtectedRoute>}/>
        <Route path="/staff/ratings" element={<ProtectedRoute allowedRoles={['staff']}><CustomerRatings/></ProtectedRoute>}/>
        <Route path="/staff/ratings/:customerId" element={<ProtectedRoute allowedRoles={['staff']}><CustomerRatings/></ProtectedRoute>}/>
        <Route path="/staff/profile" element={<ProtectedRoute allowedRoles={['staff']}><StaffProfileNew/></ProtectedRoute>}/>

        {/* Staff Routes - Legacy (for backward compatibility) */}
        <Route path="/staffDashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboardNew/></ProtectedRoute>}/>
        <Route path="/staffProfile" element={<ProtectedRoute allowedRoles={['staff']}><StaffProfileNew/></ProtectedRoute>}/>
        <Route path="/staffAppointments" element={<ProtectedRoute allowedRoles={['staff']}><AppointmentList/></ProtectedRoute>}/>
        <Route path="/registerPatient" element={<ProtectedRoute allowedRoles={['staff']}><PatientForm/></ProtectedRoute>}/>
        <Route path="/managePatients" element={<ProtectedRoute allowedRoles={["staff"]}><PatientList /></ProtectedRoute>}/>
        <Route path="/editPatient/:id" element={<ProtectedRoute allowedRoles={["staff"]}><PatientForm /></ProtectedRoute>}/>

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
