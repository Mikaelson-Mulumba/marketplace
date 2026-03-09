"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import "../../../styles/products.css";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;
  pictures: string; // stored as JSON string in DB
  type: string;
  price: number;
  measurement?: string;
};

type StockSummaryRow = {
  product: string;
  type: string;
  category: string;
  available_quantity: number;
  measurement?: string;
};

// ✅ Normalize pictures safely
function normalizePictures(pictures: unknown): string[] {
  if (!pictures) return [];
  try {
    const parsed = typeof pictures === "string" ? JSON.parse(pictures) : pictures;
    if (Array.isArray(parsed)) {
      return parsed.filter((pic) => typeof pic === "string" && pic.trim() !== "");
    }
    if (typeof parsed === "string" && parsed.trim() !== "") {
      return [parsed];
    }
  } catch {
    if (typeof pictures === "string" && pictures.trim() !== "") {
      return [pictures];
    }
  }
  return [];
}

export default function KampalaProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummaryRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, summaryRes] = await Promise.all([
          fetch("/api/kampala/products"),
          fetch("/api/kampala/stock-summary"),
        ]);

        if (!prodRes.ok || !summaryRes.ok) {
          console.error("❌ Failed to fetch one of the datasets");
          return;
        }

        const prodData: Product[] = await prodRes.json();
        const summaryData: StockSummaryRow[] = await summaryRes.json();

        setProducts(prodData);
        setStockSummary(summaryData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/kampala/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ Get live status from stock summary
  const getProductStatus = (productName: string) => {
    const summary = stockSummary.find((s) => s.product === productName);
    if (!summary) return "Unavailable";
    return summary.available_quantity > 0
      ? `${summary.available_quantity} available`
      : `Unavailable — Last seen: ${summary.type}, ${summary.category}`;
  };

  return (
    <div>
      <AdminTopBar />
      <div className="products-container">
        <AdminSidebar />
        <main className="products-main">
          <h1>🛒 Products Management</h1>
          <button
            onClick={() => router.push("/kampala/products/add")}
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
                <th>Measurement</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const pics = normalizePictures(p.pictures);

                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      {pics.length > 0 ? (
                        <Image
                          src={pics[0]}
                          alt={p.name}
                          width={80}
                          height={80}
                          className="product-img"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td>{p.type}</td>
                     <td>{p.measurement}</td>
                    <td>{p.price}</td>
                    <td>{getProductStatus(p.name)}</td>
                    <td>
                      <button
                        onClick={() => router.push(`/kampala/products/edit/${p.id}`)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
