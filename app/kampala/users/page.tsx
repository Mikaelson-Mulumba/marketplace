"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/users.css";

type User = {
  id: string;
  username: string;
  role: string;
  password: string;
  plain_password?: string;
  contact?: string;
};

export default function KampalaUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data: User[] = await res.json();

      // ✅ Filter only kampala roles
      const kampalaUsers = data.filter(
        (u) => u.role === "kampala" || u.role === "kampalauser"
      );
      setUsers(kampalaUsers);
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
      <div className="users-container">
        <AdminSidebar />
        <main className="users-main">
          <h1>👥 Users Management</h1>
          <button
            onClick={() => router.push("/kampala/users/add")}
            className="btn-add"
          >
            ➕ Add Kampala User
          </button>
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Password</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.plain_password ?? u.password}</td>
                  <td>{u.contact ?? "—"}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/kampala/users/edit/${u.id}`)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
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
