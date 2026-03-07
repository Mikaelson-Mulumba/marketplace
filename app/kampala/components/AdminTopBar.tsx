"use client";

import { useEffect, useState } from "react";
import "../../../styles/AdminTopBar.css"; // adjust path if needed

export default function AdminTopBar() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session"); // or /api/auth/session if using NextAuth
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username); // assumes your session returns { username, role }
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admins/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <header className="admin-topbar">
      {/* Company Name */}
      <h1>Katwala Solutions Ltd</h1>

      {/* Logged-in User */}
      {username && <span className="username">👤 {username}</span>}

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        🔒 Logout
      </button>
    </header>
  );
}
