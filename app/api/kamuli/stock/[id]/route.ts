import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM kamuli_stock WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "Stock entry deleted" });
}
