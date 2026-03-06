"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/sales.css";

type Sale = {
  id: string;
  date: string;
  products: { name: string; unitPrice: number; quantity: number }[];
  total_amount: number;
  payment_method: string;
};

export default function KampalaSalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch("/api/kampala/sales");
      if (!res.ok) return;
      const data: Sale[] = await res.json();

      // ✅ Parse products JSON if needed
      const normalized = data.map((s) => ({
        ...s,
        products:
          typeof s.products === "string" ? JSON.parse(s.products) : s.products,
      }));

      setSales(normalized);
    };
    fetchSales();
  }, []);

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    await fetch(`/api/kampala/sales/${id}`, { method: "DELETE" });
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
      <div className="sales-container">
        <AdminSidebar />
        <main className="sales-main">
          <h1>💰 Sales Management</h1>
         
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Products</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>{new Date(s.date).toLocaleString()}</td>
                  <td>
                    {s.products.map((p, idx) => (
                      <div key={idx}>
                        {p.name} — {p.quantity} × Shs {p.unitPrice}
                      </div>
                    ))}
                  </td>
                  <td>Shs {s.total_amount}</td>
                  <td>{s.payment_method}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/kampala/sales/edit/${s.id}`)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSale(s.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
