import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET single stock entry
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params
  const result = await pool.query("SELECT * FROM kampala_stock WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// UPDATE stock entry
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params
  const body = await req.json();
  const { date, product, type, quantity, price, supplier, contact } = body;

  const result = await pool.query(
    `UPDATE kampala_stock 
     SET date=$1, product=$2, type=$3, quantity=$4, price=$5, supplier=$6, contact=$7 
     WHERE id=$8 RETURNING *`,
    [date, product, type, quantity, price, supplier, contact, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// DELETE stock entry
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params
  await pool.query("DELETE FROM kampala_stock WHERE id = $1", [id]);
  return NextResponse.json({ message: "Stock entry deleted" });
}
