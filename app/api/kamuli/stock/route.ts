import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all kamuli stock
export async function GET() {
  const result = await pool.query("SELECT * FROM kamuli_stock ORDER BY date DESC");
  return NextResponse.json(result.rows);
}

// POST new kamuli stock entry
export async function POST(req: Request) {
  const body = await req.json();
  const { date, product, type, quantity, price, supplier, contact } = body;

  const result = await pool.query(
    "INSERT INTO kamuli_stock (date, product, type, quantity, price, supplier, contact) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [date, product, type, quantity, price, supplier, contact]
  );

  return NextResponse.json(result.rows[0]);
}
