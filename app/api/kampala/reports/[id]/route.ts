import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM kampala_reports WHERE id = $1", [params.id]);
  return NextResponse.json({ message: "Report deleted" });
}
