"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopBar from "../../../components/AdminTopBar";
import "@/styles/forms.css";

type Stock = {
  id: string;
  date: string;
  product: string;
  type: string;
  quantity: number;
  price: number;
  supplier: string;
  contact: string;
};

type ApiResponse = Stock | { error: string };

export default function EditStockPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [form, setForm] = useState<Omit<Stock, "id">>({
    date: "",
    product: "",
    type: "",
    quantity: 0,
    price: 0,
    supplier: "",
    contact: "",
  });

  // ✅ Fetch existing stock entry
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`/api/kampala/stock/${id}`);
        if (!res.ok) {
          console.error("Failed to fetch stock entry");
          return;
        }
        const data: ApiResponse = await res.json();

        if ("error" in data) {
          console.error("Stock entry not found");
          return;
        }

        setForm({
          date: data.date,
          product: data.product,
          type: data.type,
          quantity: data.quantity,
          price: data.price,
          supplier: data.supplier,
          contact: data.contact,
        });
      } catch (err) {
        console.error("Error fetching stock:", err);
      }
    };
    fetchStock();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  // ✅ Submit updated stock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/kampala/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("✅ Stock updated successfully!");
        router.push("/kampala/stock");
      } else {
        alert("❌ Failed to update stock");
      }
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="form-container">
        <AdminSidebar />
        <main className="form-main">
          <h1>✏️ Edit Stock</h1>
          <form onSubmit={handleSubmit} className="form-grid">
            <label htmlFor="date">Date & Time</label>
            <input id="date" name="date" type="text" value={form.date} readOnly />

            <label htmlFor="product">Product</label>
            <input
              id="product"
              name="product"
              value={form.product}
              onChange={handleChange}
              required
            />

            <label htmlFor="type">Type</label>
            <input
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            />

            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              required
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />

            <label htmlFor="supplier">Supplier</label>
            <input
              id="supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              required
            />

            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-submit">Update</button>
          </form>
        </main>
      </div>
    </div>
  );
}
