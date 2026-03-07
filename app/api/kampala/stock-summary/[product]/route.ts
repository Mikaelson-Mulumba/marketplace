import { NextResponse } from "next/server";
import pool from "@/lib/db";

// DELETE stock summary row by product name (Promise style)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ product: string }> }   // 👈 params typed as Promise
) {
  try {
    const { product } = await context.params; // 👈 must await

    if (!product) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM kampala_stock_summary WHERE product = $1 RETURNING *`,
      [product]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
