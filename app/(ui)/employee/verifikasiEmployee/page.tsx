"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';

const CreateEmployeePage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true); // Menyimpan status modal
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    console.log(token);
  }, [token]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/'); // Redirect setelah modal ditutup, bisa sesuaikan
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill all fields!');
      return;
    }

    try {
      const response = await fetch('/api/employee/set-employee', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'accessToken': token || '',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Employee updated successfully');
        router.push('/auth/login');
      } else {
        toast.error(data.message || 'Failed to create employee');
      }
    } catch (error) {
      toast.error('An error occurred while creating the employee');
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Create Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-lg font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full"
          >
            Set Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
