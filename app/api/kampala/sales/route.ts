import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Save Sale
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, products, totalAmount, paymentMethod } = body;

    await pool.query(
      `INSERT INTO kampala_sales (date, products, total_amount, payment_method)
       VALUES ($1, $2, $3, $4)`,
      [date, JSON.stringify(products), totalAmount, paymentMethod]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving sale:", err);
    return NextResponse.json({ success: false, error: "Failed to save sale" }, { status: 500 });
  }
}

// ✅ Get All Sales
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, date, products, total_amount, payment_method
       FROM kampala_sales
       ORDER BY date DESC`
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching sales:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch sales" }, { status: 500 });
  }
}
