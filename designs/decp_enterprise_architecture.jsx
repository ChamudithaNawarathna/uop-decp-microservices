import { useState } from "react";

const C = {
  bg: "#0f1117",
  surface: "#1a1d2e",
  card: "#1e2235",
  border: "#2a2f4a",
  accent: "#4f8ef7",
  accent2: "#7c5cbf",
  accent3: "#2ec4b6",
  accent4: "#e87c3e",
  text: "#e8eaf6",
  muted: "#7b82a8",
};

const improvements = [
  { id: "mentorship",    icon: "🤝", label: "Mentorship Matching",    color: "#3ecf8e", inspired: "Gap in LinkedIn & Facebook" },
  { id: "graph",         icon: "🕸️", label: "Dept. Social Graph",     color: "#a855f7", inspired: "LinkedIn connection graph" },
  { id: "feed_ranking",  icon: "📊", label: "Smart Feed Ranking",     color: "#e87c3e", inspired: "Facebook EdgeRank" },
  { id: "notifications", icon: "🔔", label: "Notif. Batching",        color: "#f59e0b", inspired: "Facebook notification grouping" },
  { id: "graphql",       icon: "⚡", label: "GraphQL Gateway",        color: "#e84393", inspired: "Facebook GraphQL" },
  { id: "privacy",       icon: "🔒", label: "Post Privacy Controls",  color: "#60a5fa", inspired: "Facebook audience selector" },
  { id: "acl",           icon: "🛡️", label: "ACL Service Auth",       color: "#3ecf8e", inspired: "LinkedIn ACL system" },
  { id: "research",      icon: "🔬", label: "Research Hub Enhanced",  color: "#4f8ef7", inspired: "Missing from both platforms" },
];

const roles = [
  { id: "student",  label: "Student",        icon: "🎓", color: C.accent,  access: ["auth","user","post","job","event","research","mentorship","messaging","notification"] },
  { id: "alumni",   label: "Alumni",          icon: "👨‍💼", color: C.accent3, access: ["auth","user","post","job","event","research","mentorship","messaging","notification"] },
  { id: "admin",    label: "Admin / Faculty", icon: "🏫", color: C.accent4, access: ["auth","user","post","job","event","research","mentorship","messaging","notification","analytics"] },
];

const services = [
  { id: "auth",         icon: "🔐", name: "Auth Service",          color: "#e84393", layer: "core",     improvements: [] },
  { id: "user",         icon: "👤", name: "User Service",          color: "#4f8ef7", layer: "core",     improvements: ["graph"] },
  { id: "post",         icon: "📰", name: "Feed & Media",          color: "#a855f7", layer: "core",     improvements: ["feed_ranking","privacy"] },
  { id: "job",          icon: "💼", name: "Jobs & Internships",    color: "#2ec4b6", layer: "core",     improvements: [] },
  { id: "event",        icon: "📅", name: "Events",                color: "#e87c3e", layer: "core",     improvements: [] },
  { id: "research",     icon: "🔬", name: "Research",              color: "#3ecf8e", layer: "extended", improvements: ["research"] },
  { id: "mentorship",   icon: "🤝", name: "Mentorship",            color: "#3ecf8e", layer: "extended", improvements: ["mentorship"], isNew: true },
  { id: "messaging",    icon: "💬", name: "Messaging",             color: "#60a5fa", layer: "extended", improvements: [] },
  { id: "notification", icon: "🔔", name: "Notifications",         color: "#f59e0b", layer: "extended", improvements: ["notifications"] },
  { id: "analytics",    icon: "📊", name: "Analytics",             color: "#c084fc", layer: "extended", improvements: [] },
];

const clients = [
  { id: "web",    label: "Web Client",    icon: "🌐", tech: "React.js",      color: C.accent },
  { id: "mobile", label: "Mobile Client", icon: "📱", tech: "React Native",  color: C.accent3 },
];

