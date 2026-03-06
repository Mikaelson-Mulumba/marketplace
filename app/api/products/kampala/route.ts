import { NextResponse } from "next/server";
import pool from "@/lib/db";

type ProductRow = {
  id: number;
  name: string;
  category: string;
  pictures: string | string[];
  type: string;
  price: number;
};

export async function GET() {
  const result = await pool.query("SELECT * FROM kampala_products ORDER BY id ASC");

  // ✅ Cast rows to ProductRow[]
  const normalized = (result.rows as ProductRow[]).map((p: ProductRow) => {
    let pics: string[] = [];
    try {
      pics =
        typeof p.pictures === "string"
          ? JSON.parse(p.pictures)
          : p.pictures || [];
    } catch {
      pics = [];
    }
    return { ...p, pictures: pics };
  });

  return NextResponse.json(normalized);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, category, pictures, type, price } = body;

  const result = await pool.query(
    `INSERT INTO kampala_products (name, category, pictures, type, price)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, category, JSON.stringify(pictures), type, price]
  );

  return NextResponse.json(result.rows[0]);
}
