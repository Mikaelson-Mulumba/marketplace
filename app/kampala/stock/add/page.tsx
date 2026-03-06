"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "@/styles/forms.css";

export default function AddStockPage() {
  const router = useRouter();

  // ✅ Format date + time in local 24hr clock
  const now = new Date();
  const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const [form, setForm] = useState({
    date: formatted,
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
    await fetch("/api/kampala/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/kampala/stock");
  };

  return (
    <div>
      <AdminTopBar />
      <div className="form-container">
        <AdminSidebar />
        <main className="form-main">
          <h1>➕ Add Stock</h1>
          <form onSubmit={handleSubmit} className="form-grid">
            <label htmlFor="date">Date & Time</label>
            <input id="date" name="date" type="text" value={form.date} readOnly />

            <label htmlFor="product">Product</label>
            <input
              id="product"
              name="product"
              value={form.product}
              onChange={handleChange}
              placeholder="Product"
              required
            />

            <label htmlFor="type">Type</label>
            <input
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Type"
              required
            />

            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />

            <label htmlFor="supplier">Supplier</label>
            <input
              id="supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              placeholder="Supplier"
              required
            />

            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact"
              required
            />

            <button type="submit" className="btn-submit">Save</button>
          </form>
        </main>
      </div>
    </div>
  );
}