export default function EnterpriseArchitecture() {
  const [selectedRole, setSelectedRole]           = useState(null);
  const [selectedService, setSelectedService]     = useState(null);
  const [activeLayer, setActiveLayer]             = useState("all");
  const [highlightImprovement, setHighlightImprovement] = useState(null);
  const [view, setView]                           = useState("architecture");

  const isAccessible = (serviceId) => !selectedRole || roles.find(r => r.id === selectedRole)?.access.includes(serviceId);

  const visibleServices = services.filter(s =>
    (activeLayer === "all" || s.layer === activeLayer) &&
    (!highlightImprovement || s.improvements.includes(highlightImprovement))
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, padding: "24px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ display: "inline-block", background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, borderRadius: "12px", padding: "4px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px", color: "#fff" }}>Enterprise Architecture — Updated</div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 6px", background: `linear-gradient(135deg, ${C.text}, ${C.muted})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Department Engagement & Career Platform</h1>
        <p style={{ color: C.muted, fontSize: "13px", margin: 0 }}>Includes all 8 proposed improvements from platform research</p>
      </div>

      {/* View Toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        {["architecture", "improvements", "workflow"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "7px 20px", borderRadius: "20px", border: `1px solid ${view === v ? C.accent : C.border}`, background: view === v ? `${C.accent}22` : "transparent", color: view === v ? C.accent : C.muted, cursor: "pointer", fontSize: "12px", fontWeight: 700, textTransform: "capitalize" }}>{v}</button>
        ))}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── ARCHITECTURE VIEW ─────────────────────────────── */}
        {view === "architecture" && (<>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px", flexWrap: "wrap" }}>
            {["all","core","extended"].map(l => (
              <button key={l} onClick={() => setActiveLayer(l)} style={{ padding: "5px 14px", borderRadius: "16px", border: `1px solid ${activeLayer === l ? C.accent : C.border}`, background: activeLayer === l ? `${C.accent}22` : "transparent", color: activeLayer === l ? C.accent : C.muted, cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                {l === "all" ? "All Services" : l === "core" ? "Core" : "Extended"}
              </button>
            ))}
            <span style={{ color: C.muted, fontSize: "12px", alignSelf: "center" }}>|</span>
            {roles.map(r => (
              <button key={r.id} onClick={() => setSelectedRole(selectedRole === r.id ? null : r.id)} style={{ padding: "5px 14px", borderRadius: "16px", border: `1px solid ${selectedRole === r.id ? r.color : C.border}`, background: selectedRole === r.id ? `${r.color}33` : "transparent", color: selectedRole === r.id ? r.color : C.muted, cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          {/* Client Layer */}
          <SectionLabel label="Client Layer" color={C.accent} />
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "8px" }}>
            {clients.map(c => (
              <div key={c.id} style={{ background: C.card, border: `1px solid ${c.color}55`, borderRadius: "12px", padding: "14px 28px", display: "flex", alignItems: "center", gap: "12px", flex: 1, maxWidth: "280px" }}>
                <span style={{ fontSize: "26px" }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.label}</div>
                  <div style={{ color: c.color, fontSize: "11px", fontWeight: 600 }}>{c.tech}</div>
                  <div style={{ color: C.muted, fontSize: "10px" }}>REST API + WebSocket</div>
                </div>
              </div>
            ))}
            {/* GraphQL improvement badge */}
            <div style={{ background: "#e8439322", border: "1px dashed #e8439366", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "8px", maxWidth: "200px" }}>
              <span style={{ fontSize: "20px" }}>⚡</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "12px", color: "#e84393" }}>GraphQL</div>
                <div style={{ color: C.muted, fontSize: "10px" }}>Mobile only (reduces over-fetching)</div>
                <div style={{ background: "#e8439322", color: "#e84393", fontSize: "9px", padding: "1px 6px", borderRadius: "4px", fontWeight: 800, display: "inline-block", marginTop: "2px" }}>IMPROVEMENT</div>
              </div>
            </div>
          </div>

          <FlowArrow />

          {/* API Gateway */}
          <SectionLabel label="API Gateway / Load Balancer" color={C.accent4} />
          <div style={{ background: `linear-gradient(135deg, ${C.accent4}22, ${C.accent4}11)`, border: `1px solid ${C.accent4}66`, borderRadius: "12px", padding: "12px 20px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>🔀 Spring Cloud Gateway — routes, rate limiting, CORS, JWT passthrough</div>
              <div style={{ display: "flex", gap: "6px" }}>
                <ImproveBadge label="⚡ GraphQL endpoint" color="#e84393" />
                <ImproveBadge label="🛡️ ACL enforcement" color="#3ecf8e" />
              </div>
            </div>
          </div>

          <FlowArrow />

          {/* Services */}
          <SectionLabel label="Service Layer (SOA — 10 Spring Boot Microservices)" color={C.accent2} />

          {/* Improvement highlight filter */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            <span style={{ color: C.muted, fontSize: "11px", alignSelf: "center" }}>Highlight improvement:</span>
            <button onClick={() => setHighlightImprovement(null)} style={{ padding: "3px 10px", borderRadius: "10px", border: `1px solid ${!highlightImprovement ? "#ffffff44" : C.border}`, background: !highlightImprovement ? "#ffffff11" : "transparent", color: !highlightImprovement ? C.text : C.muted, cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>All</button>
            {improvements.map(imp => (
              <button key={imp.id} onClick={() => setHighlightImprovement(highlightImprovement === imp.id ? null : imp.id)} style={{ padding: "3px 10px", borderRadius: "10px", border: `1px solid ${highlightImprovement === imp.id ? imp.color : C.border}`, background: highlightImprovement === imp.id ? `${imp.color}22` : "transparent", color: highlightImprovement === imp.id ? imp.color : C.muted, cursor: "pointer", fontSize: "10px", fontWeight: 600 }}>{imp.icon} {imp.label}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px", marginBottom: "8px" }}>
            {visibleServices.map(s => {
              const accessible = isAccessible(s.id);
              const selected = selectedService === s.id;
              return (
                <div key={s.id} onClick={() => setSelectedService(selected ? null : s.id)} style={{ background: selected ? `${s.color}22` : C.card, border: `1px solid ${accessible ? s.color + "88" : C.border}`, borderRadius: "12px", padding: "12px", cursor: "pointer", opacity: accessible ? 1 : 0.3, transition: "all 0.2s", borderStyle: s.isNew ? "dashed" : "solid" }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "12px", color: s.color }}>{s.name}</div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
                    <span style={{ background: `${s.color}22`, color: s.color, fontSize: "9px", padding: "1px 6px", borderRadius: "6px", fontWeight: 700 }}>{s.layer}</span>
                    {s.isNew && <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "9px", padding: "1px 6px", borderRadius: "6px", fontWeight: 700 }}>NEW</span>}
                    {s.improvements.length > 0 && <span style={{ background: "#ffffff11", color: C.muted, fontSize: "9px", padding: "1px 6px", borderRadius: "6px", fontWeight: 700 }}>✨{s.improvements.length}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <FlowArrow />

          {/* Message Broker */}
          <SectionLabel label="Async Communication" color={C.accent3} />
          <div style={{ background: `${C.accent3}11`, border: `1px solid ${C.accent3}44`, borderRadius: "12px", padding: "12px 20px", marginBottom: "8px", textAlign: "center", color: C.accent3, fontWeight: 600, fontSize: "13px" }}>
            📨 RabbitMQ (local) / AWS SQS (production) — event-driven async between services
          </div>

          <FlowArrow />

          {/* Data Layer */}
          <SectionLabel label="Data Layer" color="#3ecf8e" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "8px" }}>
            {[
              { icon: "🐘", name: "PostgreSQL",      usage: "Users, Jobs, Events, Auth, Mentorship", color: "#4169e1" },
              { icon: "🍃", name: "MongoDB",          usage: "Posts, Messages, Research docs",        color: "#3ecf8e" },
              { icon: "⚡", name: "Redis",             usage: "Sessions, Cache, Notif. batching",      color: "#e84393" },
              { icon: "🗂️", name: "S3 Storage",       usage: "Images, Videos, Documents",             color: "#e87c3e" },
            ].map(db => (
              <div key={db.name} style={{ background: C.card, border: `1px solid ${db.color}55`, borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>{db.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "12px", color: db.color }}>{db.name}</div>
                <div style={{ color: C.muted, fontSize: "10px", marginTop: "2px" }}>{db.usage}</div>
              </div>
            ))}
          </div>

          <FlowArrow />

          {/* Cloud */}
          <SectionLabel label="Cloud Infrastructure (AWS)" color={C.accent4} />
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "☁️", name: "ECS Fargate",    desc: "Service hosting" },
              { icon: "🌍", name: "CloudFront",      desc: "CDN / Static" },
              { icon: "🔒", name: "IAM + VPC",       desc: "Security" },
              { icon: "📊", name: "CloudWatch",      desc: "Logs & metrics" },
              { icon: "🔔", name: "SNS / FCM",       desc: "Push notifications" },
              { icon: "📨", name: "SQS",             desc: "Prod broker" },
            ].map(item => (
              <div key={item.name} style={{ background: `${C.accent4}11`, border: `1px solid ${C.accent4}33`, borderRadius: "10px", padding: "8px 14px", textAlign: "center", minWidth: "90px" }}>
                <div style={{ fontSize: "18px" }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "11px", color: C.accent4 }}>{item.name}</div>
                <div style={{ color: C.muted, fontSize: "10px" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── IMPROVEMENTS VIEW ─────────────────────────────── */}
        {view === "improvements" && (
          <div>
            <div style={{ background: "#3ecf8e10", border: "1px solid #3ecf8e33", borderRadius: "12px", padding: "12px 18px", marginBottom: "20px", fontSize: "12px", color: "#3ecf8e", textAlign: "center", fontWeight: 600 }}>
              8 improvements proposed from LinkedIn & Facebook research — each shown below with the diagram layer it affects
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {improvements.map(imp => (
                <div key={imp.id} style={{ background: C.card, border: `1px solid ${imp.color}44`, borderRadius: "14px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "22px" }}>{imp.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: imp.color }}>{imp.label}</div>
                      <div style={{ fontSize: "10px", color: C.muted }}>Inspired by: {imp.inspired}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {getAffectedDiagrams(imp.id).map(d => (
                      <span key={d} style={{ background: "#ffffff11", color: C.muted, fontSize: "10px", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>📐 {d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WORKFLOW VIEW ─────────────────────────────── */}
        {view === "workflow" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ color: C.muted, fontSize: "12px", textAlign: "center", marginBottom: "8px" }}>Key departmental workflows end-to-end across the architecture</div>
            {[
              { title: "Student applies for a job", color: "#2ec4b6", steps: ["Student opens Jobs page (React web/mobile)", "GET /api/jobs — Job Service returns listings", "POST /api/jobs/:id/apply — Job Service saves application", "job.applied → RabbitMQ → Notification Service", "Notification batched + pushed to alumni job poster (FCM)","Analytics Service logs application event"] },
              { title: "Alumni mentors a student (NEW)", color: "#3ecf8e", steps: ["Alumni registers as mentor — POST /api/mentorship/register", "Student requests match — GET /api/mentorship/matches/:userId", "Compatibility score calculated (skills + goals overlap)", "mentorship.matched → RabbitMQ → Notification Service", "Both parties notified via push notification", "Session logged in Mentorship Service (PostgreSQL)"] },
              { title: "Feed loads with ranking (IMPROVED)", color: "#e87c3e", steps: ["User opens feed — GET /api/posts/feed?ranked=true", "FeedRankingEngine scores each post", "Score = recency + engagement + relationship strength + content type", "Privacy filter applied (visibility field check)", "Ranked, filtered feed returned to React client", "Analytics logs feed view event"] },
            ].map(wf => (
              <div key={wf.title} style={{ background: C.card, border: `1px solid ${wf.color}44`, borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontWeight: 800, fontSize: "13px", color: wf.color, marginBottom: "12px" }}>🔄 {wf.title}</div>
                <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
                  {wf.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                      <div style={{ background: `${wf.color}22`, border: `1px solid ${wf.color}44`, borderRadius: "6px", padding: "4px 10px", fontSize: "11px", color: C.text }}>{i + 1}. {step}</div>
                      {i < wf.steps.length - 1 && <span style={{ color: C.muted, fontSize: "14px" }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer tip */}
        <div style={{ marginTop: "20px", padding: "12px 16px", background: C.surface, borderRadius: "10px", border: `1px solid ${C.border}`, fontSize: "11px", color: C.muted, textAlign: "center" }}>
          💡 Switch to <strong style={{ color: C.text }}>Improvements</strong> tab to see all 8 research improvements and which diagram layers they affect. Switch to <strong style={{ color: C.text }}>Workflow</strong> tab to see end-to-end departmental flows.
        </div>
      </div>
    </div>
  );
}

function getAffectedDiagrams(id) {
  const map = {
    mentorship:    ["SOA (new service)", "Enterprise", "Product Modularity"],
    graph:         ["SOA (new endpoints)", "Enterprise", "Product Modularity"],
    feed_ranking:  ["SOA (new endpoint)", "Product Modularity"],
    notifications: ["SOA (batching)", "Product Modularity"],
    graphql:       ["SOA (gateway)", "Enterprise (client layer)", "Deployment"],
    privacy:       ["SOA (new endpoint + field)", "Product Modularity"],
    acl:           ["SOA (gateway)", "Enterprise (gateway)", "Deployment"],
    research:      ["SOA (new endpoints)", "Product Modularity"],
  };
  return map[id] || [];
}

function SectionLabel({ label, color = "#7b82a8" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <div style={{ width: "3px", height: "16px", background: color, borderRadius: "2px" }} />
      <span style={{ fontSize: "11px", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: `${color}22` }} />
    </div>
  );
}

function ImproveBadge({ label, color }) {
  return <span style={{ background: `${color}22`, color, fontSize: "10px", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>{label}</span>;
}

function FlowArrow() {
  return <div style={{ textAlign: "center", margin: "6px 0", color: "#2a2f4a", fontSize: "18px" }}>↕</div>;
}
