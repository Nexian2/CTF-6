import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("/api/notes").then(r => {
      if (r.status === 401) { router.push("/"); return null; }
      return r.json();
    }).then(d => {
      if (!d) return;
      setNotes(d.notes);
      setUsername(d.username);
      // Set the XSS key in a non-httpOnly cookie so JS can read it
      document.cookie = "admin_key=XSS_K3Y_8f3a9c; path=/";
    });
  }, []);

  async function logout() {
    await fetch("/api/logout");
    router.push("/");
  }

  return (
    <>
      <Head><title>NoteKeeper — Catatan Saya</title></Head>
      <div style={styles.page}>
        <nav style={styles.nav}>
          <span style={styles.navTitle}>📝 NoteKeeper</span>
          <div>
            <span style={styles.navUser}>Halo, {username}</span>
            <a href="/feedback" style={styles.navLink}>Feedback</a>
            <button onClick={logout} style={styles.navBtn}>Logout</button>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={styles.tip}>
            💡 Tips: Coba cek halaman <strong>feedback</strong> — kamu bisa kirim pesan ke admin!
          </div>
          {notes.length === 0
            ? <p style={styles.empty}>Kamu belum punya catatan.</p>
            : notes.map(n => (
              <div key={n.id} style={styles.note}>
                <h3 style={styles.noteTitle}>{n.title}</h3>
                <p style={styles.noteContent}>{n.content}</p>
                <div style={styles.noteMeta}>{n.created_at}</div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page:        { fontFamily: "'Segoe UI',sans-serif", background: "#f0f2f5", minHeight: "100vh" },
  nav:         { background: "#fff", padding: ".9rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
  navTitle:    { fontSize: "1.1rem", color: "#1a1a2e", fontWeight: 600 },
  navUser:     { fontSize: ".85rem", color: "#888", marginRight: "1rem" },
  navLink:     { fontSize: ".85rem", color: "#5c6ef8", textDecoration: "none", marginRight: "1rem" },
  navBtn:      { fontSize: ".85rem", color: "#5c6ef8", background: "none", border: "none", cursor: "pointer" },
  container:   { maxWidth: 760, margin: "2rem auto", padding: "0 1rem" },
  tip:         { background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, padding: ".8rem 1rem", fontSize: ".82rem", color: "#7a5700", marginBottom: "1.5rem" },
  empty:       { textAlign: "center", color: "#bbb", marginTop: "3rem" },
  note:        { background: "#fff", borderRadius: 10, padding: "1.2rem 1.4rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  noteTitle:   { fontSize: "1rem", color: "#1a1a2e", marginBottom: ".4rem" },
  noteContent: { fontSize: ".88rem", color: "#666", lineHeight: 1.6 },
  noteMeta:    { fontSize: ".75rem", color: "#bbb", marginTop: ".6rem" },
};
