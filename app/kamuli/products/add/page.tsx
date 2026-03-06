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
  category: string;   // ✅ replaced "product" with "category"
  pictures: string[];
  type: string;
  price: number;
};

type Category = {
  id: string;
  name: string;
};

export default function AddKamuliProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    pictures: [],
    type: "",
    price: 0,
  });

  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/kamuli/categories");
      const data: Category[] = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileReaders = files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );
      Promise.all(fileReaders).then((images) => {
        setFormData((prev) => ({
          ...prev,
          pictures: [...prev.pictures, ...images],
        }));
      });
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/kamuli/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("✅ Product added successfully!");
      router.push("/kamuli/products");
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
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* ✅ Category Dropdown */}
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

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
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              placeholder="Price"
              value={formData.price}
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
