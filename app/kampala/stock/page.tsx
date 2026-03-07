"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "@/styles/stock.css";

type Product = {
  name: string;
  type: string;
  category: string;
  price: number;
  supplier: string;
  contact: string;
  quantity: number; // ✅ added
};

type Stock = {
  id: string;
  date: string;
  products: Product[];
  total_amount: number;
};

export default function KampalaStockPage() {
  const router = useRouter();
  const [stock, setStock] = useState<Stock[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      const res = await fetch("/api/kampala/stock");
      if (!res.ok) {
        console.error("❌ Failed to fetch stock");
        return;
      }
      const data: Stock[] = await res.json();
      setStock(data);
    };
    fetchStock();
  }, []);

  const handleDeleteStock = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stock entry?")) return;
    const res = await fetch(`/api/kampala/stock/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStock((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <div>
      <AdminTopBar />
      <div className="stock-container">
        <AdminSidebar />
        <main className="stock-main">
          <h1>📦 Kampala Stock Management</h1>
          <button
            onClick={() => router.push("/kampala/stock/add")}
            className="btn-add"
          >
            ➕ Add Stock
          </button>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <React.Fragment key={s.id}>
                  <tr>
                    <td>{formatDate(s.date)}</td>
                    <td>{s.total_amount}</td>
                    <td>
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === s.id ? null : s.id)
                        }
                        className="btn-view"
                      >
                        {expandedId === s.id ? "Hide Details" : "View Details"}
                      </button>
                      <button
                        onClick={() => router.push(`/kampala/stock/edit/${s.id}`)}
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
                  {expandedId === s.id && (
                    <tr>
                      <td colSpan={3}>
                        <table className="product-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Type</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Supplier</th>
                              <th>Contact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.products.map((p, idx) => (
                              <tr key={`${s.id}-${idx}`}>
                                <td>{p.name}</td>
                                <td>{p.type}</td>
                                <td>{p.category}</td>
                                <td>{p.price}</td>
                                <td>{p.quantity}</td>
                                <td>{p.supplier}</td>
                                <td>{p.contact}</td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
