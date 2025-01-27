// /sections/menuAdmin/MenuAdmin.tsx
import React from 'react';

const DashboardAdmin: React.FC = () => {
  return (
    <ul>
      <li>
        <a href="/dashboard" className="menu-item">Dashboard</a>
      </li>
      <li>
        <a href="/vehicles" className="menu-item">Vehicles</a>
      </li>
      <li>
        <a href="/driver-assignment" className="menu-item">Driver Assignment</a>
      </li>
      <li>
        <a href="/maintenance" className="menu-item">Maintenance</a>
      </li>
      <li>
        <a href="/expense" className="menu-item">Expense</a>
      </li>
    </ul>
  );
};

export default DashboardAdmin;

