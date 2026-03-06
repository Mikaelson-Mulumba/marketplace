"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import "../../../styles/sidebar.css";

export default function AdminSidebar() {
  const pathname = usePathname();

  // ✅ Single declaration for collapsed
  const [collapsed, setCollapsed] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Sync collapsed state with localStorage after hydration
 useEffect(() => {
  const saved = localStorage.getItem("sidebar-collapsed");
  if (saved === "true") {
    // ✅ schedule state update safely
    setTimeout(() => setCollapsed(true), 0);
  }
}, []);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  // ✅ Swipe gestures
  useEffect(() => {
    let startX = 0;
    let currentX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const diff = currentX - startX;

      if (startX < 50 && diff > 80) {
        setMobileOpen(true); // swipe right → open
      }
      if (diff < -80 && mobileOpen) {
        setMobileOpen(false); // swipe left → close
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
        {/* Collapse Toggle (desktop) */}
        <button
          type="button"
          className="collapse-toggle"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"} // ✅ accessibility
        >
          <Bars3Icon className="icon" />
        </button>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close Menu" : "Open Menu"} // ✅ accessibility
        >
          <Bars3Icon className="icon" />
        </button>

        <ul className="sidebar-list">
          <li>
            <Link
              href="/kampala"
              className={`sidebar-link ${pathname === "/kampala" ? "active" : ""}`}
              data-tooltip="Home"
              onClick={() => setMobileOpen(false)}
            >
              <HomeIcon className="icon" /> {!collapsed && "Home"}
            </Link>
          </li>

          {/* Stock */}
          <li>
            <button
              type="button"
              onClick={() => setStockOpen(!stockOpen)}
              className="sidebar-button"
              data-tooltip="Stock"
            >
              <ClipboardDocumentListIcon className="icon" /> {!collapsed && "Stock"}
              {!collapsed &&
                (stockOpen ? <ChevronDownIcon className="chevron" /> : <ChevronRightIcon className="chevron" />)}
            </button>
            <ul className={`sidebar-sublist ${stockOpen && !collapsed ? "open" : ""}`}>
              <li>
                <Link
                  href="/kampala/stock/add"
                  className={`sidebar-sublink ${pathname === "/kampala/stock/add" ? "active" : ""}`}
                  data-tooltip="Add Stock"
                  onClick={() => setMobileOpen(false)}
                >
                  ➕ Add Stock
                </Link>
              </li>
              <li>
                <Link
                  href="/kampala/stock"
                  className={`sidebar-sublink ${pathname === "/kampala/stock" ? "active" : ""}`}
                  data-tooltip="Stock List"
                  onClick={() => setMobileOpen(false)}
                >
                  📋 Stock List
                </Link>
              </li>
            </ul>
          </li>

          {/* Categories */}
          <li>
            <Link
              href="/kampala/categories"
              className={`sidebar-link ${pathname === "/kampala/categories" ? "active" : ""}`}
              data-tooltip="Categories"
              onClick={() => setMobileOpen(false)}
            >
              <BuildingStorefrontIcon className="icon" /> {!collapsed && "Categories"}
            </Link>
          </li>

          {/* Products */}
          <li>
            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              className="sidebar-button"
              data-tooltip="Products"
            >
              <ShoppingCartIcon className="icon" /> {!collapsed && "Products"}
              {!collapsed &&
                (productsOpen ? <ChevronDownIcon className="chevron" /> : <ChevronRightIcon className="chevron" />)}
            </button>
            <ul className={`sidebar-sublist ${productsOpen && !collapsed ? "open" : ""}`}>
              <li>
                <Link
                  href="/kampala/products/add"
                  className={`sidebar-sublink ${pathname === "/kampala/products/add" ? "active" : ""}`}
                  data-tooltip="Add Product"
                  onClick={() => setMobileOpen(false)}
                >
                  ➕ Add Product
                </Link>
              </li>
              <li>
                <Link
                  href="/kampala/products"
                  className={`sidebar-sublink ${pathname === "/kampala/products" ? "active" : ""}`}
                  data-tooltip="Product List"
                  onClick={() => setMobileOpen(false)}
                >
                  📋 Product List
                </Link>
              </li>
            </ul>
          </li>

          {/* Market */}
          <li>
            <Link
              href="/kampala/market"
              className={`sidebar-link ${pathname === "/kampala/market" ? "active" : ""}`}
              data-tooltip="Market"
              onClick={() => setMobileOpen(false)}
            >
              <BuildingStorefrontIcon className="icon" /> {!collapsed && "Market"}
            </Link>
          </li>

          {/* Sales */}
          <li>
            <Link
              href="/kampala/sales"
              className={`sidebar-link ${pathname === "/kampala/sales" ? "active" : ""}`}
              data-tooltip="Sales"
              onClick={() => setMobileOpen(false)}
            >
              <CurrencyDollarIcon className="icon" /> {!collapsed && "Sales"}
            </Link>
          </li>

          {/* Reports */}
          <li>
            <Link
              href="/kampala/reports"
              className={`sidebar-link ${pathname === "/kampala/reports" ? "active" : ""}`}
              data-tooltip="Reports"
              onClick={() => setMobileOpen(false)}
            >
              <ChartBarIcon className="icon" /> {!collapsed && "Reports"}
            </Link>
          </li>

          {/* Users */}
          <li>
            <Link
              href="/kampala/users"
              className={`sidebar-link ${pathname === "/kampala/users" ? "active" : ""}`}
              data-tooltip="Users"
              onClick={() => setMobileOpen(false)}
            >
              <UsersIcon className="icon" /> {!collapsed && "Users"}
            </Link>
          </li>

          {/* Loans */}
          <li>
            <Link
              href="/kampala/loans"
              className={`sidebar-link ${pathname === "/kampala/loans" ? "active" : ""}`}
              data-tooltip="Loans"
              onClick={() => setMobileOpen(false)}
            >
              <BanknotesIcon className="icon" /> {!collapsed && "Loans"}
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
