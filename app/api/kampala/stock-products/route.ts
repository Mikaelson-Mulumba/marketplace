import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Expand JSONB array into rows
    const result = await pool.query(`
      SELECT 
        (jsonb_array_elements(products))->>'name' AS product,
        (jsonb_array_elements(products))->>'type' AS type,
        (jsonb_array_elements(products))->>'category' AS category,
        (jsonb_array_elements(products))->>'price' AS price
      FROM kampala_stock
      ORDER BY product ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching stock products:", error);
    return NextResponse.json({ error: "Failed to fetch stock products" }, { status: 500 });
  }
}
