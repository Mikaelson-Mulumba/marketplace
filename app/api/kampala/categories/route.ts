import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all Kampala categories
export async function GET() {
  const result = await pool.query("SELECT * FROM kampala_categories ORDER BY id ASC");
  return NextResponse.json(result.rows);
}

// POST new Kampala category
export async function POST(req: Request) {
  const body = await req.json();
  const { name } = body;

  const result = await pool.query(
    `INSERT INTO kampala_categories (name) VALUES ($1) RETURNING *`,
    [name]
  );

  return NextResponse.json(result.rows[0]);
}
