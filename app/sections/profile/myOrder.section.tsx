import { useState, useEffect } from "react";
import { BookingOrder } from "@/app/sections/profile/myorderContent/bookingOrder/bookingOrder.section";
import { BookingCompleted } from "@/app/sections/profile/myorderContent/bookingCompleted/bookingCompleted.section";
import { BookingCanceled } from "./myorderContent/bookingCanceled/bookingCanceled.section";

// interface Booking {
//   id: number;
//   vehicle: {
//     name: string;
//   };
//   pickupLocation: string;
//   pickupDateTime: string;
//   duration: number;
//   payment: {
//     status: "PENDING" | "COMPLETED";
//   };
// }

function MyOrder() {


  const [activeTab, setActiveTab] = useState("Booking Order");

  const tabs = ["Booking Order", "Booking Completed", "Booking Cancel"];

  const renderContent = () => {
    switch (activeTab) {
      case "Booking Order":
        return <BookingOrder />;
      case "Booking Completed":
        return <BookingCompleted />;
      case "Booking Cancel":
        return <BookingCanceled />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Mobile Tabs */}
      <div className="sm:hidden">
        <label htmlFor="Tab" className="sr-only">
          Tab
        </label>
        <select
          id="Tab"
          className="w-full rounded-md border-gray-200"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 p-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}

export { MyOrder };
