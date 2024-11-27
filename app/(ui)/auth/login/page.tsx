"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import carImage from "../../../../assets/images/mobilBackground.png";
import logoCarLink from "../../../../assets/images/LogoCarlink_text.png";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookie from "js-cookie";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Membuat schema validasi menggunakan Yup
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters")
  });

  // Menggunakan useForm dengan yupResolver untuk validasi
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // Fungsi untuk handle login
  const onSubmit = async (data: { username: string; password: string }) => {
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.statusCode !== 401) {
        // Tampilkan toast ketika login berhasil
        toast.success('Login berhasil!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Simpan username di localStorage atau sessionStorage
        if(typeof window !== "undefined"){
          Cookie.set("access_token", result.accessToken, { expires: 2/24 }); // expired in 2 hours
          localStorage.setItem('access_token', result.accessToken);
          localStorage.setItem('refresh_token', result.refreshToken);
          localStorage.setItem('username', result.username);
          localStorage.setItem('role',result.id_role);
        }

        // Redirect setelah beberapa detik untuk memberikan waktu toast muncul
        setTimeout(() => {
          if(result.role ===1){
            window.location.href = '/customer/homePage'
          }else if(result.role === 2){
            window.location.href = '/admin'
          }else if(result.role === 3){
            window.location.href = '/owner/menu';
          }
        }, 3000); // 3 detik sebelum redirect
      } else {
        // Jika respons bukan OK, berarti ada masalah seperti password salah
        setErrorMessage(result.message || 'Login gagal.');
        toast.error(result.message || 'Login gagal.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
      toast.error('Terjadi kesalahan. Silakan coba lagi.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white pt-16">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-black hover:text-lime-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="container mx-auto flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col justify-center items-center md:w-1/2 bg-gray-900 py-10 relative">
          <div className="flex justify-center items-center mb-10">
            <Image src={logoCarLink} alt="CarLink Logo" className="w-[120px] h-auto" />
          </div>
          <div className="text-white text-center max-w-md w-full mt-4 px-10">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Rent a car become so easy with <span className="text-lime-400">CarLink</span>
            </h1>
          </div>
          <div className="w-full mt-6">
              <Image src={carImage} alt="Car image" className="w-full h-auto max-w-[350px] lg:max-w-[450px] md:max-w-full" />
            </div>
        </div>

        <div className="flex justify-center items-center md:w-1/2 bg-white p-8">
          <div className="max-w-sm w-full">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#0F212B]">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  {...register("username")}
                  className={`mt-1 w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`mt-1 w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500`}
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .45-1.46 1.34-2.76 2.458-3.825m6.75 6.75A3 3 0 1112 15a3 3 0 010-6m1.875 4.125A10.05 10.05 0 0012 5c4.477 0 8.268 2.943 9.542 7-.45 1.46-1.34 2.76-2.458 3.825" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.034.117-.069.233-.104.35" />
                      </svg>
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <a href="/auth/forgotPassword" className="text-sm text-lime-500 hover:text-lime-600">Forgot Password?</a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                >
                  Login
                </button>
              </div>
            </form>

            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            <div className="flex items-center justify-center mt-4">
              <span className="text-gray-400">or</span>
            </div>
            <div className="text-center mt-4">
              <span className="text-gray-500">Don't have an account?</span>
              <a href="/auth/register" className="ml-1 text-lime-500 hover:text-lime-600">Register</a>
            </div>
          </div>
        </div>
      </div>

      {/* Container untuk Toast */}
      <ToastContainer />
    </div>
  );
}
