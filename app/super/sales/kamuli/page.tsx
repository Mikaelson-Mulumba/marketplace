"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "@/styles/sales.css"; // ✅ use root alias

type Sale = {
  id: string;
  date: string;
  product: string;
  quantity: number;
  unit_price: number;
  total: number;
  payment_type: string;
};

export default function KamuliSalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch("/api/kamuli/sales");
      const data: Sale[] = await res.json();
      setSales(data);
    };
    fetchSales();
  }, []);

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    await fetch(`/api/kamuli/sales/${id}`, { method: "DELETE" });
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
      <div className="sales-container">
        <AdminSidebar />
        <main className="sales-main">
          <h1>💰 Roger Sales Management</h1>
         
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Payment Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.product}</td>
                  <td>{s.quantity}</td>
                  <td>{s.unit_price}</td>
                  <td>{s.total}</td>
                  <td>{s.payment_type}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/kamuli/sales/edit/${s.id}`)}
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
