import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, product, type FROM kampala_stock ORDER BY product ASC"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching stock products:", error);
    return NextResponse.json({ error: "Failed to fetch stock products" }, { status: 500 });
  }
}
