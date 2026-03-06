import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all kamuli sales
export async function GET() {
  const result = await pool.query("SELECT * FROM kamuli_sales ORDER BY date DESC");
  return NextResponse.json(result.rows);
}

// POST new kamuli sale
export async function POST(req: Request) {
  const body = await req.json();
  const { date, product, quantity, unit_price, total, payment_type } = body;

  const result = await pool.query(
    "INSERT INTO kamuli_sales (date, product, quantity, unit_price, total, payment_type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [date, product, quantity, unit_price, total, payment_type]
  );

  return NextResponse.json(result.rows[0]);
}
