"use client";
import { MyProfile, MyOrder,Dashboard } from "@/app/sections/profile/menu.section";
import { useState } from "react";


export default function Profile() {
  // State to keep track of the selected menu item
  const [activeMenu, setActiveMenu] = useState("General");

  // Function to render the selected component
  const renderContent = () => {
    switch (activeMenu) {
      case "General":
        return <Dashboard />;
      case "Teams":
        return <MyProfile />;
      case "Billing":
        return <MyOrder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="pt-24 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu */}
        <div className="bg-gray-200 rounded-lg p-4">
          {/* Profile Picture and Info */}
          <div className="flex flex-col items-center mb-6">
            {/* Profile Picture with Icon */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                />
              </svg>
            </div>

            {/* Username and Email */}
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-sm text-gray-600">john.doe@example.com</p>
          </div>

          <ul>
            {/* General */}
            <li>
              <a
                href="#"
                className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                  activeMenu === "General"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => setActiveMenu("General")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li>

            {/* Teams */}
            <li>
              <a
                href="#"
                className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                  activeMenu === "Teams"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => setActiveMenu("Teams")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm font-medium">MyProfile</span>
              </a>
            </li>

            {/* Billing */}
            <li>
              <a
                href="#"
                className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                  activeMenu === "Billing"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => setActiveMenu("Billing")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-sm font-medium">My Order</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-200 rounded-lg lg:col-span-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
