"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/stock.css";

type Stock = {
  id: string;
  date: string;
  product: string;
  type: string;
  quantity: number;
  price: number;
  supplier: string;
  contact: string;
};

export default function KamuliStockPage() {
  const router = useRouter();
  const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      const res = await fetch("/api/kamuli/stock");
      const data: Stock[] = await res.json();
      setStock(data);
    };
    fetchStock();
  }, []);

  const handleDeleteStock = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stock entry?")) return;
    await fetch(`/api/kamuli/stock/${id}`, { method: "DELETE" });
    setStock((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
     <div className="stock-container">
        <AdminSidebar />
        <main className="stock-main">
          <h1>📦 Stock Management</h1>
          <button
            onClick={() => router.push("/kamuli/stock/add")}
            className="btn-add"
          >
            ➕ Add Stock
          </button>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.product}</td>
                  <td>{s.type}</td>
                  <td>{s.quantity}</td>
                  <td>{s.price}</td>
                  <td>{s.supplier}</td>
                  <td>{s.contact}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/kamuli/stock/edit/${s.id}`)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStock(s.id)}
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
