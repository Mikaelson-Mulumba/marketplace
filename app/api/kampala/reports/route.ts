import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all kampala reports
export async function GET() {
  const result = await pool.query("SELECT * FROM kampala_reports ORDER BY date DESC");
  return NextResponse.json(result.rows);
}

// POST new kampala report
export async function POST(req: Request) {
  const body = await req.json();
  const { date, report, file_path } = body;

  const result = await pool.query(
    "INSERT INTO kampala_reports (date, report, file_path) VALUES ($1,$2,$3) RETURNING *",
    [date, report, file_path]
  );

  return NextResponse.json(result.rows[0]);
}
