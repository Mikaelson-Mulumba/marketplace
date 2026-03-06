"use client";

import { useState } from "react";

export default function TestLogin() {
  const [result, setResult] = useState<string>("");

  const handleTest = async () => {
    const res = await fetch("/api/admins/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "liamivanmikaelson@gmail.com",
        password: "securepassword123",
      }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔑 Test Admin Login</h2>
      <button onClick={handleTest}>Run Login Test</button>
      <pre style={{ marginTop: "1rem", background: "#eee", padding: "1rem" }}>
        {result}
      </pre>
    </div>
  );
}
