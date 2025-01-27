"use client"
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify'; // Untuk notifikasi
import { useSearchParams } from "next/navigation"; // Untuk mendapatkan parameter URL
import * as Yup from 'yup'; // Import Yup untuk validasi
import { useFormik } from 'formik'; // Import Formik untuk handling form
import 'react-toastify/dist/ReactToastify.css'; // Stylesheet untuk toastify

// Validasi password menggunakan Yup
const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password harus minimal 6 karakter') // Minimal 8 karakter
    .matches(/[A-Za-z]/, 'Password harus mengandung huruf') // Harus ada huruf
    .matches(/[0-9]/, 'Password harus mengandung angka') // Harus ada angka
    .required('Password wajib diisi'), // Password wajib diisi
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'),], 'Kata sandi tidak cocok') // Harus sesuai dengan password
    .required('Konfirmasi password wajib diisi'), // Konfirmasi password wajib diisi
});

export default function ResetPassword() {
  const [loading, setLoading] = useState(false); // State untuk proses loading
  const search = useSearchParams(); // Mengambil parameter dari URL
  const token = search.get("token"); // Mendapatkan token dari parameter URL

  // Formik untuk menangani form reset password
  const formik = useFormik({
    initialValues: {
      password: '', // Nilai awal untuk password
      confirmPassword: '', // Nilai awal untuk konfirmasi password
    },
    validationSchema, // Skema validasi yang digunakan
    onSubmit: async (values) => {
      setLoading(true); // Mengatur state loading menjadi true

      try {
        // Mengirim permintaan POST ke endpoint reset-password
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token, newPassword: values.password }), // Mengirim token dan password baru
        });

        const data = await response.json(); // Parsing respon dari server

        if (response.ok) {
          toast.success('Kata sandi berhasil diubah!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Redirect ke halaman login setelah 3 detik
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        } else {
          toast.error(data.message || 'Gagal mengubah kata sandi.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('Error during password reset:', error);
        toast.error('Terjadi kesalahan, coba lagi nanti.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false); // Menghentikan loading setelah proses selesai
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br">
      {/* Wrapper untuk form reset password */}
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Masukkan password baru Anda dan konfirmasi.
        </p>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {/* Input untuk password baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <input 
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange} // Meng-handle perubahan value
              onBlur={formik.handleBlur} // Meng-handle blur (validasi ketika blur)
              className={`mt-1 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
              placeholder="Masukkan password baru"
            />
            {/* Menampilkan pesan error jika ada */}
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
            ) : null}
          </div>
          {/* Input untuk konfirmasi password baru */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi Password Baru
            </label>
            <input 
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
              placeholder="Ulangi password baru"
            />
            {/* Menampilkan pesan error jika ada */}
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          {/* Tombol submit */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-lime-500 text-white rounded-lg shadow-md hover:bg-lime-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50"
              disabled={loading} // Tombol akan disabled ketika sedang loading
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
                'Ubah Password'
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer /> {/* Container untuk notifikasi toast */}
    </div>
  );
}
