"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res  = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.ok) {
      router.push("/dashboard");
    } else {
      setError(data.message || "Username atau password salah.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      {/* bg grid */}
      <div style={styles.grid} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏢</div>
          <h1 style={styles.h1}>CorpNet Portal</h1>
          <p style={styles.sub}>Internal Employee System v2.4</p>
        </div>

        {error && <div style={styles.error}>⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={{...styles.btn, opacity: loading ? 0.7 : 1}} type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* hidden comment hint */}
        {/* TODO: dev note — log viewer moved to /logviewer, remove before go-live! */}
        <p style={styles.footer}>
          © 2024 CorpNet Inc. — All rights reserved<br/>
          <span style={{fontSize:11, color:"#1f2937"}}>Internal use only. Contact IT for account issues.</span>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f1117",
    position: "relative",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(99,102,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.07) 1px,transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    background: "#1a1d27",
    border: "1px solid #2d3148",
    borderRadius: 16,
    padding: "40px 36px",
    boxShadow: "0 25px 60px rgba(0,0,0,.5)",
  },
  logo: { textAlign: "center", marginBottom: 28 },
  logoIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56, height: 56,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    borderRadius: 14,
    fontSize: 28,
    marginBottom: 12,
  },
  h1:  { fontSize: 22, fontWeight: 700, letterSpacing: .5, color: "#e2e8f0" },
  sub: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  error: {
    background: "#2d1b1b",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 18,
  },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#9ca3af", marginBottom: 6 },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "#0f1117",
    border: "1px solid #2d3148",
    borderRadius: 8,
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 6,
  },
  footer: { textAlign: "center", marginTop: 24, fontSize: 12, color: "#374151" },
};
