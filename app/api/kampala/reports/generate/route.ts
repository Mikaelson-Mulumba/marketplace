import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface Sale { id: string; total_amount: number; date: string }
interface Loan { id: string; loan_status: string; total_amount: number; date: string }
interface StockMovement { id: string; added: number; sold: number; date: string }

export async function POST(req: Request) {
  try {
    const { period } = await req.json();
    const now = new Date();
    let startDate: Date = new Date();

    if (period === "day") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      const day = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Sales in period
    const salesResult = await pool.query(
      `SELECT id, total_amount, date 
       FROM kampala_sales 
       WHERE date >= $1 AND date <= $2`,
      [startDate.toISOString(), now.toISOString()]
    );
    const sales: Sale[] = salesResult.rows;
    const totalSales = sales.reduce((sum, s) => sum + s.total_amount, 0);

    // Loans in period
    const loansResult = await pool.query(
      `SELECT id, loan_status, total_amount, date 
       FROM kampala_loans 
       WHERE date >= $1 AND date <= $2`,
      [startDate.toISOString(), now.toISOString()]
    );
    const loans: Loan[] = loansResult.rows;
    const totalLoans = loans.reduce((sum, l) => sum + l.total_amount, 0);

    // Stock movements (added/sold) in period
    const stockResult = await pool.query(
      `SELECT id, added, sold, date 
       FROM kampala_stock 
       WHERE date >= $1 AND date <= $2`,
      [startDate.toISOString(), now.toISOString()]
    );
    const stockMovements: StockMovement[] = stockResult.rows;

    // Opening stock = last known closing balance before period
    const openingResult = await pool.query(
      `SELECT closing_balance 
       FROM kampala_stock 
       WHERE date < $1 
       ORDER BY date DESC 
       LIMIT 1`,
      [startDate.toISOString()]
    );
    const openingStock = openingResult.rows.length > 0 ? openingResult.rows[0].closing_balance : 0;

    // Closing stock = opening + added − sold
    const totalAdded = stockMovements.reduce((sum, s) => sum + (s.added || 0), 0);
    const totalSold = stockMovements.reduce((sum, s) => sum + (s.sold || 0), 0);
    const closingStock = openingStock + totalAdded - totalSold;

    return NextResponse.json({
      sales,
      loans,
      stock: stockMovements,
      summary: { totalSales, totalLoans, openingStock, totalAdded, totalSold, closingStock }
    });
  } catch (err) {
    console.error("Error generating report:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
