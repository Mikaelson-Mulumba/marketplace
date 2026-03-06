"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/forms.css";

export default function AddStockPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    date: "",
    product: "",
    type: "",
    quantity: "",
    price: "",
    supplier: "",
    contact: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/kamuli/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/kamuli/stock");
  };

  return (
    <main className="form-main">
      <h1>Add Stock</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            value={form[field as keyof typeof form]}
            onChange={handleChange}
            placeholder={field}
            required
          />
        ))}
        <button type="submit" className="btn-submit">Save</button>
      </form>
    </main>
  );
}
