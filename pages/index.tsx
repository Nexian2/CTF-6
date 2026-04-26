import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) router.push("/notes");
    else setError(data.error);
  }

  return (
    <>
      <Head><title>NoteKeeper — Login</title></Head>
      <div style={styles.bg}>
        <div style={styles.card}>
          <h1 style={styles.title}>📝 NoteKeeper</h1>
          <p style={styles.sub}>Platform catatan pribadi yang aman.</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Username</label>
            <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan username" required />
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" required />
            <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
          </form>
          <p style={styles.footer}>
            NoteKeeper v1.2 — <a href="/feedback" style={styles.link}>Kirim Feedback</a>
          </p>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bg:    { fontFamily: "'Segoe UI',sans-serif", background: "#f0f2f5", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  card:  { background: "#fff", borderRadius: 12, padding: "2rem", width: 380, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  title: { fontSize: "1.5rem", color: "#1a1a2e", marginBottom: 4 },
  sub:   { fontSize: ".82rem", color: "#999", marginBottom: "1.5rem" },
  label: { fontSize: ".83rem", color: "#555", display: "block", marginBottom: 5 },
  input: { width: "100%", padding: ".65rem .85rem", border: "1px solid #ddd", borderRadius: 7, fontSize: ".95rem", marginBottom: "1rem", boxSizing: "border-box" },
  btn:   { width: "100%", padding: ".72rem", background: "#5c6ef8", color: "#fff", border: "none", borderRadius: 7, fontSize: "1rem", cursor: "pointer" },
  error: { background: "#fff0f0", color: "#c0392b", fontSize: ".82rem", padding: ".6rem .8rem", borderRadius: 6, marginBottom: "1rem", border: "1px solid #f5c6c6" },
  footer:{ fontSize: ".75rem", color: "#bbb", textAlign: "center", marginTop: "1.2rem" },
  link:  { color: "#5c6ef8", textDecoration: "none" },
};
