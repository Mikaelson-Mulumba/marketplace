"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/loans.css";

type Loan = {
  id: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  total: number;
  status: string;
};

export default function KamuliLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchLoans = async () => {
      const res = await fetch("/api/kamuli/loans");
      const data: Loan[] = await res.json();
      setLoans(data);
    };
    fetchLoans();
  }, []);

  return (
    <div>
      <AdminTopBar />
      <div className="loans-container">
        <AdminSidebar />
        <main className="loans-main">
          <h1>💵  Loans</h1>
          <table className="loans-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.phone}</td>
                  <td>{l.address}</td>
                  <td>{l.product}</td>
                  <td>{l.total}</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
