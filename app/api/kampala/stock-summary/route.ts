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
          COUNT(*) AS stock_count
        FROM kampala_stock
        GROUP BY product, type, category
      ),
      sales AS (
        SELECT 
          (jsonb_array_elements(products))->>'name' AS product,
          COUNT(*) AS sales_count
        FROM kampala_sales
        GROUP BY product
      )
      SELECT 
        s.product,
        s.type,
        s.category,
        COALESCE(s.stock_count,0) - COALESCE(sa.sales_count,0) AS available_quantity
      FROM stock s
      LEFT JOIN sales sa ON sa.product = s.product
      ORDER BY s.product ASC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching stock summary:", error);
    return NextResponse.json({ error: "Failed to fetch stock summary" }, { status: 500 });
  }
}
