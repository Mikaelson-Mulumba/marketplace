"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "../components/AdminTopBar";
import AdminSidebar from "../components/AdminSidebar";
import "../../../styles/market.css";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;
  pictures: string[];
  type: string;
  price: number;
  quantity: number; // available stock
  measurement?: string; // ✅ new field
};

type CartItem = Product & { quantity: number };

export default function MarketPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [borrowerContact, setBorrowerContact] = useState("");

  // ✅ Fetch products + stock summary
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/kampala");
        if (!res.ok) return;
        const data: Omit<Product, "quantity">[] = await res.json();

        const stockRes = await fetch("/api/kampala/stock-summary");
        const stockData: {
          product: string;
          type: string;
          category: string;
          available_quantity: number;
          measurement?: string;
        }[] = await stockRes.json();

        const normalized: Product[] = data.map((p) => {
          let pics: string[] = [];
          try {
            pics = typeof p.pictures === "string" ? JSON.parse(p.pictures) : p.pictures || [];
          } catch {
            pics = [];
          }
          const stock = stockData.find((s) => s.product === p.name);
          return {
            ...p,
            pictures: pics,
            quantity: stock?.available_quantity ?? 0,
            type: stock?.type ?? p.type,
            category: stock?.category ?? p.category,
            measurement: stock?.measurement ?? "N/A", // ✅ fallback
          };
        });




        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);


  // ✅ Cart helpers
  const addToCart = (product: Product) =>
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.quantity) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        alert("❌ Cannot add more than available stock!");
        return prev;
      }
      if (product.quantity > 0) return [...prev, { ...product, quantity: 1 }];
      alert("❌ Product is out of stock!");
      return prev;
    });

  const removeFromCart = (product: Product) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = products.filter((p) =>
    [p.name, p.type, p.category].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <AdminTopBar />
      <div className="admin-container">
        <AdminSidebar />
        <main className="admin-main">
          {/* ✅ Search */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, type, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ✅ Product Grid */}
          <section className="product-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-image">
                  {p.pictures.length > 0 ? (
                    <Image src={p.pictures[0]} alt={p.name} width={150} height={150} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div className="quantity-controls">
                    <button className="minus-button" onClick={() => removeFromCart(p)}>
                      −
                    </button>
                    <button className="plus-button" onClick={() => addToCart(p)}>
                      +
                    </button>
                  </div>
                </div>
                <h3 className="product-title">{p.name}</h3>
                <p className="product-text">Category: {p.category}</p>
                <p className="product-text">Type: {p.type}</p>
                <p className="product-text">Measurement: {p.measurement}</p>

                <p className="product-text">Price: Shs {p.price}</p>
                <p className={p.quantity > 0 ? "in-stock" : "out-stock"}>
                  {p.quantity > 0
                    ? `✅ ${p.quantity} available`
                    : `❌ Out of Stock}`}
                </p>



              </div>
            ))}
          </section>
        </main>

        {/* ✅ Cart Sidebar */}
        <aside className="cart-sidebar">
          <h2>🛒 Cart</h2>
          {cart.length === 0 ? (
            <p>No items added.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <div className="cart-controls">
                  <button onClick={() => removeFromCart(item)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
                <span>Shs {item.price * item.quantity}</span>
              </div>
            ))
          )}
          <hr />
          <p>
            <strong>Total:</strong> Shs {total}
          </p>

          {/* ✅ Payment Method */}
          <div className="payment-method">
            <label htmlFor="payment">Select Payment:</label>
            <select
              id="payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="airtel">Airtel</option>
              <option value="mtn">MTN</option>
              <option value="loan">Loan</option>
            </select>
          </div>

          {/* ✅ Loan Fields */}
          {paymentMethod === "loan" && (
            <div className="loan-fields">
              <label htmlFor="borrowerName">Borrower Name</label>
              <input
                id="borrowerName"
                type="text"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                required
              />
              <label htmlFor="borrowerAddress">Address</label>
              <input
                id="borrowerAddress"
                type="text"
                value={borrowerAddress}
                onChange={(e) => setBorrowerAddress(e.target.value)}
                required
              />
              <label htmlFor="borrowerContact">Contact</label>
              <input
                id="borrowerContact"
                type="text"
                value={borrowerContact}
                onChange={(e) => setBorrowerContact(e.target.value)}
                required
              />
            </div>
          )}

          {/* ✅ Save Sale */}
          <button
            className="btn-save"
            onClick={async () => {
              const saleData = {
                date: new Date().toISOString(),
                products: cart.map((item) => ({
                  name: item.name,
                  unitPrice: item.price,
                  type: item.type,
                  category: item.category,
                  quantity: item.quantity,
                  measurement: item.measurement, // ✅ include
                })),
                totalAmount: total,
                paymentMethod,
              };


              const res = await fetch("/api/kampala/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData),
              });

              if (res.ok) {
                if (paymentMethod === "loan") {
                  const loanData = {
                    name: borrowerName,
                    address: borrowerAddress,
                    contact: borrowerContact,
                    products: saleData.products,
                    totalAmount: total,
                    loanStatus: "pending",
                    date: new Date().toISOString(),
                  };


                  await fetch("/api/kampala/loans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loanData),
                  });
                }

                alert("✅ Sale saved successfully!");
                setCart([]);
              } else {
                alert("❌ Failed to save sale!");
              }
            }}
          >
            Save Sale
          </button>
        </aside>
      </div>
    </div>
  );
}
