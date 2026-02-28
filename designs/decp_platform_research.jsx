import { useState } from "react";

const C = {
  bg: "#070a0f",
  surface: "#0c0f1a",
  card: "#10141f",
  border: "#181e30",
  text: "#dde4f5",
  muted: "#445070",
};

const platforms = {
  linkedin: {
    name: "LinkedIn",
    icon: "💼",
    color: "#0077b5",
    founded: "2003",
    users: "1B+ members",
    stack: [
      { area: "API Layer", tech: "Rest.li (custom REST framework)", detail: "LinkedIn built its own REST framework for type-safe, scalable inter-service communication" },
      { area: "Message Broker", tech: "Apache Kafka", detail: "Kafka was actually invented at LinkedIn. Handles trillions of messages/day for feeds, analytics, notifications" },
      { area: "Primary Database", tech: "Espresso (custom NoSQL)", detail: "LinkedIn's own distributed document store — powers profiles, InMail, feed. Built on MySQL + Kafka internally" },
      { area: "Search", tech: "Galene (custom Lucene)", detail: "Custom search engine built on Apache Lucene for member and job search" },
      { area: "Graph", tech: "LIquid (social graph)", detail: "Manages member connections and 2nd/3rd degree network — core feature of the platform" },
      { area: "Caching", tech: "Couchbase + Memcached", detail: "Multi-tier caching for profile data and feed results. Cache invalidated via Brooklin CDC" },
      { area: "Stream Processing", tech: "Apache Samza", detail: "Another LinkedIn open-source project. Real-time stream processing on top of Kafka" },
      { area: "Analytics", tech: "Apache Pinot", detail: "Low-latency OLAP for real-time analytics like 'Who viewed your profile'" },
      { area: "Mobile/Web", tech: "React + React Native + Ember", detail: "Web uses both React (new pages) and Ember.js (legacy). Mobile uses native Swift/Kotlin + React Native" },
      { area: "Service Architecture", tech: "700+ microservices", detail: "Evolved from monolith 'Leo' to 700+ independent microservices. Each service owns its data" },
    ],
    features: [
      "Professional profile with skills endorsements",
      "1st/2nd/3rd degree connection graph",
      "Job recommendations based on skills + activity",
      "InMail (paid messaging to strangers)",
      "LinkedIn Learning (courses)",
      "Company pages and follower system",
      "Premium subscription tiers",
      "Who viewed your profile analytics",
      "Content creator mode + newsletters",
      "Real-time feed ranking algorithm",
    ],
    missing: [
      "No department/cohort-based grouping",
      "No academic project collaboration workspace",
      "No university-specific RSVP event system",
      "No alumni mentorship matching",
      "No GPA or academic achievement filtering for jobs",
      "No research paper co-authoring tools",
    ],
  },
  facebook: {
    name: "Facebook / Meta",
    icon: "👥",
    color: "#1877f2",
    founded: "2004",
    users: "3B+ DAU",
    stack: [
      { area: "Social Graph", tech: "TAO (The Associations & Objects)", detail: "Custom distributed graph database. Models everything as nodes (objects) and edges (associations). Handles 1B+ reads/sec" },
      { area: "API Layer", tech: "GraphQL", detail: "Facebook invented GraphQL in 2012 and open-sourced it. Lets clients fetch exactly the data they need — no over/under-fetching" },
      { area: "Mobile", tech: "React Native", detail: "Facebook invented React Native. Used for Facebook, Instagram, and Messenger across iOS + Android" },
      { area: "Web", tech: "React + Relay", detail: "Facebook invented React. Relay is their GraphQL client that co-locates data requirements with UI components" },
      { area: "Caching", tech: "Memcache (distributed)", detail: "Massive Memcache deployment. TAO acts as a write-through cache on top of MySQL databases" },
      { area: "Database", tech: "MySQL + RocksDB", detail: "MySQL for persistent storage, sharded across thousands of servers. RocksDB (also Facebook-built) for storage engine" },
      { area: "Media", tech: "Haystack + f4 (BLOB storage)", detail: "Custom object stores for photos/videos. Haystack for hot data, f4 for warm/cold data — stores exabytes" },
      { area: "Real-time", tech: "MQTT + WebSocket", detail: "MQTT protocol for mobile push (battery efficient). WebSocket for real-time chat and notifications" },
      { area: "Feed Ranking", tech: "ML-based ranking (EdgeRank evolved)", detail: "Machine learning models that rank feed items based on engagement, relationships, content type, and recency" },
      { area: "Infrastructure", tech: "Own data centers + private cloud", detail: "Meta operates its own global data centers, not AWS/GCP. Open Compute Project hardware designs" },
    ],
    features: [
      "News feed with ML-powered ranking",
      "Groups (public, private, secret)",
      "Marketplace (buy/sell items)",
      "Events with map integration",
      "Stories (24-hour content)",
      "Reels (short video content)",
      "Facebook Live (live streaming)",
      "Messenger (separate app)",
      "Facebook Watch (video platform)",
      "Privacy controls (post audience selection)",
    ],
    missing: [
      "No professional job application workflow",
      "No academic research collaboration",
      "No skill-based professional networking",
      "No department-specific community structure",
      "No formal mentorship system",
      "No internship/career tracking",
    ],
  },
};

