import { useState } from "react";

const C = {
  bg: "#080b14",
  surface: "#0f1420",
  card: "#131929",
  border: "#1e2640",
  text: "#e8eaf6",
  muted: "#5a6490",
};

// ─── IMPROVEMENTS from research ───────────────────────────────────────────────
const IMPROVEMENTS = {
  mentorship:     { label: "🤝 Mentorship Matching",       color: "#3ecf8e", id: "mentorship" },
  graph:          { label: "🕸️ Dept. Social Graph",        color: "#a855f7", id: "graph" },
  feed_ranking:   { label: "📊 Smart Feed Ranking",        color: "#e87c3e", id: "feed_ranking" },
  notifications:  { label: "🔔 Notif. Batching",           color: "#f59e0b", id: "notifications" },
  graphql:        { label: "⚡ GraphQL Gateway",           color: "#e84393", id: "graphql" },
  privacy:        { label: "🔒 Privacy Controls",          color: "#60a5fa", id: "privacy" },
  acl:            { label: "🛡️ ACL Service Auth",          color: "#3ecf8e", id: "acl" },
  research:       { label: "🔬 Research Hub",              color: "#4f8ef7", id: "research" },
};

const services = [
  {
    id: "gateway",
    name: "API Gateway",
    tech: "Spring Cloud Gateway",
    color: "#f0c040",
    icon: "🔀",
    port: "8080",
    type: "gateway",
    endpoints: [
      "ALL /api/** → routes to services",
      "ALL /graphql → GraphQL gateway (mobile)",
      "Rate limiting, CORS, JWT passthrough",
      "ACL enforcement per service route",
    ],
    publishes: [],
    subscribes: [],
    calls: ["auth", "user", "post", "job", "event", "research", "mentorship", "messaging", "notification", "analytics"],
    db: null,
    improvements: ["graphql", "acl"],
    improvementNotes: {
      graphql: "GraphQL endpoint added at /graphql for mobile client — reduces over-fetching on mobile networks",
      acl: "ACL matrix enforced here: defines which services can READ/WRITE to which. Inspired by LinkedIn's ACL system",
    },
  },
  {
    id: "auth",
    name: "Auth Service",
    tech: "Spring Boot",
    color: "#e84393",
    icon: "🔐",
    port: "8081",
    type: "spring",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/refresh",
      "POST /api/auth/logout",
      "GET  /api/auth/validate",
    ],
    publishes: ["user.registered", "user.loggedin"],
    subscribes: [],
    calls: ["user"],
    db: "PostgreSQL",
    improvements: [],
    improvementNotes: {},
  },
  {
    id: "user",
    name: "User Service",
    tech: "Spring Boot",
    color: "#4f8ef7",
    icon: "👤",
    port: "8082",
    type: "spring",
    endpoints: [
      "GET  /api/users/:id",
      "PUT  /api/users/:id",
      "GET  /api/users/search",
      "POST /api/users/:id/follow",
      "GET  /api/users/alumni",
      "GET  /api/users/:id/graph",
      "GET  /api/users/:id/connections",
    ],
    publishes: ["user.updated", "user.followed"],
    subscribes: ["user.registered"],
    calls: [],
    db: "PostgreSQL",
    improvements: ["graph"],
    improvementNotes: {
      graph: "/graph and /connections endpoints added — implements department social graph inspired by LinkedIn's connection model. Shows 1st/2nd degree connections via shared events, projects, follows.",
    },
  },
  {
    id: "post",
    name: "Feed & Media Service",
    tech: "Spring Boot",
    color: "#a855f7",
    icon: "📰",
    port: "8083",
    type: "spring",
    endpoints: [
      "GET  /api/posts/feed",
      "GET  /api/posts/feed?ranked=true",
      "POST /api/posts",
      "PUT  /api/posts/:id",
      "POST /api/posts/:id/like",
      "POST /api/posts/:id/comment",
      "DELETE /api/posts/:id",
      "PUT  /api/posts/:id/visibility",
    ],
    publishes: ["post.created", "post.liked", "post.commented"],
    subscribes: ["user.followed"],
    calls: ["user"],
    db: "MongoDB",
    improvements: ["feed_ranking", "privacy"],
    improvementNotes: {
      feed_ranking: "feed?ranked=true activates FeedRankingEngine — scores posts by recency, engagement, relationship strength, content type. Rule-based, not ML (appropriate for DECP scale). Inspired by Facebook EdgeRank.",
      privacy: "/visibility endpoint + visibility field on Post entity: PUBLIC | STUDENTS_ONLY | ALUMNI_ONLY | CONNECTIONS_ONLY | PRIVATE. Feed filters based on requesting user's role. Inspired by Facebook audience selector.",
    },
  },
  {
    id: "job",
    name: "Jobs & Internships Service",
    tech: "Spring Boot",
    color: "#2ec4b6",
    icon: "💼",
    port: "8084",
    type: "spring",
    endpoints: [
      "GET  /api/jobs",
      "POST /api/jobs",
      "GET  /api/jobs/:id",
      "POST /api/jobs/:id/apply",
      "GET  /api/jobs/:id/applicants",
      "PUT  /api/jobs/:id/status",
    ],
    publishes: ["job.posted", "job.applied"],
    subscribes: [],
    calls: ["user"],
    db: "PostgreSQL",
    improvements: [],
    improvementNotes: {},
  },
  {
    id: "event",
    name: "Events Service",
    tech: "Spring Boot",
    color: "#e87c3e",
    icon: "📅",
    port: "8085",
    type: "spring",
    endpoints: [
      "GET  /api/events",
      "POST /api/events",
      "GET  /api/events/:id",
      "POST /api/events/:id/rsvp",
      "DELETE /api/events/:id/rsvp",
      "GET  /api/events/upcoming",
    ],
    publishes: ["event.created", "event.rsvp"],
    subscribes: [],
    calls: ["user"],
    db: "PostgreSQL",
    improvements: [],
    improvementNotes: {},
  },
  {
    id: "research",
    name: "Research Service",
    tech: "Spring Boot",
    color: "#3ecf8e",
    icon: "🔬",
    port: "8086",
    type: "spring",
    endpoints: [
      "GET  /api/research",
      "POST /api/research",
      "POST /api/research/:id/invite",
      "POST /api/research/:id/documents",
      "GET  /api/research/:id/members",
      "GET  /api/research/:id/versions",
      "POST /api/research/:id/doi-link",
    ],
    publishes: ["research.created", "research.invited"],
    subscribes: [],
    calls: ["user"],
    db: "MongoDB",
    improvements: ["research"],
    improvementNotes: {
      research: "/versions endpoint adds document versioning. /doi-link integrates with Google Scholar/DOI for paper linking. Co-author contribution timeline stored in MongoDB. Identified as missing from both LinkedIn and Facebook.",
    },
  },
  {
    id: "mentorship",
    name: "Mentorship Service",
    tech: "Spring Boot",
    color: "#3ecf8e",
    icon: "🤝",
    port: "8090",
    type: "spring",
    isNew: true,
    endpoints: [
      "POST /api/mentorship/register",
      "GET  /api/mentorship/matches/:userId",
      "POST /api/mentorship/request",
      "GET  /api/mentorship/sessions/:userId",
      "PUT  /api/mentorship/sessions/:id/complete",
      "GET  /api/mentorship/score/:studentId/:alumniId",
    ],
    publishes: ["mentorship.matched", "mentorship.requested"],
    subscribes: ["user.registered"],
    calls: ["user"],
    db: "PostgreSQL",
    improvements: ["mentorship"],
    improvementNotes: {
      mentorship: "NEW SERVICE — not in original design. Alumni mentorship matching inspired by the gap in both LinkedIn and Facebook. Compatibility score based on skills overlap + career goals. Students register as mentees, alumni as mentors.",
    },
  },
  {
    id: "messaging",
    name: "Messaging Service",
    tech: "Spring Boot + WebSocket",
    color: "#60a5fa",
    icon: "💬",
    port: "8087",
    type: "spring",
    endpoints: [
      "GET  /api/messages/conversations",
      "GET  /api/messages/:conversationId",
      "POST /api/messages",
      "WS   /ws (STOMP over WebSocket)",
      "POST /api/messages/group",
    ],
    publishes: ["message.sent"],
    subscribes: [],
    calls: ["user"],
    db: "MongoDB + Redis",
    improvements: [],
    improvementNotes: {},
  },
  {
    id: "notification",
    name: "Notification Service",
    tech: "Spring Boot + AMQP",
    color: "#f59e0b",
    icon: "🔔",
    port: "8088",
    type: "spring",
    endpoints: [
      "GET  /api/notifications",
      "PUT  /api/notifications/:id/read",
      "PUT  /api/notifications/read-all",
      "POST /api/notifications/push",
      "GET  /api/notifications/batched",
    ],
    publishes: [],
    subscribes: [
      "user.registered", "post.created", "post.liked",
      "job.posted", "event.created", "message.sent",
      "research.invited", "mentorship.matched", "mentorship.requested",
    ],
    calls: [],
    db: "Redis + PostgreSQL",
    improvements: ["notifications"],
    improvementNotes: {
      notifications: "/batched endpoint + batching scheduler: groups same-type events within 30-min window before pushing. Raw events stored in Redis, flushed on schedule. Prevents notification spam. Inspired by Facebook's notification grouping.",
    },
  },
  {
    id: "analytics",
    name: "Analytics Service",
    tech: "Spring Boot",
    color: "#c084fc",
    icon: "📊",
    port: "8089",
    type: "spring",
    endpoints: [
      "GET  /api/analytics/active-users",
      "GET  /api/analytics/popular-posts",
      "GET  /api/analytics/job-stats",
      "GET  /api/analytics/event-stats",
      "GET  /api/analytics/mentorship-stats",
      "GET  /api/analytics/overview",
    ],
    publishes: [],
    subscribes: [
      "user.loggedin", "post.created", "post.liked",
      "job.applied", "event.rsvp", "mentorship.matched",
    ],
    calls: [],
    db: "PostgreSQL",
    improvements: [],
    improvementNotes: {},
  },
];

