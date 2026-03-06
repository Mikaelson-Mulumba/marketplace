"use client";

import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/reports.css";

// Types aligned with backend response
type Sale = { id: string; total_amount: number; date: string };
type Loan = { id: string; loan_status: string; total_amount: number; date: string };
type Stock = { id: string; added: number; sold: number; date: string };
type Summary = { 
  totalSales: number; 
  totalLoans: number; 
  openingStock: number; 
  totalAdded: number; 
  totalSold: number; 
  closingStock: number 
};

export default function KampalaReportsPage() {
  const [period, setPeriod] = useState("day");
  const [sales, setSales] = useState<Sale[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const handleGenerateReport = async () => {
    const res = await fetch(`/api/kampala/reports/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ period }),
    });
    if (res.ok) {
      const data = await res.json();
      setSales(data.sales);
      setLoans(data.loans);
      setStock(data.stock);
      setSummary(data.summary);
    } else {
      alert("❌ Failed to generate report");
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="reports-container">
        <AdminSidebar />
        <main className="reports-main">
          <div className="report-actions">
            <label htmlFor="report-period">Report Period</label>
            <select
              id="report-period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
            <button onClick={handleGenerateReport} className="btn-generate">
              Generate Report
            </button>
          </div>

          <h1 className="head">📊 Reports</h1>

          {summary && (
            <>
              <h2>Sales</h2>
              <table>
                <thead><tr><th>Date</th><th>Amount</th></tr></thead>
                <tbody>
                  {sales.map(s => (
                    <tr key={s.id}>
                      <td>{new Date(s.date).toLocaleString()}</td>
                      <td>{s.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Loans</h2>
              <table>
                <thead><tr><th>Date</th><th>Status</th><th>Amount</th></tr></thead>
                <tbody>
                  {loans.map(l => (
                    <tr key={l.id}>
                      <td>{new Date(l.date).toLocaleString()}</td>
                      <td>{l.loan_status}</td>
                      <td>{l.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Stock Movements</h2>
              <table>
                <thead><tr><th>Date</th><th>Added</th><th>Sold</th></tr></thead>
                <tbody>
                  {stock.map(st => (
                    <tr key={st.id}>
                      <td>{new Date(st.date).toLocaleString()}</td>
                      <td>{st.added}</td>
                      <td>{st.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Summary</h2>
              <table>
                <tbody>
                  <tr><td>Total Sales</td><td>{summary.totalSales}</td></tr>
                  <tr><td>Total Loans</td><td>{summary.totalLoans}</td></tr>
                  <tr><td>Opening Stock</td><td>{summary.openingStock}</td></tr>
                  <tr><td>Total Added</td><td>{summary.totalAdded}</td></tr>
                  <tr><td>Total Sold</td><td>{summary.totalSold}</td></tr>
                  <tr><td>Closing Stock</td><td>{summary.closingStock}</td></tr>
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
