"use client";
import {
  Dashboard,
  Employee,
  Expense,
} from "@/app/sections/menuOwner/menuOwner.section";
import Income from "@/app/sections/menuOwner/income.section";
import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Image from "next/image";
import Logo from "@/assets/images/LogoCarlink_text.png";

export default function OwnerProfile() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [profile, setProfile] = useState({ name: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSetActiveMenu = (value: string) => setActiveMenu(value);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (username) {
      setProfile({
        name: username,
      });
    } else {
      setErrorMessage("Profile tidak ditemukan");
    }
    setIsLoading(false);
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Employee":
        return <Employee setActiveMenu={handleSetActiveMenu} />;
      case "Income":
        return <Income />;
      case "Expense":
        return <Expense />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="pt-2 pb-24 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Sidebar Menu */}
        <div className="bg-blue-800 rounded-lg p-4 h-[400px] w-[400px] flex flex-col justify-between">
          {/* Profile Picture and Info */}
          <div>
            <div className="flex items-center">
              <Image src={Logo} width={60} height={60} alt="CarLink Logo" />
            </div>

            <ul>
              {/* Dashboard */}
              <li>
                <a
                  href="#"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                    activeMenu === "Dashboard"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMenu("Dashboard")}
                >
                  <span className="text-sm font-medium">Dashboard</span>
                </a>
              </li>

              {/* Employee */}
              <li>
                <a
                  href="#"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                    activeMenu === "Employee"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMenu("Employee")}
                >
                  <span className="text-sm font-medium">Employee</span>
                </a>
              </li>

              {/* Income */}
              <li>
                <a
                  href="#"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                    activeMenu === "Income"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMenu("Income")}
                >
                  <span className="text-sm font-medium">Income</span>
                </a>
              </li>

              {/* Expense */}
              <li>
                <a
                  href="#"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                    activeMenu === "Expense"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMenu("Expense")}
                >
                  <span className="text-sm font-medium">Expense</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Logout Icon */}
          <div className="mt-auto">
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("username");
                Cookie.remove("access_token");
                window.location.href = "/auth/login";
              }}
              className="flex items-center gap-2 w-full border-s-[3px] px-4 py-3 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
            >
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">{renderContent()}</div>
      </div>
    </div>
  );
}
