"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "@/styles/forms.css";

export default function AddStockPage() {
  const router = useRouter();

  // Format date in YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const [products, setProducts] = useState([
    { name: "", type: "", category: "", price: "", supplier: "", contact: "", quantity: "" },
  ]);

  const handleProductChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...products];
    updated[index][e.target.name as keyof typeof updated[0]] = e.target.value;
    setProducts(updated);
  };

  const addProductRow = () => {
    setProducts([
      ...products,
      { name: "", type: "", category: "", price: "", supplier: "", contact: "", quantity: "" },
    ]);
  };

  const removeProductRow = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // total could be price * quantity if you want stock value
    const total = products.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
      0
    );

    const payload = {
      date: formatted,
      products,
      total_amount: total,
    };

    await fetch("/api/kampala/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
            <input id="date" name="date" type="text" value={formatted} readOnly />

            {products.map((p, index) => (
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
                  value={p.quantity}
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
            <button type="submit" className="btn-submit">Save Stock</button>
          </form>
        </main>
      </div>
    </div>
  );
}
