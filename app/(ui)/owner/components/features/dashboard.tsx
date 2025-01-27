import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/(ui)/admin/components/ui/card"; // Pastikan komponen card sesuai

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Vehicle {
  id: number;
  typeId: number;
}

interface VehicleType {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  roleId: number;
}

interface Role {
  id: number;
  nama: string;
}

interface Income {
  totalPendapatan: string;
}

interface Expense {
  total: number;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [vehicleCountByType, setVehicleCountByType] = useState<Record<string, number>>({});
  const [employeeCountByRole, setEmployeeCountByRole] = useState<Record<string, number>>({});
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chartData, setChartData] = useState({
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [0, 0], // Default values for income and expense
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  });

  // Fetch kendaraan
  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Error fetching vehicle data");
      const data: Vehicle[] = await response.json();
      setVehicles(data);
      setTotalVehicles(data.length);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const response = await fetch("/api/vehicles/types");
      if (!response.ok) throw new Error("Error fetching vehicle types");
      const data: VehicleType[] = await response.json();
      setVehicleTypes(data);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };

  // Fetch karyawan dan role
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employee");
      if (!response.ok) throw new Error("Error fetching employees data");
      const data: Employee[] = await response.json();
      setEmployees(data);
      countEmployeesByRole(data);
    } catch (error) {
      console.error("Error fetching employees data:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/employee/role");
      if (!response.ok) throw new Error("Error fetching roles");
      const data: Role[] = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch data income dan expense
  const fetchIncome = async () => {
    try {
      const response = await fetch("/api/payments/income-report");
      if (!response.ok) throw new Error("Error fetching income data");
      const data: Income[] = await response.json();
      setIncomeData(data);
      generateChartData(data, expenses);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expense");
      if (!response.ok) throw new Error("Error fetching expenses data");
      const data: Expense[] = await response.json();
      setExpenses(data);
      generateChartData(incomeData, data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Hitung jumlah karyawan per role
  const countEmployeesByRole = (employees: Employee[]) => {
    // Role yang kita inginkan (Admin, Driver, Mechanic)
    const countByRole: Record<string, number> = { Admin: 0, Driver: 0, Mechanic: 0 };

    employees.forEach((employee) => {
      // Cek jika roleId milik karyawan ada di dalam list yang diinginkan (2, 4, 5)
      if (employee.roleId === 2) {
        countByRole["Admin"] += 1;
      } else if (employee.roleId === 4) {
        countByRole["Driver"] += 1;
      } else if (employee.roleId === 5) {
        countByRole["Mechanic"] += 1;
      }
    });

    // Set count yang sudah dihitung ke state
    setEmployeeCountByRole(countByRole);
  };

  useEffect(() => {
    fetchVehicles();
    fetchVehicleTypes();
    fetchEmployees();
    fetchRoles();
    fetchIncome();
    fetchExpenses();
  }, [incomeData]);

  useEffect(() => {
    const countByType: Record<string, number> = {};
    vehicleTypes.forEach((type) => {
      const count = vehicles.filter((v) => v.typeId === type.id).length;
      countByType[type.name] = count;
    });
    setVehicleCountByType(countByType);
  }, [vehicles, vehicleTypes]);

  const generateChartData = (income: Income[], expense: Expense[]) => {
    const totalIncome = income.reduce((sum, item) => {
      return sum + parseInt(item.totalPendapatan.replace(/[^0-9]/g, ""));
    }, 0);

    const totalExpense = expense.reduce((sum, item) => {
      return sum + item.total;
    }, 0);

    setChartData({
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount",
          data: [totalIncome, totalExpense],
          backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card for Vehicle Summary */}
        <div className="col-span-2">
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Vehicle</CardTitle>
              <CardDescription className="text-white">
                Jumlah total kendaraan dan jenis-jenis kendaraan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-extrabold">{totalVehicles}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(vehicleCountByType).map(([type, count]) => (
                  <div key={type} className="text-center">
                    <p className="text-lg font-semibold">{type}</p>
                    <p className="text-3xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card for Employee Role Summary */}
        <Card className="bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-lg text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Employee Role</CardTitle>
            <CardDescription className="text-white">
              Jumlah karyawan per role (Admin, Driver, Mechanic).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Admin</p>
                <p className="text-xl font-bold">{employeeCountByRole["Admin"]}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Driver</p>
                <p className="text-xl font-bold">{employeeCountByRole["Driver"]}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Mechanic</p>
                <p className="text-xl font-bold">{employeeCountByRole["Mechanic"]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-center text-lg font-semibold mb-2">
          Income & Expense
        </h3>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Income and Expense Comparison" },
            },
          }}
        />
      </div>
    </div>
  );
}
