// app/api/kampala/stock-summary/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT product, type, category, available_quantity, measurement
      FROM kampala_stock_summary
      ORDER BY product ASC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching stock summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock summary" },
      { status: 500 }
    );
  }
}
