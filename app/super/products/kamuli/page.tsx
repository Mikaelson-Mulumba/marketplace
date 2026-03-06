"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopBar from "../../components/AdminTopBar";
import "../../../../styles/products.css";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;   // ✅ replaced "product" with "category"
  pictures: string;
  type: string;
  price: number;
};

export default function KamuliProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/kamuli/products");
      const data: Product[] = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/kamuli/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <AdminTopBar />
      <div className="products-container">
        <AdminSidebar />
        <main className="products-main">
          <h1>🛒 Roger Products Management</h1>
          <button
            onClick={() => router.push("/super/products/kamuli/add")}
            className="btn-add"
          >
            ➕ Add Product
          </button>
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Pictures</th>
                <th>Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    {p.pictures ? (() => {
                      try {
                        const pics = JSON.parse(p.pictures) as string[];
                        return pics.length > 0 ? (
                          <Image
                            src={pics[0]} // show first image
                            alt={p.name}
                            width={80}
                            height={80}
                            className="product-img"
                          />
                        ) : "No image";
                      } catch {
                        // fallback if not JSON
                        return (
                          <Image
                            src={p.pictures}
                            alt={p.name}
                            width={80}
                            height={80}
                            className="product-img"
                          />
                        );
                      }
                    })() : "No image"}
                  </td>

                  <td>{p.type}</td>
                  <td>{p.price}</td>
                  <td>
                    <button onClick={() => router.push(`/super/products/kamuli/edit/${p.id}`)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="btn-delete">Delete</button>
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
