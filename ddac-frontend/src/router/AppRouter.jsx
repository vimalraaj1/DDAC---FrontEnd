import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "../router/ProtectedRoute";
import CustDashboard from "../features/customer/CustDashboard";
import CustProfile from "../features/customer/profile/CustProfile";
import Appointments from "../features/customer/appointments/Appointments";
import StaffDashboard from "../features/staff/StaffDashboard";
import StaffProfile from "../features/staff/profile/StaffProfile";
import StaffAppointments from "../features/staff/appointments/StaffAppointments";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        // Auth Routes
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>

        // Staff Routes
        <Route path="/staffDashboard" element={<ProtectedRoute><StaffDashboard/></ProtectedRoute>}/>
        <Route path="/staffProfile" element={<ProtectedRoute><StaffProfile/></ProtectedRoute>}/>
        <Route path="/staffAppointments" element={<ProtectedRoute><StaffAppointments/></ProtectedRoute>}/>

        // Customer Routes
        <Route path="/custDashboard" element={ <ProtectedRoute><CustDashboard/></ProtectedRoute>}/>
        <Route path="/custProfile" element={<ProtectedRoute><CustProfile/></ProtectedRoute>}/>
        <Route path="/appointments" element={<ProtectedRoute><Appointments/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
