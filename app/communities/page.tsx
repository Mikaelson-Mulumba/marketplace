"use client";

import AdminSidebar from "../../app/admin/components/AdminSidebar";
import AdminTopBar from "../../app/admin/components/AdminTopBar";

export default function CommunitiesPage() {
  return (
    <div>
      <AdminTopBar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <main
          style={{
            flex: 1,
            padding: "2rem",
            marginLeft: "160px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            backgroundColor: "#f9fafb",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#6b7280",
            }}
          >
            📩 Communities — Coming Soon
          </h1>
        </main>
      </div>
    </div>
  );
}
