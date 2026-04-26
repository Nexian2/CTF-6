import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [dbError, setDbError] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check auth
    fetch("/api/admin/logs").then(r => {
      if (r.status === 401) router.push("/admin");
      return r.json();
    }).then(d => {
      if (d?.rows) { setRows(d.rows); setQuery(d.query || ""); }
      if (d?.adminUser) setAdminUser(d.adminUser);
    });
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setDbError(""); setRows([]); setQuery("");
    const params = new URLSearchParams({ search, order });
    const res = await fetch(`/api/admin/logs?${params}`);
    const data = await res.json();
    setLoading(false);
    if (data.error) { setDbError(data.error); setQuery(data.query || ""); }
    else { setRows(data.rows); setQuery(data.query || ""); }
  }

  async function logout() {
    await fetch("/api/admin/logout");
    router.push("/admin");
  }

  return (
    <>
      <Head><title>Admin Dashboard — NoteKeeper</title></Head>
      <div style={styles.page}>
        <nav style={styles.nav}>
          <span style={styles.navTitle}>🔒 Admin Dashboard</span>
          <div>
            <span style={styles.navUser}>Logged in as: {adminUser}</span>
            <button onClick={logout} style={styles.navBtn}>Logout</button>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={styles.stats}>
            {[["2","Total Users"],["4","Total Notes"],["3","Log Entries"]].map(([n,l]) => (
              <div key={l} style={styles.statBox}>
                <div style={styles.statNum}>{n}</div>
                <div style={styles.statLabel}>{l}</div>
              </div>
            ))}
          </div>

          <div style={styles.panel}>
            <h2 style={styles.h2}>📋 Access Log Viewer</h2>
            <form onSubmit={handleSearch} style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Filter Username</label>
                <input style={styles.input} value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari username..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sort By</label>
                <input style={styles.input} value={order} onChange={e => setOrder(e.target.value)} placeholder="logged_at" />
              </div>
              <div style={{ ...styles.formGroup, justifyContent: "flex-end" }}>
                <label style={styles.label}>&nbsp;</label>
                <button style={styles.btn} type="submit" disabled={loading}>🔍 Filter</button>
              </div>
            </form>

            {query && (
              <div style={styles.queryBox}>Query: {query}</div>
            )}

            {dbError && (
              <div style={styles.errorBox}>⚠ DB Error: {dbError}</div>
            )}

            {rows.length > 0 && (
              <table style={styles.table}>
                <thead>
                  <tr>{["ID","IP","Username","Action","Time"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{r.id}</td>
                      <td style={styles.td}>{r.ip_address}</td>
                      <td style={styles.td}>{r.username}</td>
                      <td style={styles.td}>{r.action}</td>
                      <td style={styles.td}>{r.logged_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={styles.hintStrip}>
              🔐 Tersedia kolom: <code>id</code>, <code>ip_address</code>, <code>username</code>, <code>action</code>, <code>logged_at</code> — Gunakan sort parameter untuk mengurutkan hasil.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page:       { fontFamily: "'Segoe UI',sans-serif", background: "#0f0f1a", color: "#ccc", minHeight: "100vh" },
  nav:        { background: "#1a1a2e", padding: ".9rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a2a4a" },
  navTitle:   { fontSize: "1.1rem", color: "#e0e0ff", fontWeight: 600 },
  navUser:    { fontSize: ".82rem", color: "#555", marginRight: "1rem" },
  navBtn:     { fontSize: ".82rem", color: "#5c6ef8", background: "none", border: "none", cursor: "pointer" },
  container:  { maxWidth: 1000, margin: "2rem auto", padding: "0 1rem" },
  stats:      { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statBox:    { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 10, padding: "1rem" },
  statNum:    { fontSize: "1.6rem", color: "#e0e0ff", fontWeight: 600 },
  statLabel:  { fontSize: ".78rem", color: "#666", marginTop: 4 },
  panel:      { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 10, padding: "1.4rem", marginBottom: "1.5rem" },
  h2:         { fontSize: "1rem", color: "#e0e0ff", marginBottom: "1rem" },
  formRow:    { display: "flex", gap: ".8rem", flexWrap: "wrap" as const, alignItems: "flex-end" },
  formGroup:  { display: "flex", flexDirection: "column" as const, gap: 4 },
  label:      { fontSize: ".78rem", color: "#777" },
  input:      { padding: ".55rem .8rem", background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: 6, color: "#ccc", fontSize: ".88rem", fontFamily: "inherit" },
  btn:        { padding: ".57rem 1.2rem", background: "#5c6ef8", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: ".88rem" },
  queryBox:   { background: "#0a0a14", border: "1px solid #1e1e3a", borderRadius: 6, padding: ".7rem 1rem", fontFamily: "monospace", fontSize: ".8rem", color: "#7a9ef8", marginTop: ".8rem", wordBreak: "break-all" as const },
  errorBox:   { background: "#1a0505", border: "1px solid #5a1a1a", borderRadius: 6, padding: ".7rem 1rem", fontFamily: "monospace", fontSize: ".8rem", color: "#f87171", marginTop: ".8rem" },
  table:      { width: "100%", borderCollapse: "collapse" as const, fontSize: ".85rem", marginTop: ".8rem" },
  th:         { textAlign: "left" as const, padding: ".5rem .7rem", background: "#0f0f1a", color: "#888", fontWeight: 500, borderBottom: "1px solid #2a2a4a" },
  td:         { padding: ".5rem .7rem", borderBottom: "1px solid #1a1a2e", color: "#aaa" },
  hintStrip:  { background: "#1a1505", border: "1px solid #3a2a05", borderRadius: 6, padding: ".6rem 1rem", fontSize: ".78rem", color: "#888", marginTop: ".8rem" },
};
