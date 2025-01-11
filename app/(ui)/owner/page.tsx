"use client";
import { useState } from "react";
import Link from "next/link";
import Cookie from "js-cookie";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package2,
  ShoppingCart,
  Users,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/images/LogoCarlink_text.png";

import { Badge } from "@/app/(ui)/admin/components/ui/badge";
import { Button } from "@/app/(ui)/admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/(ui)/admin/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/app/(ui)/admin/components/ui/sheet";
import { ModeToggle } from "@/app/(ui)/admin/components/ui/mode-toggle";
import Income from "@/app/(ui)/owner/components/features/income";
import Expense from "@/app/(ui)/owner/components/features/expense";
import Maintenance from "@/app/(ui)/owner/components/features/maintenance";
import Employee from "@/app/(ui)/owner/components/features/employee";
import DashboardOwner from "@/app/(ui)/owner/components/features/dashboard";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<string>("");

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu === activeMenu ? "" : menu);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="bg-[#3C4D55] hidden border-r bg-muted/40 md:block text-white">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {/* <Package2 className="h-6 w-6" /> */}
              <div className="flex items-center">
                <Image src={Logo} width={120} height={100} alt="CarLink Logo" />
              </div>
              {/* <span style={{ color: "#C8F904" }} className="font-bold">
                CarLink
              </span> */}
              {/* <span className=""> (Owner)</span> */}
            </Link>
          </div>
          <nav className="grid items-start px-2 text-lg font-medium lg:px-4">
            {/* dashboard */}
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "dashboard"
                  ? "bg-[#0F212B] text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("dashboard")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            {/* Employee */}
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "employee"
                  ? "bg-[#0F212B] text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("employee")}
            >
              <Home className="h-4 w-4" />
              Employee
            </Link>
            {/* Income */}
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "income"
                  ? "bg-[#0F212B] text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("income")}
            >
              <CreditCard className="h-4 w-4" />
              Income
            </Link>
            {/* Maintenance */}
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "maintenance"
                  ? "bg-[#0F212B] text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("maintenance")}
            >
              <Package2 className="h-4 w-4" />
              Maintenance
            </Link>
            {/* Expense */}
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "expense"
                  ? "bg-[#0F212B] text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("expense")}
            >
              <LineChart className="h-4 w-4" />
              Expense
            </Link>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#">Mobile Menu Items</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-4">
          <span className="text-lg font-Kumbh font-bold">Owner</span>
            {" "}
            {/* Kontainer baru untuk mengelompokkan konten ke kanan */}
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("access_token"); // Hapus token
                    localStorage.removeItem("refresh_token"); // Hapus token
                    localStorage.removeItem("username"); // Hapus username
                    Cookie.remove("access_token");
                    window.location.href = "/auth/login"; // Redirect ke halaman login
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {activeMenu === "dashboard" && <DashboardOwner/>}
          {activeMenu === "employee" && <Employee setActiveMenu={function (value: string): void {
            throw new Error("Function not implemented.");
          } }/>}
          {activeMenu === "income" && <Income />}
          {activeMenu === "maintenance" && <Maintenance />}
          {activeMenu === "expense" && <Expense />}
        </main>
      </div>
    </div>
  );
}
