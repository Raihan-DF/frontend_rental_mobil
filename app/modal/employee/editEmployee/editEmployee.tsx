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
  Input,
} from "@material-tailwind/react";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEmployee: (employee: any) => void;
  employee: any | null;
  setShowAction: (value: boolean) => void;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onUpdateEmployee,
  setShowAction,
}: EditEmployeeModalProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nomorTelp, setNomorTelp] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [gaji, setGaji] = useState<number | "">("");
  const [roles, setRoles] = useState<{ id: number; nama: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    if (employee) {
      setNamaLengkap(employee.namaLengkap || "");
      setAlamat(employee.alamat || "");
      setNomorTelp(employee.nomorTelp || "");
      setRoleId(employee.roleId || "");
      setGaji(employee.gaji || "");
    }
  }, [employee]);

  // const handleUpdateSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrorMessage("");

  //   if (!namaLengkap || !alamat || !nomorTelp || !roleId || !gaji) {
  //     setErrorMessage("All fields are required.");
  //     return;
  //   }

  //   try {
  //     const access_token = Cookie.get("access_token");
  //     const data = { namaLengkap, alamat, nomorTelp, roleId, gaji };

  //     const response = await fetch(`/api/employee/${employee.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         AccessToken: `${access_token}`,
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       // Toast success only if update is successful
  //       toast.success("Employee updated successfully!", {
  //         position: "top-right",
  //         autoClose: 2000,  // Adjusted autoClose time
  //       });
  //       onUpdateEmployee(result);
  //       setShowAction(false);  // Close action modal after update
  //     } else {
  //       setErrorMessage(result.message || "Failed to update employee.");
  //       toast.error(result.message || "Failed to update employee.", {
  //         position: "top-right",
  //         autoClose: 3000,  // Adjusted autoClose time
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating employee:", error);
  //     setErrorMessage("An error occurred. Please try again.");
  //     toast.error("An error occurred. Please try again.", {
  //       position: "top-right",
  //       autoClose: 3000,  // Adjusted autoClose time
  //     });
  //   }
  // };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!namaLengkap || !alamat || !nomorTelp || !roleId || !gaji) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const access_token = Cookie.get("access_token");
      const data = { namaLengkap, alamat, nomorTelp, roleId, gaji };

      const response = await fetch(`/api/employee/${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `${access_token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Employee update success");
        toast.success("Employee updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        onUpdateEmployee(result);
        setShowAction(false);
      } else {
        console.log("Error updating employee");
        toast.error(result.message || "Failed to update employee.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000, // Adjusted autoClose time
      });
    }
  };

  // Find the role name based on the roleId
  const roleName = roles.find((role) => role.id === roleId)?.nama || "";

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="lg"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <DialogHeader
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Edit Employee
      </DialogHeader>
      <DialogBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap"
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            required
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          <Input
            label="Alamat"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            required
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          <Input
            label="Nomor Telepon"
            value={nomorTelp}
            onChange={(e) => setNomorTelp(e.target.value)}
            required
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          <Input
            label="Role"
            value={roleName}
            disabled
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          <Input
            label="Gaji"
            type="number"
            value={gaji}
            onChange={(e) => setGaji(Number(e.target.value))}
            required
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm col-span-2">{errorMessage}</p>
          )}
        </form>
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Button
          variant="text"
          color="red"
          onClick={onClose}
          className="mr-2"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleUpdateSubmit}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Update Employee
        </Button>
      </DialogFooter>
      <ToastContainer />
    </Dialog>
  );
}
