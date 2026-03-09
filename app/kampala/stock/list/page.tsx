"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "../../../../styles/products.css";

type StockSummary = {
  product: string;
  type: string;
  category: string;
  available_quantity: number;
  measurement?: string;
};

export default function KampalaStockSummaryPage() {
  const [summary, setSummary] = useState<StockSummary[]>([]);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/kampala/stock-summary");
        if (!res.ok) {
          console.error("❌ Failed to fetch stock summary");
          return;
        }
        const data: StockSummary[] = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("❌ Error fetching stock summary:", err);
      }
    };

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const sessionData = await res.json();
          setRole(sessionData.role);
        }
      } catch (err) {
        console.error("❌ Error fetching session:", err);
      }
    };

    fetchSummary();
    fetchSession();
  }, []);

  const handleDelete = async (product: string) => {
    if (!confirm(`Are you sure you want to delete ${product}?`)) return;
    try {
      const res = await fetch(`/api/kampala/stock-summary/${product}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSummary((prev) => prev.filter((item) => item.product !== product));
      } else {
        console.error("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="products-container">
        <AdminSidebar />
        <main className="products-main">
          <h1>📦 Stock Summary</h1>
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Category</th>
                <th>Measurement</th> 
                <th>Available Quantity</th>
                {role === "kampala" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {summary.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product}</td>
                  <td>{item.type}</td>
                  <td>{item.category}</td>
                   <td>{item.measurement || "N/A"}</td>
                  <td>{item.available_quantity}</td>
                  {role === "kampala" && (
                    <td>
                      <button
                        onClick={() => handleDelete(item.product)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