const improvements = [
  {
    id: "mentorship",
    icon: "🤝",
    title: "Alumni Mentorship Matching",
    color: "#3ecf8e",
    inspired: "Gap in both LinkedIn and Facebook",
    description: "An AI-powered matching system that connects current students with alumni based on career goals, skills, and department. Neither LinkedIn nor Facebook have structured mentorship programs built into their core platform.",
    impact: "High",
    effort: "Medium",
    proposed: "Add a MentorshipService that stores mentor/mentee profiles, matching preferences, and session history. Use a simple compatibility score based on skills overlap and career goals.",
  },
  {
    id: "research",
    icon: "🔬",
    title: "Academic Research Collaboration Hub",
    color: "#4f8ef7",
    inspired: "Missing from both platforms",
    description: "A dedicated workspace for co-authoring research papers, sharing datasets, tracking contributions, and inviting collaborators. LinkedIn has no research tools. Facebook Groups are too generic for structured academic collaboration.",
    impact: "High",
    effort: "Medium",
    proposed: "Research Service with document versioning, contribution timeline, co-author invitations, and integration with Google Scholar/DOI for paper linking.",
  },
  {
    id: "graph",
    icon: "🕸️",
    title: "Department Social Graph",
    color: "#a855f7",
    inspired: "LinkedIn's connection graph, simplified",
    description: "LinkedIn's most powerful feature is the 1st/2nd/3rd degree connection graph. DECP should have a department-specific version — showing how students are connected through shared courses, research projects, and events.",
    impact: "Medium",
    effort: "Medium",
    proposed: "Add a ConnectionGraph component to User Service. Track connections formed via shared events, projects, and direct follows. Visualize as a graph on the profile page.",
  },
  {
    id: "feed_ranking",
    icon: "📊",
    title: "Smart Feed Ranking",
    color: "#e87c3e",
    inspired: "Facebook's ML EdgeRank",
    description: "Facebook's feed uses ML to rank content. For DECP's scale, a simpler rule-based ranking is sufficient and more transparent: prioritize posts from people you follow, recent events, job deadlines approaching, and high-engagement content.",
    impact: "Medium",
    effort: "Low",
    proposed: "Add a FeedRankingEngine to the Post Service that scores each post based on recency, engagement (likes/comments), relationship strength, and content type (job posts ranked higher near graduation).",
  },
  {
    id: "notifications",
    icon: "🔔",
    title: "Intelligent Notification Batching",
    color: "#f59e0b",
    inspired: "Facebook's notification grouping",
    description: "Facebook groups similar notifications ('5 people liked your post') instead of sending 5 separate alerts. DECP's Notification Service should do the same to avoid overwhelming users.",
    impact: "Medium",
    effort: "Low",
    proposed: "Add batching logic to the Notification Service: group same-type notifications within a 30-minute window before sending. Store raw events in Redis, batch and flush on a schedule.",
  },
  {
    id: "graphql",
    icon: "⚡",
    title: "GraphQL for Feed & Mobile",
    color: "#e84393",
    inspired: "Facebook's GraphQL (they invented it)",
    description: "REST APIs often over-fetch data — the mobile app might only need post title + thumbnail but receives the full post object. GraphQL lets the mobile client specify exactly what fields it needs, reducing bandwidth on mobile networks.",
    impact: "Medium",
    effort: "High",
    proposed: "Add an optional GraphQL gateway layer (using Netflix DGS or Apollo Federation) in front of the Post and User services specifically for the mobile client, while keeping REST for web.",
  },
  {
    id: "privacy",
    icon: "🔒",
    title: "Granular Privacy Controls",
    color: "#60a5fa",
    inspired: "Facebook's audience selector",
    description: "Facebook allows per-post audience selection (Public / Friends / Only Me / Custom). LinkedIn shows all posts to all connections by default. DECP should allow students to control who sees their posts — e.g. students-only vs alumni-visible.",
    impact: "Medium",
    effort: "Low",
    proposed: "Add a visibility field to Post entity: PUBLIC, STUDENTS_ONLY, ALUMNI_ONLY, CONNECTIONS_ONLY, PRIVATE. Post Service filters feed based on the requesting user's role and relationship.",
  },
  {
    id: "acl",
    icon: "🛡️",
    title: "ACL-Based Service Authorization",
    color: "#3ecf8e",
    inspired: "LinkedIn's ACL system",
    description: "LinkedIn uses Access Control Lists to define which services can access which other services. This prevents unauthorized cross-service data access. DECP should define clear ACL rules — e.g. Analytics Service can READ from all services but cannot WRITE.",
    impact: "High",
    effort: "Low",
    proposed: "Define an ACL matrix in the API Gateway configuration. Each service has a defined permission set. Enforced via Spring Security or a custom middleware in Node.js services.",
  },
];

