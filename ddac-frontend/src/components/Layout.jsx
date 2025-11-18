import { Outlet } from "react-router-dom";
import CustNavBar from "../features/customer/components/CustNavBar";

export default function Layout({ showNav = false, showFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNav && <CustNavBar />}
      
      <main className="flex-1">
        <Outlet />
      </main>

      {showFooter && (
        <footer className="bg-gray-soft border-t border-gray-200 py-6 mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-neutral text-sm">
              © 2024 DDAC. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

