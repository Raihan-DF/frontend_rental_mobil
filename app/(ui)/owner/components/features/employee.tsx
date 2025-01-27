import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(ui)/admin/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(ui)/admin/components/ui/table";

import AddEmployeeModal from "@/app/modal/employee/addEmployee/addEmployee";
import EditEmployeeModal from "@/app/modal/employee/editEmployee/editEmployee";
import DeleteConfirmationModal from "@/app/modal/employee/deleteEmployee/deleteEmployee"; // Import the modal

export default function Employee() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<any>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employee");
        if (!response.ok) throw new Error("Error fetching employees data");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        toast.error("Failed to fetch employees data");
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/employee/role");
        if (!response.ok) throw new Error("Failed to fetch roles");
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        toast.error("Failed to fetch roles");
      }
    };

    fetchRoles();
    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmployee: any) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleEditEmployee = (editEmployee: any) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editEmployee.id ? editEmployee : employee
      )
    );
    // setActiveMenu("employee"); // This will change the active menu
  };

  const deleteEmployee = async (id: number) => {
    try {
      const response = await fetch(`/api/employee/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== id)
        );
        toast.success("Employee berhasil dihapus");
        setIsDeleteModalOpen(false); // Close modal after deletion
      } else {
        throw new Error("Gagal menghapus employee");
      }
    } catch (error) {
      toast.error("Error deleting employee");
      setIsDeleteModalOpen(false); // Close modal after failure
    }
  };

  const openDeleteConfirmationModal = (employee: any) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <Card>
        <CardHeader className="px-7 relative flex items-start">
          <div>
            <CardTitle>Employee</CardTitle>
            <CardDescription>List of employees in the company.</CardDescription>
          </div>
          <div className="absolute right-0 top-4 mr-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Employee
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead className="text-right">Phone Number</TableHead>
                <TableHead className="text-right">Role</TableHead>
                <TableHead className="text-right">Gaji</TableHead>
                <TableHead className="text-right">Alamat</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">{employee.namaLengkap}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {employee.nomorTelp}
                  </TableCell>
                  <TableCell className="text-right">
                    {roles
                      .filter((role) => role.id === employee.roleId)
                      .map((role) => role.nama).join(", ") || "No Role"}
                  </TableCell>
                  <TableCell className="text-right">{employee.gaji}</TableCell>
                  <TableCell className="text-right">{employee.alamat}</TableCell>
                  <TableCell className="text-right">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => {
                        setEmployeeToEdit(employee);
                        setIsModalEditOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => openDeleteConfirmationModal(employee)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isModalOpen && (
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {isModalEditOpen && employeeToEdit && (
        <EditEmployeeModal
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onUpdateEmployee={handleEditEmployee}
          employee={employeeToEdit}
          setShowAction={() => setIsModalEditOpen(false)} // Close modal after update
        />
      )}

      {isDeleteModalOpen && employeeToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={() => deleteEmployee(employeeToDelete.id)}
          employeeName={employeeToDelete.namaLengkap}
        />
      )}
    </div>
  );
}
