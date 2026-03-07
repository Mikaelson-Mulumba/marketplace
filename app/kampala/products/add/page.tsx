"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "../../../../styles/addproduct.css";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;
  pictures: string[];
  type: string;
  price: number;
};



type StockProduct = {
  product: string;
  type: string;
  category: string;
  available_quantity: number;
  price?: number;
};

export default function AddKampalaProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    pictures: [],
    type: "",
    price: 0,
  });


  const [stockProducts, setStockProducts] = useState<StockProduct[]>([]);

  // ✅ Fetch categories

  // ✅ Fetch stock products (flattened from JSONB)
  useEffect(() => {
    const fetchStockProducts = async () => {
      const res = await fetch("/api/kampala/stock-summary");
      if (!res.ok) {
        console.error("❌ Failed to fetch stock summary");
        return;
      }
      const data: StockProduct[] = await res.json();
      setStockProducts(data);
    };
    fetchStockProducts();
  }, []);


  // ✅ Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((images) =>
      setFormData((prev) => ({ ...prev, pictures: [...prev.pictures, ...images] }))
    );
  };

  // ✅ Submit form
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/kampala/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("✅ Product added successfully!");
      router.push("/kampala/products");
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="addproduct-container">
        <AdminSidebar />
        <main className="addproduct-main">
          <h1>➕ Add Product</h1>
          <form onSubmit={handleAddProduct} className="addproduct-form">

            {/* ✅ Product Name from Stock */}
            <label htmlFor="product">Product (from Stock Summary)</label>
            <select
              id="product"
              value={formData.name || ""}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedProduct = stockProducts.find(sp => sp.product === selectedName);
                setFormData({
                  ...formData,
                  name: selectedName,
                  type: selectedProduct?.type || "",
                  category: selectedProduct?.category || "",
                  price: selectedProduct?.price ? Number(selectedProduct.price) : formData.price
                });
              }}
              required
            >
              <option value="">-- Select Product --</option>
              {stockProducts.map((sp, idx) => (
                <option key={idx} value={sp.product}>
                  {sp.product} ({sp.available_quantity} left)
                </option>
              ))}
            </select>


            {/* ✅ Category Dropdown */}
            <label htmlFor="category">Category</label>
            <input
              id="category"
              placeholder="Category"
              value={formData.type || ""}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              readOnly   // ✅ auto-filled, not editable
            />

            <label htmlFor="pictures">Upload Images</label>
            <input
              id="pictures"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* ✅ Preview selected images */}
            <div className="image-preview">
              {formData.pictures.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`preview-${idx}`}
                  width={100}
                  height={100}
                  className="preview-img"
                />
              ))}
            </div>

            <label htmlFor="type">Type</label>
            <input
              id="type"
              placeholder="Type"
              value={formData.type || ""}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              readOnly   // ✅ auto-filled, not editable
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              placeholder="Price"
              value={formData.price ?? 0}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />

            <button type="submit" className="btn-submit">Add Product</button>
          </form>
        </main>
      </div>
    </div>
  );
}
