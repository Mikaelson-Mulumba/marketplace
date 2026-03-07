"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/loans.css";

type Loan = {
  id: string;
  name: string;
  address: string;
  contact: string;
  products: { name: string; unitPrice: number; quantity: number }[];
  total_amount: number;
  loan_status: string;
  date: string;
};

export default function KampalaLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchLoans = async () => {
      const res = await fetch("/api/kampala/loans");
      if (!res.ok) return;
      const data: Loan[] = await res.json();

      const normalized = data.map((l) => ({
        ...l,
        products:
          typeof l.products === "string" ? JSON.parse(l.products) : l.products,
      }));

      setLoans(normalized);
    };

    const fetchSession = async () => {
      const res = await fetch("/api/session");
      if (res.ok) {
        const sessionData = await res.json();
        setRole(sessionData.role);
      }
    };

    fetchLoans();
    fetchSession();
  }, []);

  const handleDeleteLoan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this loan?")) return;
    try {
      const res = await fetch(`/api/kampala/loans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLoans((prev) => prev.filter((loan) => loan.id !== id));
      } else {
        console.error("❌ Failed to delete loan");
      }
    } catch (err) {
      console.error("❌ Error deleting loan:", err);
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="loans-container">
        <AdminSidebar />
        <main className="loans-main">
          <h1>💵 Loans</h1>
          <table className="loans-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                {role === "kampala" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.date).toLocaleString()}</td>
                  <td>{l.name}</td>
                  <td>{l.contact}</td>
                  <td>{l.address}</td>
                  <td>
                    {l.products.map((p, idx) => (
                      <div key={idx}>
                        {p.name} — {p.quantity} × Shs {p.unitPrice}
                      </div>
                    ))}
                  </td>
                  <td>Shs {l.total_amount}</td>
                  <td>
                    {l.loan_status.toLowerCase() === "pending" ? (
                      <select
                        aria-label={`Update loan status for ${l.name}`}
                        value={l.loan_status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await fetch(`/api/kampala/loans/${l.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ loan_status: newStatus }),
                            });
                            if (res.ok) {
                              setLoans((prev) =>
                                prev.map((loan) =>
                                  loan.id === l.id ? { ...loan, loan_status: newStatus } : loan
                                )
                              );
                            }
                          } catch (err) {
                            console.error("❌ Failed to update loan:", err);
                          }
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="cleared">Cleared</option>
                      </select>
                    ) : (
                      l.loan_status
                    )}
                  </td>
                  {role === "kampala" && (
                    <td>
                      <button
                        onClick={() => handleDeleteLoan(l.id)}
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
