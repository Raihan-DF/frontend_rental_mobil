"use client";
import { useState } from "react";
import Link from "next/link";
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
import Vehicles from "@/app/(ui)/admin/components/features/vehicles";
import WithoutDriver from "@/app/(ui)/admin/components/features/bookingWithoutdriver";
import WithDriver from "@/app/(ui)/admin/components/features/bookingWithdriver";
import Payments from "@/app/(ui)/admin/components/features/payment";
import Expense from "@/app/(ui)/admin/components/features/expense";
import Maintenance from "@/app/(ui)/admin/components/features/maintenance";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<string>("");

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu === activeMenu ? "" : menu);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span style={{ color: "green" }} className="font-bold">
                CarLink
              </span>
              <span className=""> (Admin)</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("dashboard")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            {/* Dropdown untuk Booking */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start flex items-center gap-3 px-3 py-2 rounded-lg ${
                      activeMenu === "booking"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Booking
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuItem
                    onClick={() => handleMenuClick("withDriver")}
                  >
                    With Driver
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleMenuClick("withoutDriver")}
                  >
                    Without Driver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "payment"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("payment")}
            >
              <CreditCard className="h-4 w-4" />
              Payment
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "vehicles"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("vehicles")}
            >
              <Package2 className="h-4 w-4" />
              Vehicles
            </Link>
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "driver"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleMenuClick("driver")}
            >
              <Users className="h-4 w-4" />
              Driver Assignment
            </Link>
            {/* Maintenance */}
            <Link
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeMenu === "maintenance"
                  ? "text-primary"
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
                  ? "text-primary"
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
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {activeMenu === "dashboard" && <div>Dashboard Content</div>}
          {activeMenu === "withDriver" && <WithDriver />}
          {activeMenu === "withoutDriver" && <WithoutDriver />}
          {activeMenu === "payment" && <Payments />}
          {activeMenu === "vehicles" && <Vehicles />}
          {activeMenu === "maintenance" && <Maintenance/>}
          {activeMenu === "expense" && <Expense/>}
        </main>
      </div>
    </div>
  );
}
