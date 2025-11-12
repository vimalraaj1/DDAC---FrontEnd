import React from 'react';
import { Navigate } from "react-router-dom";


const RoleBasedRedirect = () => {
    const userRole = localStorage.getItem("userRole");

    switch(userRole) {
        case 'doctor':
            return <Navigate to="/doctorDashboard" replace />;
        case 'staff':
            return <Navigate to="/staffDashboard" replace />;
        case 'customer':
            return <Navigate to="/custDashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default RoleBasedRedirect;