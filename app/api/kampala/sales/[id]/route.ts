import { NextResponse } from "next/server";
import pool from "@/lib/db";

// DELETE sale by ID (Promise style)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }   // 👈 params typed as Promise
) {
  try {
    const { id } = await context.params; // 👈 must await

    if (!id) {
      return NextResponse.json(
        { error: "Sale ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM kampala_sales WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error deleting sale:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete sale" },
      { status: 500 }
    );
  }
}
