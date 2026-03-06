"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";

import "@/styles/admin.css"; // ✅ external CSS

// ✅ Define interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface User {
  id: number;
  username: string;
  contact: string;
  role: string;
}

interface Loan {
  id: number;
  name: string;
  contact: string;
  total_amount: number;
  loan_status: string;
}

export default function AdminHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes, loansRes] = await Promise.all([
          fetch("/api/kampala/products"),
          fetch("/api/users"),
          fetch("/api/kampala/loans"),
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
        if (loansRes.ok) setLoans(await loansRes.json());
      } catch (err) {
        console.error("❌ Failed to fetch dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter data before rendering
  const kampalaUsers = users.filter(
    (u) => u.role.toLowerCase() === "kampala" || u.role.toLowerCase() === "kampalauser"
  );

  const pendingLoans = loans.filter(
    (l) => l.loan_status && l.loan_status.toLowerCase() === "pending"
  );

  return (
    <div className="page-container">
      <AdminTopBar />
      <div className="content-wrapper">
        <AdminSidebar />
        <main className="main-content">
          

          {/* KPI Cards */}
          <div className="kpi-grid">
            {[
              { title: "Products", value: products.length },
              { title: "Pending Loans", value: pendingLoans.length },
              { title: "Kampala Users", value: kampalaUsers.length },
            ].map((card, idx) => (
              <div key={idx} className="kpi-card">
                <h3 className="kpi-title">{card.title}</h3>
                <p className="kpi-value">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Loans Table */}
          <div className="card">
            <h3 className="card-title">Pending Loans</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Total Amount</th>
                  <th>Loan Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLoans.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td>{l.name}</td>
                    <td>{l.contact}</td>
                    <td>{l.total_amount}</td>
                    <td>
                      <span className="status-badge pending">{l.loan_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Users Table */}
          <div className="card">
            <h3 className="card-title">Kampala Users</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Contact</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {kampalaUsers.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.contact}</td>
                    <td>
                      <span className="role-badge kampala">{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
