import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Product = {
  name: string;
  type: string;
  category: string;
  price: number;
  supplier: string;
  contact: string;
  quantity: number; // ✅ include quantity
};

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
  const { date, products } = body as { date: string; products: Product[] };

  const total_amount = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
    0
  );

  const result = await pool.query(
    `UPDATE kampala_stock 
     SET date=$1, products=$2, total_amount=$3 
     WHERE id=$4 RETURNING *`,
    [date, JSON.stringify(products), total_amount, id]
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
