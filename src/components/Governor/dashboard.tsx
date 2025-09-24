// src/components/Governor/GovernorDashboard.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa";

const GovernorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white text-gray-800 shadow-lg flex flex-col border-l">
        <div className="px-6 py-4 text-2xl font-bold text-center border-b border-gray-200">
          لوحة رئيس الجامعة
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="pending-declarations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive
                ? "bg-blue-600 text-white shadow"
                : "hover:bg-gray-100 hover:text-blue-600"
              }`
            }
          >
            <FaClipboardList className="text-lg" />
            <span>القرارات المعلقة</span>
          </NavLink>

          <NavLink
            to="responded-declarations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive
                ? "bg-green-600 text-white shadow"
                : "hover:bg-gray-100 hover:text-green-600"
              }`
            }
          >
            <FaCheckCircle className="text-lg" />
            <span>القرارات التي تم الرد عليها</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            مرحباً بك 👋
          </h1>
          <div className="flex justify-center">
            <img
              src="../images/SouthVally.png"
              alt="شعار الجامعة"
              className="h-20 w-20 object-contain"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GovernorDashboard;
