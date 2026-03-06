"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "../../../../styles/reports.css";// ✅ use root alias

type Report = {
  id: string;
  date: string;
  report: string;
  file_path: string;
};

export default function KampalaReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await fetch("/api/kampala/reports");
      const data: Report[] = await res.json();
      setReports(data);
    };
    fetchReports();
  }, []);

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    await fetch(`/api/kampala/reports/${id}`, { method: "DELETE" });
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
      <div className="reports-container">
        <AdminSidebar />
        <main className="reports-main">
          <h1 className="head">📊 Katwala Reports</h1>
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Report</th>
                <th>PDF</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.report}</td>
                  <td>
                    <a href={r.file_path} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => router.push(`/kampala/reports/edit/${r.id}`)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReport(r.id)}
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
