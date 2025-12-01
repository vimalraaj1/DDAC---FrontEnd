import { CustomerProvider } from "./features/customer/CustomerProvider";
import AppRouter from "./router/AppRouter";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function App() {
  useEffect(() => {
    // On app load, check if user is logged in and set theme
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      document.documentElement.className = `theme-${userRole}`;
    }
  }, []);
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
}
