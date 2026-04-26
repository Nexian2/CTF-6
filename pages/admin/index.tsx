import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminLogin() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_key: accessKey, username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) router.push("/admin/dashboard");
    else setError(data.error);
  }

  return (
    <>
      <Head><title>Admin Panel — NoteKeeper</title></Head>
      <div style={styles.bg}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔒 Admin Panel</h1>
          <p style={styles.sub}>Akses terbatas. Diperlukan <span style={styles.badge}>access_key</span>.</p>
          {error && <div style={styles.error}>⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Access Key</label>
            <input style={styles.input} value={accessKey} onChange={e => setAccessKey(e.target.value)} placeholder="Masukkan access key..." required />
            <hr style={styles.divider} />
            <label style={styles.label}>Admin Username</label>
            <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username admin" required />
            <label style={styles.label}>Admin Password</label>
            <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password admin" required />
            <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Memverifikasi..." : "Masuk ke Panel"}</button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bg:      { fontFamily: "'Segoe UI',sans-serif", background: "#0f0f1a", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  card:    { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12, padding: "2.2rem", width: 400 },
  title:   { fontSize: "1.3rem", color: "#e0e0ff", marginBottom: 4 },
  sub:     { fontSize: ".8rem", color: "#666", marginBottom: "1.5rem" },
  label:   { fontSize: ".8rem", color: "#888", display: "block", marginBottom: 5 },
  input:   { width: "100%", padding: ".65rem .85rem", background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: 7, fontSize: ".93rem", color: "#ddd", marginBottom: "1rem", boxSizing: "border-box", fontFamily: "inherit" },
  btn:     { width: "100%", padding: ".7rem", background: "#5c6ef8", color: "#fff", border: "none", borderRadius: 7, fontSize: ".95rem", cursor: "pointer" },
  error:   { background: "#2a0a0a", color: "#f87171", fontSize: ".8rem", padding: ".6rem .8rem", borderRadius: 6, marginBottom: "1rem", border: "1px solid #5a1a1a" },
  divider: { border: "none", borderTop: "1px solid #2a2a4a", margin: "1rem 0" },
  badge:   { display: "inline-block", background: "#1e1e3a", color: "#5c6ef8", fontSize: ".72rem", padding: "3px 8px", borderRadius: 4, border: "1px solid #2a2a5a" },
};
