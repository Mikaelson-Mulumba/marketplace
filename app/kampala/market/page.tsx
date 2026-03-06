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
  inStock: boolean;
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


  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/kampala");
        if (!res.ok) return;
        const data: Product[] = await res.json();

        const normalized = data.map((p) => {
          let pics: string[] = [];
          try {
            pics =
              typeof p.pictures === "string"
                ? JSON.parse(p.pictures)
                : p.pictures || [];
          } catch {
            pics = [];
          }
          return { ...p, pictures: pics };
        });

        setProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add product to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ Remove product from cart
  const removeFromCart = (product: Product) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ✅ Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Filter products by search
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
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, type, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <section className="product-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-image">
                  {p.pictures.length > 0 ? (
                    <Image
                      src={p.pictures[0]}
                      alt={p.name}
                      width={150}
                      height={150}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div className="quantity-controls">
                    <button className="minus-button" onClick={() => removeFromCart(p)}>−</button>
                    <button className="plus-button" onClick={() => addToCart(p)}>+</button>
                  </div>
                </div>
                <h3 className="product-title">{p.name}</h3>
                <p className="product-text">Category: {p.category}</p>
                <p className="product-text">Type: {p.type}</p>
                <p className="product-text">Price: Shs {p.price}</p>
                <p className={p.inStock ? "in-stock" : "out-stock"}>
                  {p.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                </p>
              </div>
            ))}
          </section>
        </main>

        {/* ✅ Fixed Cart Sidebar */}
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
          <p><strong>Total:</strong> Shs {total}</p>

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

          {/* ✅ Borrower Fields (only if Loan) */}
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

          {/* ✅ Save Sale Button */}
          <button
            className="btn-save"
            onClick={async () => {
              const saleData = {
                date: new Date().toISOString(),
                products: cart.map(item => ({
                  name: item.name,
                  unitPrice: item.price,
                  quantity: item.quantity
                })),
                totalAmount: total,
                paymentMethod
              };

              // Save sale
              const res = await fetch("/api/kampala/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData)
              });

              if (res.ok) {
                // If loan, also save loan record
                if (paymentMethod === "loan") {
                  const loanData = {
                    name: borrowerName,
                    address: borrowerAddress,
                    contact: borrowerContact,
                    products: saleData.products,
                    totalAmount: total,
                    loanStatus: "pending",
                    date: new Date().toISOString()
                  };

                  await fetch("/api/kampala/loans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loanData)
                  });
                }

                alert("✅ Sale saved successfully!");
                setCart([]); // clear cart
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