const comparisonMatrix = [
  { feature: "Microservices SOA", linkedin: true, facebook: true, decp: true },
  { feature: "Event-driven async (Kafka/RabbitMQ)", linkedin: true, facebook: true, decp: true },
  { feature: "GraphQL API", linkedin: "partial", facebook: true, decp: false },
  { feature: "Social connection graph", linkedin: true, facebook: true, decp: "planned" },
  { feature: "ML feed ranking", linkedin: true, facebook: true, decp: false },
  { feature: "Real-time messaging (WebSocket)", linkedin: true, facebook: true, decp: true },
  { feature: "Mobile clients (iOS + Android)", linkedin: true, facebook: true, decp: true },
  { feature: "Push notifications", linkedin: true, facebook: true, decp: true },
  { feature: "Job/internship applications", linkedin: true, facebook: false, decp: true },
  { feature: "Research collaboration", linkedin: false, facebook: false, decp: true },
  { feature: "Academic mentorship matching", linkedin: false, facebook: false, decp: "proposed" },
  { feature: "Department-specific events", linkedin: false, facebook: "partial", decp: true },
  { feature: "Post privacy controls", linkedin: "partial", facebook: true, decp: "proposed" },
  { feature: "ACL-based service auth", linkedin: true, facebook: true, decp: "proposed" },
  { feature: "Analytics dashboard", linkedin: true, facebook: true, decp: true },
];

