import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Save Loan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, contact, products, totalAmount, loanStatus } = body;

    const date = new Date().toISOString();

    await pool.query(
      `INSERT INTO kampala_loans (name, address, contact, products, total_amount, loan_status, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, address, contact, JSON.stringify(products), totalAmount, loanStatus, date]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving loan:", err);
    return NextResponse.json({ success: false, error: "Failed to save loan" }, { status: 500 });
  }
}

// ✅ Get All Loans
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, address, contact, products, total_amount, loan_status, date
       FROM kampala_loans
       ORDER BY date DESC`
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching loans:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch loans" }, { status: 500 });
  }
}
