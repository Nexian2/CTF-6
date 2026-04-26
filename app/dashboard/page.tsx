import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("session_user");
  if (!user) redirect("/");

  const username = user.value;

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#e2e8f0" }}>
      {/* Navbar */}
      <nav style={nav}>
        <span style={brand}>🏢 CorpNet Portal</span>
        <div style={navRight}>
          Logged in as <strong style={{ color: "#e2e8f0", margin: "0 4px" }}>{username}</strong>
          <a href="/api/logout" style={{ color: "#ef4444", fontSize: 13, marginLeft: 8 }}>Logout</a>
        </div>
      </nav>

      <div style={container}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          Selamat datang, {username}!
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
          Employee Dashboard — Internal Employee System v2.4
        </p>

        {/* Stats grid */}
        <div style={grid}>
          {[
            { icon: "📋", title: "My Tasks",  value: "0", desc: "Tidak ada tugas aktif saat ini." },
            { icon: "📨", title: "Messages",  value: "0", desc: "Inbox kosong." },
            { icon: "📊", title: "Reports",   value: "3", desc: "Laporan tersedia di sistem log." },
          ].map(c => (
            <div key={c.title} style={card}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{c.title}</h3>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#818cf8", margin: "12px 0 4px" }}>{c.value}</div>
              <p style={{ fontSize: 13, color: "#6b7280" }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Notice — contains hidden comment */}
        <div style={notice}>
          <strong style={{ color: "#fbbf24" }}>⚠ Maintenance Notice</strong><br/>
          <span style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.7 }}>
            Sistem sedang dalam pemeliharaan terjadwal. Beberapa fitur mungkin tidak tersedia.
            Tim IT sedang memantau <em>server log</em> secara aktif.
            Hubungi administrator jika mengalami kendala.
          </span>
          {/* dev note: log viewer dipindah ke /logviewer, hapus sebelum go-live */}
        </div>
      </div>
    </div>
  );
}

const nav: React.CSSProperties = {
  background: "#1a1d27",
  borderBottom: "1px solid #2d3148",
  padding: "0 32px",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const brand: React.CSSProperties     = { fontSize: 18, fontWeight: 700, color: "#818cf8" };
const navRight: React.CSSProperties  = { display: "flex", alignItems: "center", fontSize: 14, color: "#6b7280" };
const container: React.CSSProperties = { maxWidth: 960, margin: "0 auto", padding: "40px 24px" };
const grid: React.CSSProperties      = { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20, marginBottom: 40 };
const card: React.CSSProperties      = { background: "#1a1d27", border: "1px solid #2d3148", borderRadius: 12, padding: 24 };
const notice: React.CSSProperties    = {
  background: "#1a1d27",
  border: "1px solid #2d3148",
  borderLeft: "3px solid #f59e0b",
  borderRadius: 8,
  padding: "16px 20px",
};
