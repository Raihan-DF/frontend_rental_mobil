"use client";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";

export default function Dashboard() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Ambil username dari localStorage
    const access_token = localStorage.getItem('access_token');
    const username = localStorage.getItem("username");
    if (username && access_token) {
      setUsername(username);
    } else {
      // Redirect jika tidak ada username
      window.location.href = '/auth/login';
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
      <p className="mt-4 text-gray-600">You are logged in.</p>
      <button
        onClick={() => {
          localStorage.removeItem('access_token'); // Hapus username dari localStorage
          localStorage.removeItem('refresh_token'); // Hapus username dari localStorage
          localStorage.removeItem('username'); // Hapus username dari localStorage
          Cookie.remove("access_token");
          window.location.href = '/auth/login'; // Redirect ke halaman login
        }}
        className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
      >
        Logout
      </button>
    </div>
  );
}
