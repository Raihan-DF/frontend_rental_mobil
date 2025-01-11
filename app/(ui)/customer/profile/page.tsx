"use client";
import {
  MyProfile,
  // MyOrder,
  Dashboard,
} from "@/app/sections/profile/menu.section";
import { MyOrder } from "@/app/sections/profile/myOrder.section";
import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { parseAsString, useQueryState } from "nuqs";
import axios from "axios";
import Image from "next/image";

interface profile {
  image: string;
}

export default function Profile() {
  const [activeMenu, setActiveMenu] = useQueryState(
    "page",
    parseAsString.withDefault("General")
  );
  const [profile, setProfile] = useState({ name: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profilImgSrc, setProfilImgSrc] = useState<string | null>(null);

  useEffect(() => {
    // Ambil username dan email dari localStorage
    const email = localStorage.getItem("email");
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.get("/api/auth/user-profile", {
          headers: {
            accessToken: token,
          },
        });

        const result = response.data;
        console.log(result);
        setProfile(result);

        const res = await fetch(
          `http://localhost:5000/file/get?filename=${result.image}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );

        const imageData = await res.blob();

        const objectURL = URL.createObjectURL(imageData);
        setProfilImgSrc(objectURL);
        // } else {
        //   throw new Error('Belum ada profile!');
        // }
      } catch (error: any) {
        setErrorMessage(error.message || "Unable to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Function to render the selected component
  const renderContent = () => {
    switch (activeMenu) {
      case "General":
        return <Dashboard />;
      case "MyProfile":
        return <MyProfile />;
      case "MyOrder":
        return <MyOrder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="pt-24 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu */}
        <div className="bg-gray-200 rounded-lg p-4 h-[370px] flex flex-col justify-between">
          {/* Profile Picture and Info */}
          <div>
            <div className="flex flex-col items-center mb-6">
              {/* Profile Picture with Icon */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-400 flex items-center justify-center">
                <Image
                  alt="Profile"
                  src={profilImgSrc || ""}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                  width={200}
                  height={200}
                />
              </div>

              {/* Username and Email */}
              {isLoading ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : errorMessage ? (
                <p className="text-sm text-red-600">{errorMessage}</p>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">{profile.name}</h2>
                </>
              )}
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
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

              {/* MyProfile */}
              <li>
                <a
                  href="#"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                    activeMenu === "MyProfile"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMenu("MyProfile")}
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

              {/* MyOrder */}
              <li>
                <a
                  href="#"
                  className={`flex items-center gap-2 border-s-[3px] px-4 py-3 ${
                    activeMenu === "MyOrder"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMenu("MyOrder")}
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
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18M3 7h18M3 7h18"
                    />
                  </svg>
                  <span className="text-sm font-medium">MyOrder</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Logout Icon */}
          <div className="mt-auto">
            <button
              onClick={() => {
                localStorage.removeItem("access_token"); // Hapus username dari localStorage
                localStorage.removeItem("refresh_token"); // Hapus username dari localStorage
                localStorage.removeItem("username"); // Hapus username dari localStorage
                Cookie.remove("access_token");
                window.location.href = "/auth/login"; // Redirect ke halaman login
              }}
              className="flex items-center gap-2 w-full border-s-[3px] px-4 py-3 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1.5a1.5 1.5 0 01-3 0V16m0-8V6.5a1.5 1.5 0 013 0V8"
                />
              </svg>
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
