"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminTopBar from "../../../components/AdminTopBar";
import "../../../../../styles/addproduct.css";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  categoryId: string;   // ✅ always string for select binding
  pictures: string[];
  type: string;
  price: number;
};

type Category = {
  id: string;
  name: string;
};

export default function EditKampalaProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    categoryId: "",   // ✅ initialize with empty string
    pictures: [],
    type: "",
    price: 0,
  });

  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ Fetch product + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await fetch(`/api/kampala/products/${id}`);
        if (!resProd.ok) return;
        const product = await resProd.json();

        let parsedPictures: string[] = [];
        try {
          parsedPictures =
            typeof product.pictures === "string"
              ? JSON.parse(product.pictures)
              : product.pictures || [];
        } catch {
          parsedPictures = [];
        }

        setFormData({
          name: product.name,
          categoryId: product.category_id?.toString() || "",  // ✅ ensure string
          pictures: parsedPictures,
          type: product.type,
          price: product.price,
        });

        const resCat = await fetch("/api/kampala/categories");
        const data: Category[] = await resCat.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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
      Promise.all(readers).then((images) => {
        setFormData((prev) => ({
          ...prev,
          pictures: [...prev.pictures, ...images],
        }));
      });
    }
  };

  // ✅ Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedPictures = [...prev.pictures];
      updatedPictures.splice(index, 1);
      return { ...prev, pictures: updatedPictures };
    });
  };

  // ✅ Submit update
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/kampala/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("✅ Product updated successfully!");
        router.push("/kampala/products");
      } else {
        alert("❌ Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div>
      <AdminTopBar />
      <div className="addproduct-container">
        <AdminSidebar />
        <main className="addproduct-main">
          <h1>✏️ Edit Product</h1>
          <form onSubmit={handleUpdateProduct} className="addproduct-form">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              required
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.categoryId || ""}   // ✅ always string
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id.toString()}>
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

            <div className="image-preview">
              {formData.pictures.length > 0 ? (
                formData.pictures.map((img, idx) => (
                  <div key={idx} className="image-wrapper">
                    <Image
                      src={img}
                      alt={`preview-${idx}`}
                      width={100}
                      height={100}
                      className="preview-img"
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(idx)}
                    >
                      ❌
                    </button>
                  </div>
                ))
              ) : (
                "No images"
              )}
            </div>

            <label htmlFor="type">Type</label>
            <input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Enter product type"
              required
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              placeholder="Enter product price"
              required
            />

            <button type="submit" className="btn-submit">Update Product</button>
          </form>
        </main>
      </div>
    </div>
  );
}
