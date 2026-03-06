import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET all products
export async function GET() {
  const result = await pool.query("SELECT * FROM kamuli_products ORDER BY id ASC");
  return NextResponse.json(result.rows);
}

// ✅ POST new product
export async function POST(req: Request) {
  const body = await req.json();
  const { name, category, pictures, type, price } = body;

  const result = await pool.query(
    `INSERT INTO kamuli_products (name, category, pictures, type, price)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, category, JSON.stringify(pictures), type, price]
  );

  return NextResponse.json(result.rows[0]);
}
