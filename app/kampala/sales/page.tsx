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
  const [role, setRole] = useState<string>("");
  const [now, setNow] = useState<number>(() => Date.now()); // ✅ safe initializer

  useEffect(() => {
    const fetchData = async () => {
      const resSales = await fetch("/api/kampala/sales");
      if (resSales.ok) {
        const data: Sale[] = await resSales.json();
        const normalized = data.map((s) => ({
          ...s,
          products:
            typeof s.products === "string" ? JSON.parse(s.products) : s.products,
        }));
        setSales(normalized);
      }

      const resSession = await fetch("/api/session");
      if (resSession.ok) {
        const sessionData = await resSession.json();
        setRole(sessionData.role);
      }
    };
    fetchData();
  }, []);

  // ✅ only interval updates state, no synchronous setState
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteSale = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
   await fetch(`/api/kampala/sales/${id}`, { method: "DELETE" });

    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const withinFiveMinutes = (saleDate: string) => {
    const created = new Date(saleDate).getTime();
    const diffMinutes = (now - created) / (1000 * 60);
    return diffMinutes <= 5;
  };

  const getCountdown = (saleDate: string) => {
    const created = new Date(saleDate).getTime();
    const remainingMs = 5 * 60 * 1000 - (now - created);
    if (remainingMs <= 0) return "Expired";
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")} left`;
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
                {role === "kampalauser" && <th>Countdown</th>}
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => {
                const editable = withinFiveMinutes(s.date);

                return (
                  <tr key={s.id} className={!editable ? "expired-row" : ""}>
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
                      {editable ? (
                        <button
                          onClick={() => router.push(`/kampala/sales/edit/${s.id}`)}
                          className="btn-edit"
                        >
                          Edit
                        </button>
                      ) : (
                        <button className="btn-edit disabled" disabled>
                          Edit (Expired)
                        </button>
                      )}

                      {role === "kampala" ? (
                        <button
                          onClick={() => handleDeleteSale(s.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      ) : editable ? (
                        <button
                          onClick={() => handleDeleteSale(s.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      ) : (
                        <button className="btn-delete disabled" disabled>
                          Delete (Expired)
                        </button>
                      )}
                    </td>
                    {role === "kampalauser" && (
                      <td className="countdown-cell">{getCountdown(s.date)}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
