import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
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

import AddEmployeeModal from "../../components/modal/employee/addEmployee/page";
import EditEmployeeModal from "../../components/modal/employee/editEmployee/page";
export interface Employee {
  id: number;
  namaLengkap: string;
  alamat: string;
  nomorTelp: string;
  roleId: number;
  gaji: number;
  role: Role;
}

export interface Role {
  id: number;
  role_name: string;
}

function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
    </div>
  );
}
function Employee({
  setActiveMenu,
}: {
  setActiveMenu: (value: string) => void;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [showAction, setShowAction] = useState<boolean>(false);
  const [roles, setRoles] = useState<{ id: number; nama: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee>();

  const handleSetShowAction = (value: boolean) => setShowAction(value);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employee");
        if (!response.ok) throw new Error("Error fetching employees data");
        const data = await response.json();
        console.log(data);
        setEmployees(data);
        console.log("ini role", data);
      } catch (error) {
        toast.error("Failed to fetch employees data");
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/employee/role");
        if (!response.ok) throw new Error("Failed to fetch roles");

        const data = await response.json();
        setRoles(data); // Store roles in the state
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
    fetchEmployees();
  }, []);

  const toggleOptions = (id: number) => {
    setShowOptions((prev) => (prev === id ? null : id));
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleEditEmployee = (editEmployee: Employee) => {
    setEmployees((prev) => {
      return prev.map((employee) =>
        employee.id === editEmployee.id ? editEmployee : employee
      );
    });
    setActiveMenu("Employee");
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/employee/search?query=${query}`);
      if (!response.ok) throw new Error("Error searching employees");
      const data = await response.json();
      setEmployees(data); // Update state with search results
    } catch (error) {
      // toast.error("Failed to search employees");
    }
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
      } else {
        throw new Error("Gagal menghapus employee");
      }
    } catch (error) {
      toast.error("Error deleting employee");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {/* <h2 className="text-xl font-bold">Employee</h2> */}
      <Card>
        <CardHeader className="px-7 relative flex items-start">
          <div>
            <CardTitle>Employee</CardTitle>
            <CardDescription>List of employees in the company.</CardDescription>
            {/* Input search */}
            <input
              type="text"
              placeholder="Search employees..."
              className="mt-4 p-2 border border-gray-300 rounded"
              onChange={(e) => handleSearch(e.target.value)}
            />
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
                    {employee.role.role_name}
                  </TableCell>
                  <TableCell className="text-right">{employee.gaji}</TableCell>
                  <TableCell className="text-right">
                    {employee.alamat}
                  </TableCell>
                  <TableCell className="text-right relative flex justify-center items-center">
                    <Icon
                      icon="mdi:dots-vertical"
                      className="cursor-pointer"
                      onClick={() => {
                        toggleOptions(employee.id);
                        setShowAction(true);
                      }}
                    />
                    {showOptions === employee.id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
                        <button
                          className="w-full text-left px-2 py-1 hover:bg-gray-100"
                          onClick={() => {
                            setEmployeeToEdit(employee);
                            setIsModalEditOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-2 py-1 hover:bg-gray-100"
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddEmployee={handleAddEmployee}
        />
        <EditEmployeeModal
          isOpen={isModalEditOpen}
          onClose={() => setIsModalEditOpen(false)}
          onUpdateEmployee={handleEditEmployee}
          setShowAction={handleSetShowAction}
          onAddEmployee={function (employee: any): void {
            throw new Error("Function not implemented.");
          }}
          employee={employeeToEdit}
        />
      </Card>
    </div>
  );
}
function Income() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Income</h2>
    </div>
  );
}
function Expense() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Expense</h2>
    </div>
  );
}

export { Dashboard, Employee, Expense, Income };
