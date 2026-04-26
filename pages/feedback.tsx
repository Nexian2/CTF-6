import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function FeedbackPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/feedback").then(r => {
      if (r.status === 401) { router.push("/"); return null; }
      return r.json();
    }).then(d => { if (d) setFeedbacks(d.feedbacks); });
  }, [success]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    setLoading(false);
    setName(""); setMessage(""); setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <>
      <Head><title>NoteKeeper — Feedback</title></Head>
      <div style={styles.page}>
        <nav style={styles.nav}>
          <span style={styles.navTitle}>📝 NoteKeeper</span>
          <div>
            <a href="/notes" style={styles.navLink}>Catatan</a>
            <a href="/api/logout" style={styles.navLink}>Logout</a>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.h2}>Kirim Feedback ke Admin</h2>
            {success && <div style={styles.success}>✓ Feedback terkirim! Admin akan membacanya segera.</div>}
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Nama</label>
              <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu" required />
              <label style={styles.label}>Pesan</label>
              <textarea style={styles.textarea} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tulis pesanmu di sini..." required />
              <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Mengirim..." : "Kirim Feedback"}</button>
            </form>
            <p style={styles.hint}>* Feedback kamu akan ditampilkan di halaman ini dan dibaca oleh admin.</p>
          </div>

          {feedbacks.length > 0 && (
            <div style={styles.card}>
              <h2 style={styles.h2}>Feedback Terbaru</h2>
              {feedbacks.map((fb, i) => (
                <div key={i} style={styles.fbItem}>
                  {/* INTENTIONALLY VULNERABLE: dangerouslySetInnerHTML tanpa sanitasi */}
                  <div style={styles.fbName} dangerouslySetInnerHTML={{ __html: fb.name }} />
                  <div style={styles.fbMsg}  dangerouslySetInnerHTML={{ __html: fb.message }} />
                  <div style={styles.fbTime}>{fb.created_at}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page:     { fontFamily: "'Segoe UI',sans-serif", background: "#f0f2f5", minHeight: "100vh" },
  nav:      { background: "#fff", padding: ".9rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
  navTitle: { fontSize: "1.1rem", color: "#1a1a2e", fontWeight: 600 },
  navLink:  { fontSize: ".85rem", color: "#5c6ef8", textDecoration: "none", marginLeft: "1rem" },
  container:{ maxWidth: 680, margin: "2rem auto", padding: "0 1rem" },
  card:     { background: "#fff", borderRadius: 12, padding: "1.6rem", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: "1.5rem" },
  h2:       { fontSize: "1.1rem", color: "#1a1a2e", marginBottom: "1rem" },
  label:    { fontSize: ".83rem", color: "#555", display: "block", marginBottom: 5 },
  input:    { width: "100%", padding: ".6rem .85rem", border: "1px solid #ddd", borderRadius: 7, fontSize: ".93rem", marginBottom: "1rem", boxSizing: "border-box", fontFamily: "inherit" },
  textarea: { width: "100%", padding: ".6rem .85rem", border: "1px solid #ddd", borderRadius: 7, fontSize: ".93rem", marginBottom: "1rem", height: 110, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
  btn:      { padding: ".65rem 1.4rem", background: "#5c6ef8", color: "#fff", border: "none", borderRadius: 7, fontSize: ".95rem", cursor: "pointer" },
  success:  { background: "#f0fff4", border: "1px solid #b7ebc9", color: "#276749", fontSize: ".83rem", padding: ".6rem .9rem", borderRadius: 6, marginBottom: "1rem" },
  hint:     { fontSize: ".78rem", color: "#aaa", marginTop: ".5rem" },
  fbItem:   { borderBottom: "1px solid #f0f0f0", padding: ".8rem 0" },
  fbName:   { fontSize: ".85rem", fontWeight: 600, color: "#1a1a2e" },
  fbMsg:    { fontSize: ".88rem", color: "#555", marginTop: ".3rem", lineHeight: 1.5 },
  fbTime:   { fontSize: ".75rem", color: "#bbb", marginTop: ".3rem" },
};
