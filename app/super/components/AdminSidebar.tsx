"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

import { usePathname } from "next/navigation";
import "../../../styles/sidebar.css";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(
    typeof window !== "undefined" && localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [stockOpen, setStockOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false); 
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
            href="/super"
            className={`sidebar-link ${pathname === "/super" ? "active" : ""}`}
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
                href="/super/stock/kampala"
                className={`sidebar-sublink ${pathname === "/super/stock/kampala" ? "active" : ""}`}
              >
                📦 Katwala Stock
              </Link>
            </li>
            <li>
              <Link
                href="/super/stock/kamuli"
                className={`sidebar-sublink ${pathname === "/super/stock/kamuli" ? "active" : ""}`}
              >
                📦 Roger Stock
              </Link>
            </li>
          </ul>
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
                href="/super/products/kampala"
                className={`sidebar-sublink ${pathname === "/super/products/kampala" ? "active" : ""}`}
              >
                🛒 Katwala Products
              </Link>
            </li>
            <li>
              <Link
                href="/super/products/kamuli"
                className={`sidebar-sublink ${pathname === "/super/products/kamuli" ? "active" : ""}`}
              >
                🛒 Roger Products
              </Link>
            </li>
          </ul>
        </li>

      
        <li>
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)} // ✅ use categoriesOpen state
            className="sidebar-button"
            data-tooltip="Categories"
          >
            <ChartBarIcon className="icon" /> {!collapsed && "Categories"}
            {!collapsed &&
              (categoriesOpen ? (
                <ChevronDownIcon className="chevron" />
              ) : (
                <ChevronRightIcon className="chevron" />
              ))}
          </button>

          <ul className={`sidebar-sublist ${categoriesOpen && !collapsed ? "open" : ""}`}>
            <li>
              <Link
                href="/super/categories/kampala"
                className={`sidebar-sublink ${pathname === "/super/categories/kampala" ? "active" : ""
                  }`}
              >
                🗂 Katwala Categories
              </Link>
            </li>
            <li>
              <Link
                href="/super/categories/kamuli"
                className={`sidebar-sublink ${pathname === "/super/categories/kamuli" ? "active" : ""
                  }`}
              >
                🗂 Roger Categories
              </Link>
            </li>
          </ul>
        </li>


        {/* Sales */}
        <li>
          <button
            type="button"
            onClick={() => setSalesOpen(!salesOpen)}
            className="sidebar-button"
            data-tooltip="Sales"
          >
            <CurrencyDollarIcon className="icon" /> {!collapsed && "Sales"}
            {!collapsed &&
              (salesOpen ? <ChevronDownIcon className="chevron" /> : <ChevronRightIcon className="chevron" />)}
          </button>
          <ul className={`sidebar-sublist ${salesOpen && !collapsed ? "open" : ""}`}>
            <li>
              <Link
                href="/super/sales/kampala"
                className={`sidebar-sublink ${pathname === "/super/sales/kampala" ? "active" : ""}`}
              >
                💰 Katwala Sales
              </Link>
            </li>
            <li>
              <Link
                href="/super/sales/kamuli"
                className={`sidebar-sublink ${pathname === "/super/sales/kamuli" ? "active" : ""}`}
              >
                💰 Roger Sales
              </Link>
            </li>
          </ul>
        </li>

        {/* Reports */}
        <li>
          <button
            type="button"
            onClick={() => setReportsOpen(!reportsOpen)}
            className="sidebar-button"
            data-tooltip="Reports"
          >
            <ChartBarIcon className="icon" /> {!collapsed && "Reports"}
            {!collapsed &&
              (reportsOpen ? <ChevronDownIcon className="chevron" /> : <ChevronRightIcon className="chevron" />)}
          </button>
          <ul className={`sidebar-sublist ${reportsOpen && !collapsed ? "open" : ""}`}>
            <li>
              <Link
                href="/super/reports/kampala"
                className={`sidebar-sublink ${pathname === "/super/reports/kampala" ? "active" : ""}`}
              >
                📊 Katwala Reports
              </Link>
            </li>
            <li>
              <Link
                href="/super/reports/kamuli"
                className={`sidebar-sublink ${pathname === "/super/reports/kamuli" ? "active" : ""}`}
              >
                📊 Roger Reports
              </Link>
            </li>
          </ul>
        </li>

        {/* Users */}
        <li>
          <Link
            href="/super/users"
            className={`sidebar-link ${pathname === "/super/users" ? "active" : ""}`}
            data-tooltip="Users"
          >
            <UsersIcon className="icon" /> {!collapsed && "Users"}
          </Link>
        </li>

        {/* Loans */}
        <li>
          <button
            type="button"
            onClick={() => setLoansOpen(!loansOpen)}
            className="sidebar-button"
            data-tooltip="Loans"
          >
            <BanknotesIcon className="icon" /> {!collapsed && "Loans"}
            {!collapsed &&
              (loansOpen ? <ChevronDownIcon className="chevron" /> : <ChevronRightIcon className="chevron" />)}
          </button>
          <ul className={`sidebar-sublist ${loansOpen && !collapsed ? "open" : ""}`}>
            <li>
              <Link
                href="/super/loans/kampala"
                className={`sidebar-sublink ${pathname === "/super/loans/kampala" ? "active" : ""}`}
              >
                💵 Katwala Loans
              </Link>
            </li>
            <li>
              <Link
                href="/super/loans/kamuli"
                className={`sidebar-sublink ${pathname === "/super/loans/kamuli" ? "active" : ""}`}
              >
                💵 Roger Loans
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}
