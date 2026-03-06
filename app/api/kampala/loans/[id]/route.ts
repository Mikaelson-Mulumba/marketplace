import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Update Loan Status
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  try {
    const { id } = await context.params; // ✅ unwrap with await
    const body = await req.json();
    const { loan_status } = body;

    await pool.query(
      `UPDATE kampala_loans SET loan_status = $1 WHERE id = $2`,
      [loan_status, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating loan:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update loan" },
      { status: 500 }
    );
  }
}

// ✅ Delete Loan
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ unwrap with await

    await pool.query(`DELETE FROM kampala_loans WHERE id = $1`, [id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting loan:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete loan" },
      { status: 500 }
    );
  }
}
