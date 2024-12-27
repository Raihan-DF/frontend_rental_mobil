"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../assets/images/logofix.png";
import { usePathname } from "next/navigation";
import Cookie from "js-cookie";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false); // Tambahkan state untuk mobile menu
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll position
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen); // Toggle mobile menu
  const currentPath = usePathname();

  const checkRoutes = () => {
    if (
      currentPath.includes("/auth") ||
      currentPath.includes("/admin") ||
      currentPath.includes("/owner")
    ) {
      return true;
    }
    return false;
  };

  const checkAndRequestAccessToken = async (
    accessToken: string | null,
    refreshToken: string | null
  ) => {
    try {
      if (accessToken !== null) {
        const response = await fetch("/api/auth/check-access-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        });

        const result = await response.json();

        if (result.message !== "OK" && response.status !== 400) {
          Cookie.set("access_token", result.accessToken);
          localStorage.setItem("access_token", result.accessToken);
          localStorage.setItem("refresh_token", result.refreshToken);
        }
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    checkAndRequestAccessToken(access_token, refresh_token);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <header
        className={
          checkRoutes()
            ? "hidden"
            : `fixed top-0 left-1/2 transform -translate-x-1/2 w-full shadow z-10 transition-colors duration-300 ${
                isScrolled ? "bg-white" : "bg-transparent"
              }`
        }
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <a className="block" href="/" style={{ color: "#0F212B" }}>
                <div className="flex items-center">
                  <Image src={Logo} width={60} height={60} alt="CarLink Logo" />
                  <h1 className="ml-1 font-semibold text-xl">Carlink</h1>
                </div>
              </a>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a
                      className={`transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1 ${
                        isScrolled ? "text-black" : "text-black"
                      } hover:text-green-500`}
                      href="/"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      className={`transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1 ${
                        isScrolled ? "text-black" : "text-black"
                      } hover:text-green-500`}
                      href="/general/vehicles"
                    >
                      Vehicles
                    </a>
                  </li>
                  {/* <li>
                    <a
                      className={`transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1 ${
                        isScrolled ? "text-black" : "text-black"
                      } hover:text-green-500`}
                      href="/general/booking"
                    >
                      Booking
                    </a>
                  </li> */}
                  <li>
                    <a
                      className={`transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1 ${
                        isScrolled ? "text-black" : "text-black"
                      } hover:text-green-500`}
                      href="#"
                    >
                      Contacts
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {accessToken !== null ? (
                <a
                  href="/customer/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                </a>
              ) : (
                <div className="hidden sm:flex sm:gap-4">
                  <a
                    className="rounded-md px-5 py-2.5 text-sm font-medium text-white shadow"
                    style={{ background: "#0F212B" }}
                    href="/auth/login"
                  >
                    Login
                  </a>
                  <a
                    className="rounded-md px-5 py-2.5 text-sm font-medium"
                    style={{ color: "#0F212B", outline: "1px solid #0F212B" }}
                    href="/auth/register"
                  >
                    Register
                  </a>
                </div>
              )}

              <div className="block md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="rounded p-2 text-gray-600 transition hover:text-black/75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <nav aria-label="Global" className="p-4">
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    className="block text-black hover:text-green-500 transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1"
                    href="/"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className="block text-black hover:text-green-500 transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1"
                    href="#"
                  >
                    Vehicles
                  </a>
                </li>
                <li>
                  <a
                    className="block text-black hover:text-green-500 transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1"
                    href="#"
                  >
                    Booking
                  </a>
                </li>
                <li>
                  <a
                    className="block text-black hover:text-green-500 transition focus:bg-gray-200 active:bg-green-500 rounded-md px-2 py-1"
                    href="#"
                  >
                    Contacts
                  </a>
                </li>
              </ul>
              {accessToken !== null ? (
                "SUDAH LOGIN"
              ) : (
                <div className=" mt-2 flex gap-2 ">
                  <a
                    className="block rounded-md px-5 py-2.5 text-sm font-medium text-white shadow"
                    style={{ background: "#0F212B" }}
                    href="/auth/login"
                  >
                    Login
                  </a>
                  <a
                    className="block rounded-md px-5 py-2.5 text-sm font-medium"
                    style={{ color: "#0F212B", outline: "1px solid #0F212B" }}
                    href="/auth/register"
                  >
                    Register
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
