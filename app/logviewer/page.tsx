"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function LogViewerInner() {
  const router      = useRouter();
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
      setError(data.error ?? "Unknown error");
    }
    setLoading(false);
  }

  useEffect(() => { loadFile(file); }, [file]); // eslint-disable-line

  function handleLoad(e: React.FormEvent) {
    e.preventDefault();
    setFile(input);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#e2e8f0" }}>
      <nav style={nav}>
        <span style={brand}>🏢 CorpNet Portal</span>
        <div style={navRight}>
          <a href="/dashboard" style={{ color: "#818cf8", fontSize: 13 }}>← Dashboard</a>
          &nbsp;|&nbsp;
          <a href="/api/logout" style={{ color: "#ef4444", fontSize: 13 }}>Logout</a>
        </div>
      </nav>

      <div style={container}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>🗂 Log Viewer</h2>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 28 }}>
          Internal log monitoring tool — IT Admin use only
        </p>

        <form onSubmit={handleLoad} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>File path:</label>
          <input
            style={inputStyle}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. logs/access.log"
          />
          <button style={btn} type="submit">Load</button>
        </form>

        <div style={{ marginBottom: 16, fontSize: 12, color: "#6b7280" }}>
          Quick load:{" "}
          {["logs/access.log", "logs/error.log"].map(f => (
            <a key={f} onClick={() => { setInput(f); setFile(f); }}
               style={{ color: "#818cf8", cursor: "pointer", marginRight: 12 }}>{f}</a>
          ))}
        </div>

        <div style={output}>
          <div style={{ fontSize: 12, color: "#374151", fontFamily: "monospace", marginBottom: 10 }}>
            Reading: public/{file}
          </div>
          {loading && <p style={{ color: "#6b7280", fontFamily: "monospace", fontSize: 13 }}>Loading...</p>}
          {error   && <p style={{ color: "#f87171", fontFamily: "monospace", fontSize: 13 }}>{error}</p>}
          {content && (
            <pre style={{ fontFamily: "Courier New, monospace", fontSize: 13, color: "#a3e635", whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.7 }}>
              {content}
            </pre>
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

const nav: React.CSSProperties        = { background:"#1a1d27", borderBottom:"1px solid #2d3148", padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" };
const brand: React.CSSProperties      = { fontSize:18, fontWeight:700, color:"#818cf8" };
const navRight: React.CSSProperties   = { display:"flex", alignItems:"center", fontSize:14, color:"#6b7280" };
const container: React.CSSProperties  = { maxWidth:960, margin:"0 auto", padding:"40px 24px" };
const inputStyle: React.CSSProperties = { flex:1, padding:"9px 13px", background:"#1a1d27", border:"1px solid #2d3148", borderRadius:8, color:"#e2e8f0", fontSize:13, fontFamily:"Courier New,monospace", outline:"none" };
const btn: React.CSSProperties        = { padding:"9px 18px", background:"#6366f1", border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" };
const output: React.CSSProperties     = { background:"#0a0c12", border:"1px solid #2d3148", borderRadius:10, padding:20, minHeight:200 };
