import { NextResponse } from "next/server";
import pool from "@/lib/db";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  pictures: string; // stored as JSON string in DB
  type: string;
  price: number;
};

// ✅ GET all products
export async function GET() {
  try {
    const result = await pool.query<ProductRow>("SELECT * FROM kampala_products ORDER BY id ASC");

    // Ensure pictures are parsed into arrays
    const products = result.rows.map((row: ProductRow) => ({
      ...row,
      pictures: (() => {
        try {
          return JSON.parse(row.pictures) as string[];
        } catch {
          return row.pictures ? [row.pictures] : [];
        }
      })(),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ POST new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, pictures, type, measurement, price } = body;

    // Ensure pictures is always an array
    const picturesArray: string[] = Array.isArray(pictures) ? pictures : [pictures];

    const result = await pool.query<ProductRow>(
      `INSERT INTO kampala_products (name, category, pictures, type, measurement, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, category, JSON.stringify(picturesArray), type, measurement, price] // ✅ include measurement
    );

    // Parse pictures back into array for response
    const product = {
      ...result.rows[0],
      pictures: picturesArray,
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

