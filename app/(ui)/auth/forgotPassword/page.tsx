"use client"
import { useState } from "react";
import { useFormik } from "formik"; // Import Formik
import * as Yup from "yup"; // Import Yup untuk validasi
import { toast, ToastContainer } from 'react-toastify'; // Untuk menampilkan notifikasi
import 'react-toastify/dist/ReactToastify.css'; // Import gaya untuk notifikasi toast

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false); // State untuk loading

  // Skema validasi menggunakan Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email tidak valid") // Pesan jika format email salah
      .required("Email wajib diisi"), // Pesan jika email tidak diisi
  });

  // Formik untuk mengelola form dan validasi
  const formik = useFormik({
    initialValues: {
      email: '', // Nilai awal email
    },
    validationSchema, // Validasi form menggunakan Yup
    onSubmit: async (values) => {
      setLoading(true); // Mengatur loading menjadi true
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: values.email }), // Mengirim email yang diinput
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Cek email Anda untuk mengatur ulang kata sandi!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Setelah notifikasi selesai, redirect ke halaman login
          setTimeout(() => {
            window.location.href = "/auth/login"; // Redirect ke halaman login
          }, 3000);
        } else {
          toast.error(data.message || 'Terjadi kesalahan, coba lagi nanti.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('Error during forgot password:', error);
        toast.error('Terjadi kesalahan, coba lagi nanti.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false); // Mengatur loading menjadi false setelah selesai
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br ">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Masukkan email yang terdaftar untuk menerima instruksi reset kata sandi.
        </p>
        {/* Form menggunakan Formik */}
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email} // Bind value dari Formik
              onChange={formik.handleChange} // Meng-handle perubahan
              onBlur={formik.handleBlur} // Meng-handle blur (untuk validasi real-time)
              className={`mt-1 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Masukkan email Anda"
              required
            />
            {/* Menampilkan pesan error jika ada */}
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            ) : null}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-lime-500 text-white rounded-lg shadow-md hover:bg-lime-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50"
              disabled={loading} // Tombol disable ketika loading
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'Cek Email'
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer /> {/* Untuk menampilkan notifikasi */}
    </div>
  );
}
