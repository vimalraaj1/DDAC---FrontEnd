import { useState, useEffect } from "react";
import { getPatientById } from "../../services/patientManagementService";
import { CustomerContext } from "./CustomerContext";

export function CustomerProvider({children}){
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) fetchPatient(id);
        else setLoading(false);
    }, []);

    const fetchPatient = async (id) => {
        try{
            const data = await getPatientById(id);
            setPatient(data);
        }finally{
            setLoading(false);
        }
    }

    return (
        <CustomerContext.Provider value={{patient, setPatient, loading}}>
            {children}
        </CustomerContext.Provider>

    );
}

