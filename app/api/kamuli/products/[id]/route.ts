import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET single product
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const result = await pool.query("SELECT * FROM kamuli_products WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// ✅ UPDATE product
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const { name, category, pictures, type, price } = body;

  const result = await pool.query(
    `UPDATE kamuli_products
     SET name=$1, category=$2, pictures=$3, type=$4, price=$5
     WHERE id=$6 RETURNING *`,
    [name, category, JSON.stringify(pictures), type, price, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// ✅ DELETE product
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await pool.query("DELETE FROM kamuli_products WHERE id = $1", [id]);
  return NextResponse.json({ message: "Product deleted" });
}
