import React from 'react';
import { useEffect } from 'react';
import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
        // Set theme class on HTML element
        if (userRole) {
            document.documentElement.className = `theme-${userRole}`;
        }
    }, [userRole]);

    // Redirect based on role
    switch(userRole) {
        case 'doctor':
            return <Navigate to="/doctorDashboard" replace />;
        case 'staff':
            return <Navigate to="/staffDashboard" replace />;
        case 'customer':
            return <Navigate to="/custDashboard" replace />;
        case 'manager':
            return <Navigate to="/managerDashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default RoleBasedRedirect;