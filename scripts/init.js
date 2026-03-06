// scripts/init.js
import dotenv from "dotenv";
 dotenv.config({ path: ".env.local" });
import pool from "../lib/db.js";
import bcrypt from "bcryptjs";

async function init() {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    // Drop old tables first
    await pool.query(`DROP TABLE IF EXISTS orders CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS products CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS merchants CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS loans CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS admins CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

    // Enable pgcrypto for UUIDs
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Admins table
    await pool.query(`
      CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'staff',
        phone TEXT,
        address TEXT
      );
    `);

    // Loans table
    await pool.query(`
      CREATE TABLE loans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        applicant_name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT,
        items JSONB NOT NULL,
        total_cash NUMERIC NOT NULL,
        status TEXT CHECK (status IN ('Approved','Declined','Pending')) DEFAULT 'Pending',
        payment_status TEXT CHECK (payment_status IN ('Paid','Not Paid')) DEFAULT 'Not Paid'
      );
    `);

    // Merchants table
    await pool.query(`
      CREATE TABLE merchants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        supplies JSONB,
        location TEXT,
        address TEXT,
        logo_url TEXT,
        phone TEXT,
        verified BOOLEAN DEFAULT FALSE
      );
    `);

    // Products table
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        discounted_price NUMERIC,
        percentage TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        verified BOOLEAN DEFAULT FALSE,
        merchant TEXT,
        image_url TEXT
      );
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        status TEXT DEFAULT 'pending',
        address TEXT
      );
    `);

    // Users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT
      );
    `);

    // ✅ Seed an admin with a hashed password
    const hashedPassword = await bcrypt.hash("securepassword123", 10);

    await pool.query(
      `INSERT INTO admins (name, email, password, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING;`,
      [
        "mulumba",
        "liamivanmikaelson@gmail.com",
        hashedPassword,
        "superadmin",
        "+256757166457",
        "iganga",
      ]
    );

    console.log("✅ Tables dropped, recreated, and admin seeded successfully!");
  } catch (err) {
    console.error("❌ Error creating tables or seeding admin:", err);
  } finally {
    await pool.end();
  }
}

init();
