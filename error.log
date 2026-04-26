import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("session_user");
  if (!user) redirect("/");
  const username = user.value;

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.brand}>CorpNet Portal</span>
        <div style={s.navRight}>
          <span style={s.navUser}>{username}</span>
          <a href="/api/logout" style={s.navLogout}>Sign out</a>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.pageHeader}>
          <h1 style={s.h1}>Dashboard</h1>
          <p style={s.pageDesc}>Employee System v2.4</p>
        </div>

        <div style={s.grid}>
          {[
            { title: "Tasks",    value: "0",  desc: "No active tasks." },
            { title: "Messages", value: "0",  desc: "Inbox is empty." },
            { title: "Reports",  value: "3",  desc: "Available in system logs." },
          ].map(c => (
            <div key={c.title} style={s.card}>
              <p style={s.cardLabel}>{c.title}</p>
              <p style={s.cardValue}>{c.value}</p>
              <p style={s.cardDesc}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={s.notice}>
          <p style={s.noticeTitle}>Maintenance Notice</p>
          <p style={s.noticeText}>
            Scheduled maintenance is in progress. The IT team is actively monitoring server logs.
            Contact your administrator if you experience any issues.
          </p>
          {/* dev note: log viewer moved to /logviewer, remove before go-live */}
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root:        { minHeight: "100vh", background: "#f5f5f5" },
  nav:         { background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  brand:       { fontSize: 15, fontWeight: 700, color: "#111" },
  navRight:    { display: "flex", alignItems: "center", gap: 16 },
  navUser:     { fontSize: 13, color: "#666" },
  navLogout:   { fontSize: 13, color: "#999", cursor: "pointer" },
  container:   { maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
  pageHeader:  { marginBottom: 32 },
  h1:          { fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 4 },
  pageDesc:    { fontSize: 13, color: "#999" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginBottom: 32 },
  card:        { background: "#fff", border: "1px solid #ebebeb", borderRadius: 10, padding: "20px 24px" },
  cardLabel:   { fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
  cardValue:   { fontSize: 36, fontWeight: 700, color: "#111", marginBottom: 4 },
  cardDesc:    { fontSize: 13, color: "#aaa" },
  notice:      { background: "#fff", border: "1px solid #ebebeb", borderLeft: "3px solid #f59e0b", borderRadius: 8, padding: "16px 20px" },
  noticeTitle: { fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 6 },
  noticeText:  { fontSize: 13, color: "#777", lineHeight: 1.7 },
};
