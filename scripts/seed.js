import bcrypt from "bcryptjs";
import pool from "../lib/db.js"; // adjust path if needed

async function seedUsers() {
  try {
    // 🚨 Drop the table if it exists
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

    // ✅ Recreate the table with plain_password + contact
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (
          role IN ('kampala', 'superadmin', 'kamuli', 'kampalauser', 'kamuliuser')
        ),
        password VARCHAR(255) NOT NULL,        -- hashed password
        plain_password VARCHAR(255) NOT NULL,  -- original password
        contact VARCHAR(255),                  -- phone/email/etc
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Users to insert
    const users = [
      { username: "admin_kampala", role: "kampala", password: "temp123", contact: "0700000001" },
      { username: "super_admin", role: "superadmin", password: "temp123", contact: "0700000002" },
      { username: "admin_kamuli", role: "kamuli", password: "temp123", contact: "0700000003" },
      { username: "user_kampala", role: "kampalauser", password: "temp123", contact: "0700000004" },
      { username: "user_kamuli", role: "kamuliuser", password: "temp123", contact: "0700000005" },
    ];

    for (const u of users) {
      const hashed = await bcrypt.hash(u.password, 10);
      await pool.query(
        `INSERT INTO users (username, role, password, plain_password, contact)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO NOTHING;`,
        [u.username, u.role, hashed, u.password, u.contact]
      );
    }

    console.log("✅ Dropped old table, created new one, and seeded users!");
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  } finally {
    await pool.end();
  }
}

seedUsers();
