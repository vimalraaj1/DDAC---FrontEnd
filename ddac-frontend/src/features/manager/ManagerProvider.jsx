import {useState, useEffect, ReactNode, useContext, createContext} from "react";
import { getManagerById } from "../../services/managerManagementService";


export const ManagerContext = createContext(null);

export function useManager() {
    const context = useContext(ManagerContext);
    if (context === null) {
        throw new Error('useManager must be used within a ManagerProvider');
    }
    return context;
}
export function ManagerProvider({ children }){
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) {
            fetchManager(id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchManager = async (id) => {
        try{
            const data = await getManagerById(id);
            setManager(data);
        } catch(err){
            console.error("Error fetching manager: ", err);
        } finally{
            setLoading(false);
        }
    }

    return (
        <ManagerContext.Provider value={{manager, setManager, loading}}>
            {children}
        </ManagerContext.Provider>
    );
}

