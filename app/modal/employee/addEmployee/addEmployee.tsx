"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: any) => void;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onAddEmployee,
}: AddEmployeeModalProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorTelp, setNomorTelp] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [gaji, setGaji] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [roles, setRoles] = useState<{ id: number; nama: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/employee/role");
        if (!response.ok) throw new Error("Failed to fetch roles");

        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!namaLengkap || !alamat || !nomorTelp || !roleId || !gaji || !email) {
      setErrorMessage("All fields are required.");
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const access_token = Cookie.get("access_token");

      const response = await fetch("/api/employee/create-employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `${access_token}`,
        },
        body: JSON.stringify({
          nama: namaLengkap,
          alamat: alamat,
          nomorTelp: nomorTelp,
          email: email,
          roleId: roleId,
          gaji: gaji,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Employee added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        onAddEmployee(result);
        setTimeout(onClose, 3000);
      } else {
        setErrorMessage(result.message || "Failed to add employee.");
        toast.error(result.message || "Failed to add employee.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <Dialog open={isOpen} handler={onClose} className="max-w-3xl mx-auto" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="bg-blue-600 text-white text-lg font-semibold rounded-t-lg p-4 shadow-md w-full">
            Add Employee
          </div>
        </DialogHeader>
        <DialogBody className="p-8" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg shadow-md"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Address"
                className="w-full p-3 border rounded-lg shadow-md"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={nomorTelp}
                onChange={(e) => setNomorTelp(e.target.value)}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg shadow-md"
                required
              />
            </div>
            <div>
              <select
                value={roleId}
                onChange={(e) => setRoleId(Number(e.target.value))}
                className="w-full p-3 border rounded-lg shadow-md"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  (role.id === 2 || role.id === 4 || role.id === 5) && (
                    <option key={role.id} value={role.id}>
                      {role.nama}
                    </option>
                  )
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                value={gaji}
                onChange={(e) => setGaji(Number(e.target.value))}
                placeholder="Salary"
                className="w-full p-3 border rounded-lg shadow-md"
                required
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 border rounded-lg shadow-md"
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm col-span-2">{errorMessage}</p>
            )}
          </form>
        </DialogBody>
        <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Button variant="text" color="red" onClick={onClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSubmit} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Add Employee
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
