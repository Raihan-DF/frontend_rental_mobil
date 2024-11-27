"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee:any) => void;
  employee: any;
  onUpdateEmployee: (employee: any) => void;
  setShowAction: (value: boolean) => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdateEmployee,
  setShowAction
}) => {
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
        console.log(data);
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    // Muat data employee saat modal dibuka dan employee memiliki data
    if (employee) {
      setNamaLengkap(employee.namaLengkap || "");
      setAlamat(employee.alamat || "");
      setNomorTelp(employee.nomorTelp || "");
      setRoleId(employee.roleId || "");
      setGaji(employee.gaji || "");
    }
  }, [employee]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!namaLengkap || !alamat || !nomorTelp || !roleId || !gaji) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const access_token = Cookie.get("access_token");

      const data = {
        namaLengkap: namaLengkap,
        alamat: alamat,
        nomorTelp: nomorTelp,
        roleId: roleId,
        gaji: gaji,
      };

      const response = await fetch(`/api/employee/${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          AccessToken: `${access_token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        toast.success("Employee updated successfully!", { position: "top-right", autoClose: 1000 });
        onUpdateEmployee(result);
        // onClose();
        setTimeout(() => {
          onClose();
          setShowAction(false);
          window.location.reload();
        }, 1000);
      } else {
        setErrorMessage(result.message || "Failed to update employee.");
        toast.error(result.message || "Failed to update employee.", { position: "top-right", autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setErrorMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", { position: "top-right", autoClose: 1000 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="rounded-lg bg-white p-8 shadow-lg max-w-3xl w-full">
        <h3 className="text-lg font-bold mb-4">Edit Employee</h3>
        <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="sr-only">Nama</label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Nama"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Alamat</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Alamat"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Nomor Telepon</label>
            <input
              type="text"
              value={nomorTelp}
              onChange={(e) => setNomorTelp(e.target.value)}
              placeholder="Nomor Telepon"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          <div>
            <label className="sr-only">Role</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                (role.id === 2 || role.id === 4) &&
                  <option key={role.id} value={role.id}>
                    {role.nama}
                  </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only">Gaji</label>
            <input
              type="number"
              value={gaji}
              onChange={(e) => setGaji(Number(e.target.value))}
              placeholder="Gaji"
              className="w-full rounded-lg border-gray-200 p-3 text-sm"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm col-span-2 mb-4">{errorMessage}</p>
          )}
          <div className="col-span-2 flex justify-end">
            <button
              type="button"
              className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Employee
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditEmployeeModal;
