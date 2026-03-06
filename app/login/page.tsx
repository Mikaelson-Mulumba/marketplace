"use client";

import { useState } from "react";
import NavBar from "../../components/NavBar";
import "../../styles/log.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/admins/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok) {
      switch (data.role) {
        case "kampala":
        case "kampalauser":
          window.location.href = "/kampala";
          break;

        case "kamuli":
        case "kamuliuser":
          window.location.href = "/kamuli";
          break;

        case "superadmin":
          window.location.href = "/super";
          break;

        default:
          alert("❌ Unknown role: " + data.role);
      }
    } else {
      alert("❌ Login failed: " + (data.error || "Unknown error"));
    }
  };

  return (
    <div>
      <NavBar />
      <div className="login-container">
        {/* Left side: Spare parts info */}
        <div className="login-left">
          <h2>Reliable Sino Truck Spare Parts</h2>
          <p>
            Access genuine HOWO, A7, T7H, and Sitrak parts. 
            Keep your fleet running smoothly with trusted service and support.
          </p>
          <button>Explore Spare Parts</button>
        </div>

        {/* Right side: Login form */}
        <div className="login-right">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Admin Login</h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
