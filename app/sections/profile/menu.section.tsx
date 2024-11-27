import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePasswordModal from "../../components/modal/changePassword/page";
import { UploadFile, delete_file } from "@/app/actApi/uploadFile";
import axios from "axios";
import Image from "next/image";

function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
    </div>
  );
}

function MyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    phone: "",
    image: "", // Add image field to state
  });
  const [isEditable, setIsEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Store selected file

  const [profilImgSrc, setProfilImgSrc] = useState<string | null>();
  const [previousProfilImgSrc, setPreviousProfilImgSrc] = useState<
    string | null
  >();

  const [newProfileImg, setNewProfileImg] = useState<File>();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

        // if (response.ok) {
        //   const data = await response.json();
        //   setProfile({
        //     name: data.name,
        //     address: data.address,
        //     phone: data.phone,
        //     image: data.image, // Set image from response
        //   });
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
        setPreviousProfilImgSrc(objectURL);
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

  const handleEditClick = () => {
    setIsEditable((prev) => !prev);
  };

  const handleSaveClick = async (event: any) => {
    event.preventDefault();

    // Validasi panjang nomor telepon
    if (profile.phone.length < 10 || profile.phone.length > 12) {
      setErrorMessage("Nomor Telphone harus 10-12 angka");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) throw new Error("User not authenticated");

    const formFile = new FormData();
    if (typeof newProfileImg !== "undefined" || newProfileImg !== undefined) {
      formFile.append("file", newProfileImg);
    }
    try {
      let profil_gambar = profile.image;
      console.log(profil_gambar);
      if (typeof newProfileImg !== "undefined" || newProfileImg !== undefined) {
        if (profil_gambar || profil_gambar !== "" || profil_gambar !== null) {
          await delete_file(profil_gambar, token);
        }
        const resultUploadFile = await UploadFile(formFile, token);
        profil_gambar = resultUploadFile.img_path;
        console.log("Berhasil upload", profil_gambar);
      }

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("address", profile.address);
      formData.append("phone", profile.phone);
      if (selectedImage) {
        //
        console.log(selectedImage);
        console.log(profil_gambar);

        formData.append("image", profil_gambar);
      }

      // const response = await fetch('/api/auth/update-profile', {
      //   method: 'POST',
      //   headers: {
      //     'accessToken': `${token}`,
      //   },
      //   body: JSON.stringify({
      //     "name": profile.name,
      //     "address": profile.address,
      //     "phone": profile.phone,
      //     "image": profil_gambar
      //   }), // Send as FormData to handle file upload
      // });

      const payload = {
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        image: profil_gambar,
      };

      const response = await axios.put(`/api/auth/update-profile`, payload, {
        headers: {
          accessToken: token,
        },
      });

      // const result = await response.json();
      const result = response.data;
      console.log(result);

      // if (!response.ok) {
      //   throw new Error('Gagal update profile');
      // }

      setIsEditable(false);
      setErrorMessage("");
      toast.success("Profile berhasil di Update!");
    } catch (error) {
      console.log(error);
      setErrorMessage("Gagal Save Profile!");
    }
  };

  const handleChange = (event: any) => {
    const { id, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImg(file);
      setProfilImgSrc(URL.createObjectURL(file));
      setProfile((prevProfile) => ({
        ...prevProfile,
        image: URL.createObjectURL(file), // Preview the selected image
      }));
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h2 className="text-xl font-bold flex justify-between items-center mx-4">
        My Profile
      </h2>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading profile data...</p>
      ) : (
        <section className="mt-4">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5 mx-4 mb-2">
            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-5 lg:p-12">
              <form className="space-y-4" onSubmit={handleSaveClick}>
                {/* Display Profile Image */}
                <div className="text-center mb-4">
                  <Image
                    src={
                      profilImgSrc ||
                      `https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg`
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                    width={200}
                    height={200}
                  />
                  {isEditable && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Nama
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Name"
                    type="text"
                    id="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="address"
                  >
                    Alamat
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Address"
                    type="text"
                    id="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="phone"
                  >
                    Nomor Telp
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Phone Number"
                    type="tel"
                    id="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className={`inline-block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80
                                ${
                                  isEditable
                                    ? "border-red-600 bg-red-600"
                                    : "border-green-600 bg-green-600"
                                }`}
                  >
                    {isEditable ? "Cancel" : "Edit"}
                  </button>

                  {isEditable && (
                    <button
                      type="submit"
                      className="inline-block rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:underline"
                    onClick={openModal}
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      <ChangePasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default MyProfile;


interface Booking {
  id: number;
  vehicle: {
    name: string;
  };
  pickupLocation: string;
  pickupDateTime: string;
  duration: number;
  payment: {
    status: "PENDING" | "COMPLETED";
  };
}

function MyOrder() {
  const [bookings, setBookings] = useState<Booking[]>([]);


  useEffect(() => {
    // Fetch data dari API
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings/pending"); // Endpoint API
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {booking.vehicle.name}
              </h3>
              <p>
                <strong>Pickup Location:</strong> {booking.pickupLocation}
              </p>
              <p>
                <strong>Pickup Date:</strong>{" "}
                {new Date(booking.pickupDateTime).toLocaleString()}
              </p>
              <p>
                <strong>Duration:</strong> {booking.duration} days
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    booking.payment.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {booking.payment.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending bookings found.</p>
      )}
    </div>
  );
}

export { Dashboard, MyProfile, MyOrder };
