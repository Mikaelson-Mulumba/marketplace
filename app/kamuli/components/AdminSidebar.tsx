"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [collapsed, setCollapsed] = useState(
    typeof window !== "undefined" && localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [stockOpen, setStockOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState));
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Collapse Toggle */}
      <button
        type="button"
        className="collapse-toggle"
        onClick={toggleCollapse}
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <Bars3Icon className="icon" />
      </button>

      <ul className="sidebar-list">
        {/* Home */}
        <li>
          <Link
            href="/kamuli"
            className={`sidebar-link ${pathname === "/kamuli" ? "active" : ""}`}
            data-tooltip="Home"
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
                href="/kamuli/stock/add"
                className={`sidebar-sublink ${pathname === "/kamuli/stock/add" ? "active" : ""}`}
                data-tooltip="Add Stock"
              >
                ➕ Add Stock
              </Link>
            </li>
            <li>
              <Link
                href="/kamuli/stock"
                className={`sidebar-sublink ${pathname === "/kamuli/stock" ? "active" : ""}`}
                data-tooltip="Stock List"
              >
                📋 Stock List
              </Link>
            </li>
          </ul>
        </li>
          {/* Categories */}
        <li>
          <Link
            href="/kamuli/categories"
            className={`sidebar-link ${pathname === "/kamuli/categories" ? "active" : ""}`}
            data-tooltip="Cartegories"
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
                href="/kamuli/products/add"
                className={`sidebar-sublink ${pathname === "/kamuli/products/add" ? "active" : ""}`}
                data-tooltip="Add Product"
              >
                ➕ Add Product
              </Link>
            </li>
            <li>
              <Link
                href="/kamuli/products"
                className={`sidebar-sublink ${pathname === "/kamuli/products" ? "active" : ""}`}
                data-tooltip="Product List"
              >
                📋 Product List
              </Link>
            </li>
          </ul>
        </li>

        {/* Market */}
        <li>
          <Link
            href="/kamuli/market"
            className={`sidebar-link ${pathname === "/kamuli/market" ? "active" : ""}`}
            data-tooltip="Market"
          >
            <BuildingStorefrontIcon className="icon" /> {!collapsed && "Market"}
          </Link>
        </li>

        {/* Sales */}
        <li>
          <Link
            href="/kamuli/sales"
            className={`sidebar-link ${pathname === "/kamuli/sales" ? "active" : ""}`}
            data-tooltip="Sales"
          >
            <CurrencyDollarIcon className="icon" /> {!collapsed && "Sales"}
          </Link>
        </li>

        {/* Reports */}
        <li>
          <Link
            href="/kamuli/reports"
            className={`sidebar-link ${pathname === "/kamuli/reports" ? "active" : ""}`}
            data-tooltip="Reports"
          >
            <ChartBarIcon className="icon" /> {!collapsed && "Reports"}
          </Link>
        </li>

        {/* Users */}
        <li>
          <Link
            href="/kamuli/users"
            className={`sidebar-link ${pathname === "/kamuli/users" ? "active" : ""}`}
            data-tooltip="Users"
          >
            <UsersIcon className="icon" /> {!collapsed && "Users"}
          </Link>
        </li>

        {/* Loans */}
        <li>
          <Link
            href="/kamuli/loans"
            className={`sidebar-link ${pathname === "/kamuli/loans" ? "active" : ""}`}
            data-tooltip="Loans"
          >
            <BanknotesIcon className="icon" /> {!collapsed && "Loans"}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
