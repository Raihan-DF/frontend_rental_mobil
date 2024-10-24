import { useState } from "react";
import ChangePasswordModal from "../../components/modal/changePassword/page";

function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <p>This is your profile information.</p>
    </div>
  );
}

function MyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold flex justify-between items-center">
        My Profile
      </h2>
      <p>Welcome to the my profile section!</p>

      {/* Profile Edit Form */}
      <section className="bg-gray-100 mt-4">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form action="#" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Name"
                    type="text"
                    id="name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                    Address
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Address"
                    type="text"
                    id="address"
                  />
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 p-3 text-sm"
                      placeholder="Phone Number"
                      type="tel"
                      id="phone"
                    />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="inline-block rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    type="submit"
                    className="inline-block rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>

                {/* Change Password Link */}
                <div className="flex justify-end mt-4">
                  <a
                    href="#"
                    className="text-sm text-blue-500 hover:underline"
                    onClick={openModal}
                  >
                    Change Password
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Change Password Modal */}
      <ChangePasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

function MyOrder() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">My Order</h2>
      <p>Here are your orders.</p>
    </div>
  );
}

export { Dashboard, MyProfile, MyOrder };
