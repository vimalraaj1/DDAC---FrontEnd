import React from 'react';
import { useEffect } from 'react';
import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
        switch(userRole) {
            case 'doctor':
                import("../themes/doctor.css");
                break;
            case 'staff':
                import("../themes/staff.css");
                break;
            case 'customer':
                import("../themes/patient.css");
                break;
            case 'manager':
                import("../themes/manager.css");
                break;
            default:
                break;
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