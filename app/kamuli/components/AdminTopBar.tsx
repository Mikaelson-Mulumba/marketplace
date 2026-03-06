"use client";

import "../../../styles/AdminTopBar.css"; // adjust path if needed

export default function AdminTopBar() {
  const handleLogout = async () => {
    await fetch("/api/admins/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <header className="admin-topbar">
      {/* Company Name */}
      <h1>Roger Solutions Ltd</h1>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        🔒 Logout
      </button>
    </header>
  );
}
