import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "../router/ProtectedRoute";
import CustDashboard from "../features/customer/CustDashboard";
import CustProfile from "../features/customer/CustProfile";
import Appointments from "../features/customer/appoinments/Appointments";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>

        <Route path="/custDashboard" element={ <ProtectedRoute><CustDashboard/></ProtectedRoute>}/>
        <Route path="/custProfile" element={<ProtectedRoute><CustProfile/></ProtectedRoute>}/>
        <Route path="/appointments" element={<ProtectedRoute><Appointments/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}
