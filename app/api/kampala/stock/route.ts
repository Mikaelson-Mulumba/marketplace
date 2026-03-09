import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Product = {
  name: string;
  type: string;
  category: string;
  price: number;
  supplier: string;
  contact: string;
  quantity: number; 
   measurement?: string;
};

// GET all Kampala stock entries
export async function GET() {
  const result = await pool.query("SELECT * FROM kampala_stock ORDER BY date DESC");
  return NextResponse.json(result.rows);
}

// POST new Kampala stock entry
export async function POST(req: Request) {
  const body = await req.json();
  const { date, products } = body as { date: string; products: Product[] };

  // ✅ Calculate total amount as sum of price * quantity
  const total_amount = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
    0
  );

  const result = await pool.query(
    "INSERT INTO kampala_stock (date, products, total_amount) VALUES ($1, $2, $3) RETURNING *",
    [date, JSON.stringify(products), total_amount]
  );

  return NextResponse.json(result.rows[0]);
}
