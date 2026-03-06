import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Neon connection
import bcrypt from "bcryptjs"; // ✅ add bcrypt

// GET all users
export async function GET() {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return NextResponse.json(result.rows);
}

// POST new user
export async function POST(req: Request) {
  const body = await req.json();
  const { username, password, role, contact } = body;

  // ✅ Hash the password for secure storage
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (username, role, password, plain_password, contact)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [username, role, hashed, password, contact] // hashed in password, plain in plain_password
  );

  return NextResponse.json(result.rows[0]);
}