const techBadge = (type, tech) => {
  if (type === "gateway") return { label: "Spring Cloud", bg: "#f0c04022", color: "#f0c040" };
  if (tech === "Spring Boot + WebSocket") return { label: "Spring WebSocket", bg: "#6db33f22", color: "#6db33f" };
  if (tech === "Spring Boot + AMQP") return { label: "Spring AMQP", bg: "#6db33f22", color: "#6db33f" };
  if (type === "spring") return { label: "Spring Boot", bg: "#6db33f22", color: "#6db33f" };
  return { label: type, bg: "#ffffff11", color: "#aaa" };
};

export default function SOADiagram() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("endpoints");
  const [filterImprovement, setFilterImprovement] = useState(null);

  const selectedService = services.find(s => s.id === selected);

  const visibleServices = filterImprovement
    ? services.filter(s => s.improvements.includes(filterImprovement))
    : services;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, padding: "24px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ display: "inline-block", background: "linear-gradient(135deg, #e84393, #a855f7)", borderRadius: "10px", padding: "3px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", color: "#fff" }}>SOA Diagram — Updated</div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px", background: "linear-gradient(135deg, #e8eaf6, #5a6490)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Service Interactions & API Endpoints</h1>
        <p style={{ color: C.muted, fontSize: "12px", margin: 0 }}>Includes 8 improvements from platform research. Click a service to inspect. Filter by improvement below.</p>
      </div>

      {/* Banners */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, background: "#1a1030", border: "1px solid #2a2050", borderRadius: "10px", padding: "8px 16px", textAlign: "center", fontSize: "12px", color: "#a78bfa", fontWeight: 600 }}>
          📨 RabbitMQ — Async event broker between services
        </div>
        <div style={{ flex: 1, background: "#6db33f10", border: "1px solid #6db33f33", borderRadius: "10px", padding: "8px 16px", textAlign: "center", fontSize: "12px", color: "#6db33f", fontWeight: 600 }}>
          ☕ All Spring Boot (Java) — uniform stack
        </div>
        <div style={{ flex: 1, background: "#3ecf8e10", border: "1px solid #3ecf8e33", borderRadius: "10px", padding: "8px 16px", textAlign: "center", fontSize: "12px", color: "#3ecf8e", fontWeight: 600 }}>
          ✨ 10 services — 1 new (Mentorship) from research
        </div>
      </div>

      {/* Improvement Filter */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Filter by improvement:</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button onClick={() => setFilterImprovement(null)} style={{ padding: "4px 12px", borderRadius: "10px", border: `1px solid ${!filterImprovement ? "#ffffff44" : C.border}`, background: !filterImprovement ? "#ffffff11" : "transparent", color: !filterImprovement ? C.text : C.muted, cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>All</button>
          {Object.values(IMPROVEMENTS).map(imp => (
            <button key={imp.id} onClick={() => setFilterImprovement(filterImprovement === imp.id ? null : imp.id)} style={{ padding: "4px 12px", borderRadius: "10px", border: `1px solid ${filterImprovement === imp.id ? imp.color : C.border}`, background: filterImprovement === imp.id ? `${imp.color}22` : "transparent", color: filterImprovement === imp.id ? imp.color : C.muted, cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>{imp.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", maxWidth: "1300px", margin: "0 auto" }}>

        {/* Service Grid */}
        <div style={{ flex: 1 }}>
          {/* Gateway */}
          <div style={{ marginBottom: "14px" }}>
            <LayerLabel label="Gateway Layer" />
            {services.filter(s => s.type === "gateway").map(s => (
              <ServiceCard key={s.id} s={s} selected={selected} onSelect={setSelected} dimmed={filterImprovement && !s.improvements.includes(filterImprovement)} />
            ))}
          </div>

          {/* All Spring Boot Services */}
          <div>
            <LayerLabel label="Spring Boot Services — All Java" color="#6db33f" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {services.filter(s => s.type === "spring").map(s => (
                <ServiceCard key={s.id} s={s} selected={selected} onSelect={setSelected} compact dimmed={filterImprovement && !s.improvements.includes(filterImprovement)} />
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ width: "360px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "20px", alignSelf: "flex-start", position: "sticky", top: "24px" }}>
          {!selectedService ? (
            <div style={{ textAlign: "center", color: C.muted, padding: "30px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>👆</div>
              <div style={{ fontSize: "12px" }}>Click any service to inspect endpoints, events, dependencies, and improvement details</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "26px" }}>{selectedService.icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: selectedService.color }}>{selectedService.name}</div>
                    {selectedService.isNew && <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", fontWeight: 800 }}>NEW</span>}
                  </div>
                  <div style={{ display: "flex", gap: "5px", marginTop: "3px", flexWrap: "wrap" }}>
                    <Badge {...techBadge(selectedService.type, selectedService.tech)} />
                    <Badge label={`:${selectedService.port}`} bg="#ffffff11" color={C.muted} />
                    {selectedService.db && <Badge label={selectedService.db} bg="#ffffff11" color={C.muted} />}
                  </div>
                </div>
              </div>

              {/* Improvement badges */}
              {selectedService.improvements.length > 0 && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {selectedService.improvements.map(impId => {
                    const imp = IMPROVEMENTS[impId];
                    return <span key={impId} style={{ background: `${imp.color}22`, color: imp.color, fontSize: "10px", padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>{imp.label}</span>;
                  })}
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: "flex", gap: "5px", marginBottom: "12px", flexWrap: "wrap" }}>
                {["endpoints", "events", "calls", "improvements"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "3px 10px", borderRadius: "7px", border: `1px solid ${tab === t ? selectedService.color : C.border}`, background: tab === t ? `${selectedService.color}22` : "transparent", color: tab === t ? selectedService.color : C.muted, fontSize: "10px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase" }}>{t}</button>
                ))}
              </div>

              {tab === "endpoints" && (
                <div>
                  <div style={{ color: C.muted, fontSize: "10px", marginBottom: "6px", fontWeight: 700 }}>REST ENDPOINTS</div>
                  {selectedService.endpoints.map((ep, i) => (
                    <div key={i} style={{ background: C.card, borderRadius: "6px", padding: "6px 10px", marginBottom: "4px", fontSize: "11px", fontFamily: "monospace", borderLeft: `3px solid ${selectedService.color}` }}>
                      <MethodColor ep={ep} />
                    </div>
                  ))}
                </div>
              )}

              {tab === "events" && (
                <div>
                  {selectedService.publishes.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ color: "#3ecf8e", fontSize: "10px", marginBottom: "6px", fontWeight: 700 }}>📤 PUBLISHES</div>
                      {selectedService.publishes.map((e, i) => <EventTag key={i} label={e} color="#3ecf8e" />)}
                    </div>
                  )}
                  {selectedService.subscribes.length > 0 && (
                    <div>
                      <div style={{ color: "#f59e0b", fontSize: "10px", marginBottom: "6px", fontWeight: 700 }}>📥 SUBSCRIBES</div>
                      {selectedService.subscribes.map((e, i) => <EventTag key={i} label={e} color="#f59e0b" />)}
                    </div>
                  )}
                  {selectedService.publishes.length === 0 && selectedService.subscribes.length === 0 && (
                    <div style={{ color: C.muted, fontSize: "12px", textAlign: "center", padding: "20px 0" }}>No broker events</div>
                  )}
                </div>
              )}

              {tab === "calls" && (
                <div>
                  <div style={{ color: C.muted, fontSize: "10px", marginBottom: "6px", fontWeight: 700 }}>DIRECT HTTP CALLS TO</div>
                  {selectedService.calls.length > 0 ? selectedService.calls.map(id => {
                    const s = services.find(x => x.id === id);
                    return s ? (
                      <div key={id} onClick={() => setSelected(id)} style={{ background: C.card, borderRadius: "8px", padding: "7px 10px", marginBottom: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${s.color}44` }}>
                        <span>{s.icon}</span>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: s.color }}>{s.name}</div>
                          <div style={{ fontSize: "10px", color: C.muted }}>:{s.port}</div>
                        </div>
                      </div>
                    ) : null;
                  }) : <div style={{ color: C.muted, fontSize: "12px", textAlign: "center", padding: "20px 0" }}>No direct HTTP calls</div>}
                </div>
              )}

              {tab === "improvements" && (
                <div>
                  {selectedService.improvements.length === 0 ? (
                    <div style={{ color: C.muted, fontSize: "12px", textAlign: "center", padding: "20px 0" }}>No research improvements for this service</div>
                  ) : selectedService.improvements.map(impId => {
                    const imp = IMPROVEMENTS[impId];
                    return (
                      <div key={impId} style={{ background: `${imp.color}10`, border: `1px solid ${imp.color}33`, borderRadius: "10px", padding: "10px 12px", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 800, fontSize: "12px", color: imp.color, marginBottom: "6px" }}>{imp.label}</div>
                        <div style={{ fontSize: "11px", color: C.muted, lineHeight: 1.6 }}>{selectedService.improvementNotes[impId]}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ maxWidth: "1300px", margin: "16px auto 0", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", padding: "12px 16px", background: C.surface, borderRadius: "10px", border: `1px solid ${C.border}` }}>
        {[
          { color: "#6db33f", label: "Spring Boot service" },
          { color: "#f0c040", label: "Spring Cloud Gateway" },
          { color: "#3ecf8e", label: "Publishes to RabbitMQ" },
          { color: "#f59e0b", label: "Subscribes from RabbitMQ" },
          { color: "#a855f7", label: "WebSocket (STOMP)" },
          { color: "#3ecf8e", label: "✨ = improvement added" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: C.muted }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ s, selected, onSelect, compact, dimmed }) {
  const isSelected = selected === s.id;
  const tb = techBadge(s.type, s.tech);
  return (
    <div onClick={() => onSelect(isSelected ? null : s.id)} style={{ background: isSelected ? `${s.color}18` : C.card, border: `1px solid ${isSelected ? s.color : s.isNew ? `${s.color}88` : "#1e2640"}`, borderRadius: "12px", padding: compact ? "10px" : "14px", cursor: "pointer", transition: "all 0.18s", marginBottom: compact ? 0 : "10px", opacity: dimmed ? 0.25 : 1, borderStyle: s.isNew ? "dashed" : "solid" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: compact ? "18px" : "22px" }}>{s.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ fontWeight: 700, fontSize: compact ? "11px" : "13px", color: s.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
            {s.isNew && <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "8px", padding: "1px 4px", borderRadius: "3px", fontWeight: 800, flexShrink: 0 }}>NEW</span>}
          </div>
          <div style={{ display: "flex", gap: "4px", marginTop: "2px", flexWrap: "wrap" }}>
            <Badge {...tb} />
            {s.improvements.length > 0 && <Badge label={`✨ ${s.improvements.length}`} bg="#ffffff11" color="#aaaaaa" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, bg, color }) {
  return <span style={{ background: bg, color, fontSize: "9px", padding: "1px 6px", borderRadius: "5px", fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>;
}

function EventTag({ label, color }) {
  return <div style={{ background: `${color}15`, border: `1px solid ${color}44`, borderRadius: "6px", padding: "4px 8px", marginBottom: "4px", fontSize: "10px", fontFamily: "monospace", color }}>{label}</div>;
}

function LayerLabel({ label, color = "#5a6490" }) {
  return (
    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
      <div style={{ width: "3px", height: "12px", background: color, borderRadius: "2px" }} />
      {label}
    </div>
  );
}

function MethodColor({ ep }) {
  const methods = { GET: "#3ecf8e", POST: "#4f8ef7", PUT: "#f59e0b", DELETE: "#e84393", WS: "#a855f7", ALL: "#f0c040" };
  const method = ep.split(" ")[0];
  const rest = ep.slice(method.length);
  return <span><span style={{ color: methods[method] || "#aaa", fontWeight: 800 }}>{method}</span><span style={{ color: "#6a7499" }}>{rest}</span></span>;
}
