"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopBar from "../../../components/AdminTopBar";
import "../../../../../styles/edit.css";

type Product = {
  name: string;
  type: string;
  category: string;
  price: number;
  supplier: string;
  contact: string;
  quantity: number;
  measurement?: string; // ✅ new field
};


type Stock = {
  id: string;
  date: string;
  products: Product[];
  total_amount: number;
};

export default function EditStockPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [form, setForm] = useState<Omit<Stock, "id">>({
    date: "",
    products: [],
    total_amount: 0,
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
        const data: Stock = await res.json();
        setForm({
          date: data.date,
          products: data.products,
          total_amount: data.total_amount,
        });
      } catch (err) {
        console.error("Error fetching stock:", err);
      }
    };
    fetchStock();
  }, [id]);

  // ✅ Handle product changes
  // ✅ Handle product changes
  // ✅ Handle product changes with strict typing
  const handleProductChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...form.products];

    // Explicit union of valid keys
    type ProductKey = keyof Product;
    const key = name as ProductKey;

    switch (key) {
      case "price":
      case "quantity":
        updated[index][key] = Number(value);
        break;
      case "name":
      case "type":
      case "category":
      case "supplier":
      case "contact":
      case "measurement":   // ✅ allow editing
        updated[index][key] = value;
        break;
      default:
        const exhaustiveCheck: never = key;
        throw new Error(`Unhandled field: ${exhaustiveCheck}`);
    }


    setForm({ ...form, products: updated });
  };


  const addProductRow = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        {
          name: "",
          type: "",
          category: "",
          price: 0,
          supplier: "",
          contact: "",
          quantity: 0,
          measurement: "N/A",   // ✅ default
        },
      ],
    });
  };

  const removeProductRow = (index: number) => {
    const updated = [...form.products];
    updated.splice(index, 1);
    setForm({ ...form, products: updated });
  };

  // ✅ Submit updated stock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // total = sum of price * quantity
    const total = form.products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
      0
    );

    const payload = {
      date: form.date,
      products: form.products,
      total_amount: total,
    };

    try {
      const res = await fetch(`/api/kampala/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

            {form.products.map((p, index) => (
              <div key={index} className="product-row">
                <label htmlFor={`name-${index}`}>Product Name</label>
                <input
                  id={`name-${index}`}
                  name="name"
                  value={p.name}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter product name"
                  required
                />

                <label htmlFor={`type-${index}`}>Type</label>
                <input
                  id={`type-${index}`}
                  name="type"
                  value={p.type}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter type"
                  required
                />
                <label htmlFor={`measurement-${index}`}>Measurement</label>
                <input
                  id={`measurement-${index}`}
                  name="measurement"
                  value={p.measurement || "N/A"}   // ✅ fallback to N/A
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter measurement (e.g., kg, liters)"
                />


                <label htmlFor={`category-${index}`}>Category</label>
                <input
                  id={`category-${index}`}
                  name="category"
                  value={p.category}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter category"
                  required
                />

                <label htmlFor={`price-${index}`}>Price</label>
                <input
                  id={`price-${index}`}
                  name="price"
                  type="number"
                  value={p.price}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter price"
                  required
                />

                  <label htmlFor={`quantity-${index}`}>Quantity</label>
                <input
                  id={`quantity-${index}`}
                  name="quantity"
                  type="number"
                  value={p.quantity ?? 0}   // ✅ fallback to 0
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter quantity"
                  required
                />


                <label htmlFor={`supplier-${index}`}>Supplier</label>
                <input
                  id={`supplier-${index}`}
                  name="supplier"
                  value={p.supplier}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter supplier"
                  required
                />

                <label htmlFor={`contact-${index}`}>Contact</label>
                <input
                  id={`contact-${index}`}
                  name="contact"
                  value={p.contact}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Enter contact"
                  required
                />

                <button type="button" onClick={() => removeProductRow(index)}>Remove</button>
              </div>
            ))}

            <button type="button" onClick={addProductRow}>➕ Add Another Product</button>
            <button type="submit" className="btn-submit">Update Stock</button>
          </form>
        </main>
      </div>
    </div>
  );
}