export default function PlatformResearch() {
  const [view, setView] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [selectedImprovement, setSelectedImprovement] = useState(null);

  const p = platforms[selectedPlatform];

  return (
    <div style={{
      background: C.bg,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: C.text,
      padding: "24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #0077b5, #1877f2)",
          borderRadius: "10px",
          padding: "3px 14px",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "10px",
          color: "#fff",
        }}>Research Findings</div>
        <h1 style={{
          fontSize: "26px", fontWeight: 800, margin: "0 0 6px",
          background: "linear-gradient(135deg, #dde4f5, #445070)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Platform Analysis: LinkedIn vs Facebook vs DECP</h1>
        <p style={{ color: C.muted, fontSize: "13px", margin: 0 }}>
          Architecture research, missing features, and proposed improvements
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "Platform Overview" },
          { id: "tech", label: "Tech Stacks" },
          { id: "comparison", label: "Feature Matrix" },
          { id: "improvements", label: "Proposed Improvements" },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: "8px 20px",
            borderRadius: "20px",
            border: `1px solid ${view === t.id ? "#4f8ef7" : C.border}`,
            background: view === t.id ? "#4f8ef722" : "transparent",
            color: view === t.id ? "#4f8ef7" : C.muted,
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 700,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* OVERVIEW */}
        {view === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {Object.values(platforms).map(plat => (
              <div key={plat.name} style={{
                background: C.card,
                border: `1px solid ${plat.color}44`,
                borderRadius: "16px",
                padding: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "32px" }}>{plat.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "18px", color: plat.color }}>{plat.name}</div>
                    <div style={{ color: C.muted, fontSize: "12px" }}>Founded {plat.founded} · {plat.users}</div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <SectionLabel label="Key Features" color={plat.color} />
                  {plat.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px", fontSize: "12px", color: C.muted }}>
                      <span style={{ color: plat.color }}>▸</span>{f}
                    </div>
                  ))}
                </div>

                <div>
                  <SectionLabel label="Missing for Academic Use" color="#e84393" />
                  {plat.missing.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px", fontSize: "12px", color: "#e84393" }}>
                      <span>✗</span>{f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TECH STACKS */}
        {view === "tech" && (
          <div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
              {Object.keys(platforms).map(k => (
                <button key={k} onClick={() => setSelectedPlatform(k)} style={{
                  padding: "8px 24px",
                  borderRadius: "20px",
                  border: `1px solid ${selectedPlatform === k ? platforms[k].color : C.border}`,
                  background: selectedPlatform === k ? `${platforms[k].color}22` : "transparent",
                  color: selectedPlatform === k ? platforms[k].color : C.muted,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 700,
                }}>
                  {platforms[k].icon} {platforms[k].name}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {p.stack.map((s, i) => (
                <div key={i} style={{
                  background: C.card,
                  border: `1px solid ${p.color}33`,
                  borderRadius: "12px",
                  padding: "14px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: C.muted, textTransform: "uppercase" }}>{s.area}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: p.color, marginBottom: "6px" }}>{s.tech}</div>
                  <div style={{ fontSize: "11px", color: C.muted, lineHeight: 1.6 }}>{s.detail}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "16px",
              background: `${p.color}10`,
              border: `1px solid ${p.color}33`,
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "12px",
              color: C.muted,
              lineHeight: 1.8,
            }}>
              <strong style={{ color: p.color }}>Key Lesson for DECP:</strong>{" "}
              {selectedPlatform === "linkedin"
                ? "LinkedIn's biggest architectural insight is that Kafka (which they invented) enables complete service decoupling. Every service publishes events; consumers react asynchronously. This is exactly what your RabbitMQ does. LinkedIn also defines strict ACLs per service — each service only accesses data it has a legitimate business reason to access."
                : "Facebook's biggest architectural insight is the TAO graph database — modeling everything as objects and associations. For DECP, this inspires the connection graph feature. Facebook also invented GraphQL to solve over-fetching on mobile — worth considering for your mobile client to reduce bandwidth on slower networks."}
            </div>
          </div>
        )}

        {/* COMPARISON MATRIX */}
        {view === "comparison" && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "12px 16px", color: C.muted, fontWeight: 700, fontSize: "11px", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>Feature</th>
                    {[
                      { name: "LinkedIn", color: "#0077b5" },
                      { name: "Facebook", color: "#1877f2" },
                      { name: "DECP", color: "#3ecf8e" },
                    ].map(h => (
                      <th key={h.name} style={{ textAlign: "center", padding: "12px 16px", color: h.color, fontWeight: 700, fontSize: "12px", borderBottom: `1px solid ${C.border}`, minWidth: "100px" }}>{h.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : "#ffffff04" }}>
                      <td style={{ padding: "10px 16px", color: C.text, fontSize: "12px" }}>{row.feature}</td>
                      {[row.linkedin, row.facebook, row.decp].map((val, j) => (
                        <td key={j} style={{ textAlign: "center", padding: "10px 16px" }}>
                          <StatusDot value={val} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px", justifyContent: "center", flexWrap: "wrap", fontSize: "12px", color: C.muted }}>
              {[
                { icon: "✅", label: "Implemented" },
                { icon: "⚠️", label: "Partial" },
                { icon: "🔵", label: "Planned/Proposed" },
                { icon: "❌", label: "Not available" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>{l.icon} {l.label}</div>
              ))}
            </div>
          </div>
        )}

        {/* IMPROVEMENTS */}
        {view === "improvements" && (
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignContent: "start" }}>
              {improvements.map(imp => (
                <div
                  key={imp.id}
                  onClick={() => setSelectedImprovement(selectedImprovement === imp.id ? null : imp.id)}
                  style={{
                    background: selectedImprovement === imp.id ? `${imp.color}18` : C.card,
                    border: `1px solid ${selectedImprovement === imp.id ? imp.color : C.border}`,
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "20px" }}>{imp.icon}</span>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: imp.color }}>{imp.title}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ fontSize: "10px", background: `${imp.color}22`, color: imp.color, padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>Impact: {imp.impact}</span>
                    <span style={{ fontSize: "10px", background: "#ffffff11", color: C.muted, padding: "2px 8px", borderRadius: "6px", fontWeight: 700 }}>Effort: {imp.effort}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              width: "320px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "14px",
              padding: "20px",
              alignSelf: "flex-start",
              position: "sticky",
              top: "24px",
            }}>
              {!selectedImprovement ? (
                <div style={{ textAlign: "center", color: C.muted, padding: "40px 0" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>💡</div>
                  <div style={{ fontSize: "12px" }}>Click an improvement to see the full proposal with implementation details</div>
                </div>
              ) : (() => {
                const imp = improvements.find(i => i.id === selectedImprovement);
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "26px" }}>{imp.icon}</span>
                      <div style={{ fontWeight: 800, fontSize: "15px", color: imp.color }}>{imp.title}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#f59e0b", marginBottom: "10px" }}>
                      💡 Inspired by: {imp.inspired}
                    </div>
                    <p style={{ color: C.muted, fontSize: "12px", lineHeight: 1.7, marginBottom: "14px" }}>
                      {imp.description}
                    </p>
                    <div style={{ background: `${imp.color}10`, border: `1px solid ${imp.color}30`, borderRadius: "10px", padding: "12px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 800, color: imp.color, textTransform: "uppercase", marginBottom: "8px" }}>Proposed Implementation</div>
                      <div style={{ fontSize: "12px", color: C.text, lineHeight: 1.7 }}>{imp.proposed}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <div style={{ flex: 1, background: `${imp.color}22`, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "10px", color: C.muted, marginBottom: "2px" }}>IMPACT</div>
                        <div style={{ fontSize: "13px", fontWeight: 800, color: imp.color }}>{imp.impact}</div>
                      </div>
                      <div style={{ flex: 1, background: "#ffffff11", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                        <div style={{ fontSize: "10px", color: C.muted, marginBottom: "2px" }}>EFFORT</div>
                        <div style={{ fontSize: "13px", fontWeight: 800, color: C.text }}>{imp.effort}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusDot({ value }) {
  if (value === true) return <span title="Implemented">✅</span>;
  if (value === false) return <span title="Not available">❌</span>;
  if (value === "partial") return <span title="Partial">⚠️</span>;
  if (value === "planned") return <span title="Planned">🔵</span>;
  if (value === "proposed") return <span title="Proposed improvement">🔵</span>;
  return null;
}

function SectionLabel({ label, color = "#445070" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
      <div style={{ width: "3px", height: "12px", background: color, borderRadius: "2px" }} />
      <span style={{ fontSize: "10px", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
    </div>
  );
}
