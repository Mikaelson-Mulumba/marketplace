"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import type { Product, Merchant, Order, User, Loan } from "@/lib/types";

export default function AdminHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const productsRes = await fetch("/api/products");
      setProducts(await productsRes.json());

      const merchantsRes = await fetch("/api/merchants");
      setMerchants(await merchantsRes.json());

      const ordersRes = await fetch("/api/orders");
      setOrders(await ordersRes.json());

      const usersRes = await fetch("/api/users");
      setUsers(await usersRes.json());

      const loansRes = await fetch("/api/loans");
      setLoans(await loansRes.json());
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <AdminTopBar />
      <div className="content-wrapper">
        <AdminSidebar />
        <main
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            width: "100%",
            maxWidth: "1200px",
            margin: "20px auto auto 160px",
            padding: "2rem",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#2563eb",
              textAlign: "center",
            }}
          >
            📊 Super Admin Dashboard
          </h1>

          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {[
              { title: "Products", value: products.length },
              { title: "Merchants", value: merchants.length },
              { title: "Orders", value: orders.length },
              { title: "Loans", value: loans.length },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "16px", color: "#374151" }}>{card.title}</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#2563eb" }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Recent Orders</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>{o.customer_name}</td>
                    <td>{o.product_id}</td>
                    <td>{o.quantity}</td>
                    <td>{o.status}</td>
                    <td>{o.address}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loans Table */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Loans</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Total Cash</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {loans.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td>{l.applicant_name}</td>
                    <td>{l.phone}</td>
                    <td>{l.address}</td>
                    <td>{l.total_cash}</td>
                    <td>{l.status}</td>
                    <td>{l.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Users Table */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "10px" }}>
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Users</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.phone}</td>
                    <td>{u.address}</td>
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
