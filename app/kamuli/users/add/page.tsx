"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "../../../../styles/adduser.css";

type User = {
  id: string;
  username: string;
  role: string;
  password: string;
  plain_password?: string;
  contact?: string;
};

export default function AddKamuliUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<User, "id">>({
    username: "",
    role: "kamuliuser",
    password: "",
    plain_password: "",
    contact: "",
  });

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("✅ Kamuli user added successfully!");
      router.push("/kamuli/users");
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="adduser-container">
        <AdminSidebar />
        <main className="adduser-main">
          <h1>➕ Add  User</h1>
          <form onSubmit={handleAddUser} className="adduser-form">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              placeholder="Password"
              value={formData.plain_password ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,       // plain string sent to backend
                  plain_password: e.target.value, // also plain string
                })
              }
              required
            />



            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              placeholder="Contact"
              value={formData.contact ?? ""}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />

            {/* ✅ Accessible role selector */}
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="role-select"
            >
              <option value="kamuli">Admin Kampala</option>
              <option value="kamuliuser">Kampala User</option>
            </select>

            <button type="submit" className="btn-submit">Add User</button>
          </form>
        </main>
      </div>
    </div>
  );
}
