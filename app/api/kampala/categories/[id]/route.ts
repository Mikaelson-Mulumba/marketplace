import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET by ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await pool.query("SELECT * FROM kampala_categories WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}

// PUT update
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const { name } = body;

  const result = await pool.query(
    `UPDATE kampala_categories SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id]
  );
  return NextResponse.json(result.rows[0]);
}

// DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await pool.query("DELETE FROM kampala_categories WHERE id = $1 RETURNING *", [id]);
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted successfully" });
}
