import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      WITH stock AS (
        SELECT 
          (jsonb_array_elements(products))->>'name' AS product,
          (jsonb_array_elements(products))->>'type' AS type,
          (jsonb_array_elements(products))->>'category' AS category,
          ((jsonb_array_elements(products))->>'quantity')::int AS quantity
        FROM kampala_stock
      ),
      sales AS (
        SELECT product, SUM(quantity) AS sold
        FROM kampala_sales
        GROUP BY product
      )
      SELECT 
        s.product,
        s.type,
        s.category,
        COALESCE(SUM(s.quantity),0) - COALESCE(sa.sold,0) AS available_quantity
      FROM stock s
      LEFT JOIN sales sa ON sa.product = s.product
      GROUP BY s.product, s.type, s.category, sa.sold
      ORDER BY s.product ASC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching stock summary:", error);
    return NextResponse.json({ error: "Failed to fetch stock summary" }, { status: 500 });
  }
}
