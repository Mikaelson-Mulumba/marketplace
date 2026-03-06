"use client"; // Next.js App Router

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../styles/nav.css";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Image src="/logo.png" alt="LimaPro Logo" width={60} height={60} />
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/market">Market</Link></li>
          <li><Link href="/login">Login</Link></li>
        </ul>

        {/* Hamburger (mobile only) */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <ul className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <li><Link href="/" onClick={() => setIsOpen(false)}>Home</Link></li>
        <li><Link href="/market" onClick={() => setIsOpen(false)}>Market</Link></li>
        <li><Link href="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
      </ul>
    </nav>
  );
}
