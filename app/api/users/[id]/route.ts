import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

// GET user by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

// PUT update user by ID
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const { username, role, password, plain_password, contact } = body;

  // ✅ Hash the password before saving
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `UPDATE users
     SET username = $1, role = $2, password = $3, plain_password = $4, contact = $5
     WHERE id = $6 RETURNING *`,
    [username, role, hashed, plain_password, contact, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

// DELETE user by ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User deleted successfully" });
}
