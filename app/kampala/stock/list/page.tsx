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
};

export default function KampalaStockSummaryPage() {
  const [summary, setSummary] = useState<StockSummary[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("/api/kampala/stock-summary");
      if (!res.ok) return;
      const data: StockSummary[] = await res.json();
      setSummary(data);
    };
    fetchSummary();
  }, []);

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
                <th>Available Quantity</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product}</td>
                  <td>{item.type}</td>
                  <td>{item.category}</td>
                  <td>{item.available_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
