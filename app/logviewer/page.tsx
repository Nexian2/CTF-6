"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LogViewerInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [file, setFile]       = useState(searchParams.get("file") ?? "logs/access.log");
  const [input, setInput]     = useState(searchParams.get("file") ?? "logs/access.log");
  const [content, setContent] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function loadFile(f: string) {
    setLoading(true);
    setError("");
    setContent("");
    const res  = await fetch(`/api/readfile?file=${encodeURIComponent(f)}`);
    if (res.status === 401) { router.push("/"); return; }
    const data = await res.json();
    if (data.content !== undefined) {
      setContent(data.content);
    } else {
      setError(data.error ?? "File not found.");
    }
    setLoading(false);
  }

  useEffect(() => { loadFile(file); }, [file]); // eslint-disable-line

  function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    setFile(input);
  }

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.brand}>CorpNet Portal</span>
        <div style={s.navRight}>
          <a href="/dashboard" style={s.navLink}>Dashboard</a>
          <a href="/api/logout" style={s.navLogout}>Sign out</a>
        </div>
      </nav>

      <div style={s.container}>
        <div style={s.pageHeader}>
          <h1 style={s.h1}>Log Viewer</h1>
          <p style={s.pageDesc}>Internal monitoring tool</p>
        </div>

        <div style={s.toolbar}>
          <form onSubmit={handleLoad} style={s.toolbarForm}>
            <span style={s.pathLabel}>public/</span>
            <input
              style={s.pathInput}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="logs/access.log"
            />
            <button style={s.loadBtn} type="submit">Load</button>
          </form>
          <div style={s.presets}>
            {["logs/access.log", "logs/error.log"].map(f => (
              <button key={f} style={s.preset} onClick={() => { setInput(f); setFile(f); }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={s.output}>
          {loading && <p style={s.hint}>Loading...</p>}
          {error   && <p style={s.errMsg}>{error}</p>}
          {content && (
            <pre style={s.pre}>{content}</pre>
          )}
          {!loading && !error && !content && (
            <p style={s.hint}>No content.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LogViewerPage() {
  return (
    <Suspense>
      <LogViewerInner />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  root:        { minHeight: "100vh", background: "#f5f5f5" },
  nav:         { background: "#fff", borderBottom: "1px solid #ebebeb", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  brand:       { fontSize: 15, fontWeight: 700, color: "#111" },
  navRight:    { display: "flex", alignItems: "center", gap: 16 },
  navLink:     { fontSize: 13, color: "#666" },
  navLogout:   { fontSize: 13, color: "#999" },
  container:   { maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
  pageHeader:  { marginBottom: 28 },
  h1:          { fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 4 },
  pageDesc:    { fontSize: 13, color: "#999" },
  toolbar:     { background: "#fff", border: "1px solid #ebebeb", borderRadius: 10, padding: "16px 20px", marginBottom: 16 },
  toolbarForm: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  pathLabel:   { fontSize: 13, color: "#bbb", fontFamily: "monospace", whiteSpace: "nowrap" },
  pathInput:   { flex: 1, padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 13, fontFamily: "monospace", color: "#111", background: "#fafafa", outline: "none" },
  loadBtn:     { padding: "8px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  presets:     { display: "flex", gap: 8 },
  preset:      { padding: "5px 12px", background: "none", border: "1px solid #e0e0e0", borderRadius: 6, fontSize: 12, color: "#666", cursor: "pointer" },
  output:      { background: "#fff", border: "1px solid #ebebeb", borderRadius: 10, padding: "20px 24px", minHeight: 240 },
  pre:         { fontFamily: "'Courier New', monospace", fontSize: 13, color: "#333", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-all" },
  hint:        { fontSize: 13, color: "#bbb", fontFamily: "monospace" },
  errMsg:      { fontSize: 13, color: "#b91c1c", fontFamily: "monospace" },
};
