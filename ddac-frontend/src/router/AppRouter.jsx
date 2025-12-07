import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "../router/ProtectedRoute";
import RoleBasedRedirect from "../features/RoleBasedRedirect";
import CustDashboard from "../features/customer/CustDashboard";
import CustProfile from "../features/customer/profile/CustProfile";
import Appointments from "../features/customer/appointments/Appointments";
import StaffDashboardNew from "../features/staff/dashboard/StaffDashboard";
import PatientList from "../features/staff/patientManagement/PatientList";
import PatientDetails from "../features/staff/patientManagement/PatientDetails";
import PatientForm from "../features/staff/patientManagement/PatientForm";
import AppointmentList from "../features/staff/appointments/AppointmentList";
import AppointmentDetails from "../features/staff/appointments/AppointmentDetails";
import CreateAppointment from "../features/staff/appointments/CreateAppointment";
import PrescriptionForm from "../features/staff/prescriptions/PrescriptionForm";
import PrescriptionList from "../features/staff/prescriptions/PrescriptionList";
import PaymentForm from "../features/staff/payments/PaymentForm";
import PaymentList from "../features/staff/payments/PaymentList";
import PaymentListNew from "../features/staff/payment/PaymentList";
import PaymentDetails from "../features/staff/payment/PaymentDetails";
import PaymentSuccess from "../features/staff/payment/PaymentSuccess";
import PaymentFailed from "../features/staff/payment/PaymentFailed";
import ReceiptDisplay from "../features/staff/payments/ReceiptDisplay";
import DoctorList from "../features/staff/doctorManagement/DoctorList";
import DoctorDetails from "../features/staff/doctorManagement/DoctorDetails";
import CustomerRatings from "../features/staff/ratings/CustomerRatings";
import StaffProfileNew from "../features/staff/profile/StaffProfile";
import EditStaffProfile from "../features/staff/profile/EditStaffProfile";
import DoctorDashboard from "../features/doctor/DoctorDashboard";
import DoctorAppointments from "../features/doctor/appointments/DoctorAppointments";
import DoctorProfile from "../features/doctor/profile/DoctorProfile";
import DoctorPatients from "../features/doctor/patients/DoctorPatients";
import DoctorAnalytics from "../features/doctor/analytics/DoctorAnalytics";
import DoctorSettings from "../features/doctor/settings/DoctorSettings";
import Payments from "../../src/features/customer/payments/Payments.js";
import MedicalRecords from "../features/customer/medicalRecords/MedicalRecords.js";
import Feedbacks from "../features/customer/feedbacks/Feedbacks.js";
import { CustomerProvider } from "../features/customer/CustomerProvider.tsx";
import ManagerDashboard from "../features/manager/ManagerDashboard.jsx";
import DoctorInfo from "../features/manager/doctorInfo/DoctorInfo.jsx";
import AddNewDoctor from "../features/manager/doctorInfo/AddNewDoctor.jsx";
import EditMDoctor from "../features/manager/doctorInfo/EditMDoctor.jsx";
import ViewDoctor from "../features/manager/doctorInfo/ViewDoctor.jsx";
import StaffInfo from "../features/manager/staffInfo/StaffInfo.jsx";
import AddNewStaff from "../features/manager/staffInfo/AddNewStaff.jsx";
import EditMStaff from "../features/manager/staffInfo/EditMStaff.jsx";
import ViewStaff from "../features/manager/staffInfo/ViewStaff.jsx";
import PatientInfo from "../features/manager/patientInfo/PatientInfo.jsx";
import AddNewPatient from "../features/manager/patientInfo/AddNewPatient.jsx";
import EditMPatient from "../features/manager/patientInfo/EditMPatient.jsx";
import ViewPatient from "../features/manager/patientInfo/ViewPatient.jsx";
import AppointmentInfo from "../features/manager/appointmentInfo/AppointmentInfo.jsx";
import AddNewAppointment from "../features/manager/appointmentInfo/AddNewAppointment.jsx";
import EditMAppointment from "../features/manager/appointmentInfo/EditMAppointment.jsx";
import ViewAppointment from "../features/manager/appointmentInfo/ViewAppointment.jsx";
import TransactionInfo from "../features/manager/transactionInfo/TransactionInfo.jsx";
import ViewTransaction from "../features/manager/transactionInfo/ViewTransaction.jsx";
import CommentsInfo from "../features/manager/commentsInfo/CommentsInfo.jsx";
import ViewComments from "../features/manager/commentsInfo/ViewComments.jsx";
import ManagerReports from "../features/manager/report/ManagerReports.jsx";
import FinancialReport from "../features/manager/report/FInancialReport.jsx";
import ManagerProfile from "../features/manager/profile/ManagerProfile.jsx";
import EditManagerProfile from "../features/manager/profile/EditManagerProfile.jsx";
import AppointmentReport from "../features/manager/report/AppointmentReport.jsx";
import DoctorStaffReport from "../features/manager/report/DoctorStaffReport.jsx";
import CustomerReceiptDisplay from "../features/customer/payments/components/CustomerReceiptDisplay.jsx";
import {ManagerProvider} from "../features/manager/ManagerProvider.jsx";

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
          <Route path="/staff/appointments/new" element={<ProtectedRoute allowedRoles={['staff']}><CreateAppointment/></ProtectedRoute>}/>
          <Route path="/staff/doctors" element={<ProtectedRoute allowedRoles={['staff']}><DoctorList/></ProtectedRoute>}/>
          <Route path="/staff/doctors/:id" element={<ProtectedRoute allowedRoles={['staff']}><DoctorDetails/></ProtectedRoute>}/>
          <Route path="/staff/prescriptions" element={<ProtectedRoute allowedRoles={['staff']}><PrescriptionList/></ProtectedRoute>}/>
          <Route path="/staff/prescriptions/new" element={<ProtectedRoute allowedRoles={['staff']}><PrescriptionForm/></ProtectedRoute>}/>
          <Route path="/staff/payment" element={<ProtectedRoute allowedRoles={['staff']}><PaymentListNew/></ProtectedRoute>}/>
          <Route path="/staff/payment/:appointmentId" element={<ProtectedRoute allowedRoles={['staff']}><PaymentDetails/></ProtectedRoute>}/>
          <Route path="/staff/payment/success" element={<ProtectedRoute allowedRoles={['staff']}><PaymentSuccess/></ProtectedRoute>}/>
          <Route path="/staff/payment/failed" element={<ProtectedRoute allowedRoles={['staff']}><PaymentFailed/></ProtectedRoute>}/>
          <Route path="/staff/payments" element={<ProtectedRoute allowedRoles={['staff']}><PaymentList/></ProtectedRoute>}/>
          <Route path="/staff/payments/new" element={<ProtectedRoute allowedRoles={['staff']}><PaymentForm/></ProtectedRoute>}/>
          <Route path="/staff/payments/receipt/view" element={<ProtectedRoute allowedRoles={['staff']}><ReceiptDisplay/></ProtectedRoute>}/>
          <Route path="/staff/ratings" element={<ProtectedRoute allowedRoles={['staff']}><CustomerRatings/></ProtectedRoute>}/>
          <Route path="/staff/ratings/:customerId" element={<ProtectedRoute allowedRoles={['staff']}><CustomerRatings/></ProtectedRoute>}/>
          <Route path="/staff/profile" element={<ProtectedRoute allowedRoles={['staff']}><StaffProfileNew/></ProtectedRoute>}/>
          <Route path="/staff/profile/edit" element={<ProtectedRoute allowedRoles={['staff']}><EditStaffProfile/></ProtectedRoute>}/>

          {/* Staff Routes - Legacy (for backward compatibility) */}
          <Route path="/staffDashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboardNew/></ProtectedRoute>}/>
          <Route path="/staffProfile" element={<ProtectedRoute allowedRoles={['staff']}><StaffProfileNew/></ProtectedRoute>}/>
          <Route path="/staffAppointments" element={<ProtectedRoute allowedRoles={['staff']}><AppointmentList/></ProtectedRoute>}/>
          <Route path="/registerPatient" element={<ProtectedRoute allowedRoles={['staff']}><PatientForm/></ProtectedRoute>}/>
          <Route path="/managePatients" element={<ProtectedRoute allowedRoles={["staff"]}><PatientList /></ProtectedRoute>}/>
          <Route path="/editPatient/:id" element={<ProtectedRoute allowedRoles={["staff"]}><PatientForm /></ProtectedRoute>}/>

        {/* Customer Routes */}
        <Route
          path="/custDashboard"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProvider>
                <CustDashboard />
              </CustomerProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProvider>
                <CustProfile />
              </CustomerProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProvider>
                <Appointments />
              </CustomerProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProvider>
                <Payments />
              </CustomerProvider>
            </ProtectedRoute>
          }
        />


      <Route 
        path="/customer/payments/receipt/view" 
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProvider>
              <CustomerReceiptDisplay/>
            </CustomerProvider>
          </ProtectedRoute>
        }
        />


        <Route
          path="/medicalRecords"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProvider>
                <MedicalRecords />
              </CustomerProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedbacks"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerProvider>
                <Feedbacks />
              </CustomerProvider>
            </ProtectedRoute>
          }
        />
        {/* Doctor Routes */}
        <Route path="/doctorDashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard/></ProtectedRoute>}/>
        <Route path="/doctorAppointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments/></ProtectedRoute>}/>
        <Route path="/doctorPatients" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorPatients/></ProtectedRoute>}/>
        <Route path="/doctorAnalytics" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAnalytics/></ProtectedRoute>}/>
        <Route path="/doctorProfile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfile/></ProtectedRoute>}/>

        {/* Manager Routes */}
        <Route path="/managerDashboard" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ManagerDashboard/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerDoctorInfo" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><DoctorInfo/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerAddNewDoctor" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><AddNewDoctor/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerViewDoctor/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ViewDoctor/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerEditDoctor/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><EditMDoctor/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerStaffInfo" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><StaffInfo/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerAddNewStaff" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><AddNewStaff/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerViewStaff/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ViewStaff/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerEditStaff/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><EditMStaff/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerPatientInfo" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><PatientInfo/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerAddNewPatient" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><AddNewPatient/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerViewPatient/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ViewPatient/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerEditPatient/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><EditMPatient/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerAppointmentInfo" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><AppointmentInfo/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerAddNewAppointment" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><AddNewAppointment/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerViewAppointment/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ViewAppointment/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerEditAppointment/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><EditMAppointment/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerTransactionInfo" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><TransactionInfo/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerViewTransaction/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ViewTransaction/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerCommentsInfo" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><CommentsInfo/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerViewComments/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ViewComments/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerReports" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ManagerReports/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerFinancialReport" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><FinancialReport/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerAppointmentReport" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><AppointmentReport/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerDoctorStaffReport" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><DoctorStaffReport/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerProfile" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><ManagerProfile/></ManagerProvider></ProtectedRoute>}/>
        <Route path="/managerEditProfile/:id" element={<ProtectedRoute allowedRoles={['manager']}><ManagerProvider><EditManagerProfile/></ManagerProvider></ProtectedRoute>}/>
              
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
