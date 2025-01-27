"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';

const CreateEmployeePage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  useEffect(() => {
    console.log(token);
  }, [token]);

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
          Create Employee
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-lg font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 transition"
            >
              Set Employee
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? <a href="/auth/login" className="text-blue-500 hover:underline">Login here</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
