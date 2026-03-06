import pool from "../lib/db.js";

import bcrypt from "bcryptjs";

(async () => {
  const res = await pool.query("SELECT * FROM admins WHERE email = $1", [
    "liamivanmikaelson@gmail.com",
  ]);
  const admin = res.rows[0];
  console.log("Hash in DB:", admin.password);

  const isMatch = await bcrypt.compare("securepassword123", admin.password);
  console.log("Password correct?", isMatch);
})();
