import { useState } from "react";

const C = {
  bg: "#07090f",
  surface: "#0d1018",
  card: "#111520",
  border: "#1a1f35",
  text: "#e2e8f8",
  muted: "#4a5275",
};

const coreModules = [
  {
    id: "auth", icon: "🔐", name: "Auth Module", color: "#e84393",
    components: ["JwtTokenProvider", "UserDetailsService", "RoleGuard", "AuthController", "RefreshTokenStore"],
    reusedBy: ["All services"],
    description: "Shared authentication and authorization. Every service validates JWT tokens.",
    improvements: [],
  },
  {
    id: "user", icon: "👤", name: "User Module", color: "#4f8ef7",
    components: ["UserProfile", "AlumniDirectory", "ConnectionGraph", "AvatarUpload", "RoleManager", "GraphTraversal"],
    reusedBy: ["Post", "Job", "Event", "Research", "Messaging", "Mentorship"],
    description: "Core identity module. ConnectionGraph added — tracks 1st/2nd degree connections via shared events and follows. Inspired by LinkedIn.",
    improvements: ["graph"],
  },
  {
    id: "post", icon: "📰", name: "Feed Module", color: "#a855f7",
    components: ["PostCard", "MediaUploader", "LikeButton", "CommentThread", "FeedAggregator", "FeedRankingEngine", "VisibilityFilter", "ShareAction"],
    reusedBy: ["Research (doc sharing)"],
    description: "FeedRankingEngine added (scores by recency, engagement, relationship, content type). VisibilityFilter added for post privacy controls. Inspired by Facebook EdgeRank and audience selector.",
    improvements: ["feed_ranking", "privacy"],
  },
  {
    id: "job", icon: "💼", name: "Jobs Module", color: "#2ec4b6",
    components: ["JobListingCard", "ApplicationForm", "ApplicantTracker", "JobFilter", "OpportunityBadge"],
    reusedBy: ["Analytics"],
    description: "Jobs and internship management with full application workflow.",
    improvements: [],
  },
  {
    id: "event", icon: "📅", name: "Events Module", color: "#e87c3e",
    components: ["EventCard", "RSVPButton", "EventCalendar", "AnnouncementBanner", "AttendeeList"],
    reusedBy: ["Notifications"],
    description: "Department event lifecycle — creation to attendance tracking.",
    improvements: [],
  },
];

const extendedModules = [
  {
    id: "research", icon: "🔬", name: "Research Module", color: "#3ecf8e",
    components: ["ProjectBoard", "DocumentVault", "VersionHistory", "CollaboratorInvite", "ContributionTimeline", "DOILinker"],
    reusedBy: ["Analytics"],
    description: "Enhanced research hub. VersionHistory tracks document revisions. DOILinker integrates with Google Scholar/DOI. Identified as missing from both LinkedIn and Facebook.",
    improvements: ["research"],
    optional: true,
  },
  {
    id: "mentorship", icon: "🤝", name: "Mentorship Module", color: "#3ecf8e",
    components: ["MentorCard", "MenteeProfile", "CompatibilityScorer", "SessionTracker", "MatchingEngine", "MentorshipRequest"],
    reusedBy: ["Notifications", "Analytics"],
    description: "NEW MODULE — Alumni mentorship matching. CompatibilityScorer calculates match quality based on skills + career goals overlap. Not available on LinkedIn or Facebook.",
    improvements: ["mentorship"],
    optional: true,
    isNew: true,
  },
  {
    id: "messaging", icon: "💬", name: "Messaging Module", color: "#60a5fa",
    components: ["ChatWindow", "ConversationList", "STOMPProvider", "GroupChat", "MessageBubble"],
    reusedBy: ["Research (group chat)"],
    description: "Real-time messaging via Spring WebSocket + STOMP. STOMPProvider is a reusable wrapper for WebSocket connections. Kept as an extended module due to distinct infrastructure requirements (sticky sessions, WebSocket).",
    improvements: [],
    optional: true,
  },
  {
    id: "notification", icon: "🔔", name: "Notification Module", color: "#f59e0b",
    components: ["NotificationBell", "NotificationCenter", "PushSubscriber", "BatchScheduler", "EventListener", "AlertToast"],
    reusedBy: ["All extended modules"],
    description: "BatchScheduler added — groups same-type events within a 30-min window before pushing. Prevents notification overload. Inspired by Facebook's notification grouping.",
    improvements: ["notifications"],
    optional: true,
  },
  {
    id: "analytics", icon: "📊", name: "Analytics Module", color: "#c084fc",
    components: ["MetricCard", "UserActivityChart", "PopularPostsTable", "JobFunnelChart", "MentorshipStats", "ExportReport"],
    reusedBy: ["Admin dashboard"],
    description: "Admin-only analytics. MentorshipStats added to track mentorship program engagement.",
    improvements: [],
    optional: true,
  },
];

const sharedComponents = [
  { name: "ApiClient",          desc: "Axios + interceptors for all REST calls",     color: "#4f8ef7", usedBy: "Web + Mobile" },
  { name: "AuthGuard",          desc: "Route protection HOC + role check",            color: "#e84393", usedBy: "Web + Mobile" },
  { name: "MediaUploader",      desc: "S3 presigned URL upload component",            color: "#a855f7", usedBy: "Post, Research" },
  { name: "NotificationBell",   desc: "Real-time notification UI with badge count",   color: "#f59e0b", usedBy: "All modules" },
  { name: "UserAvatar",         desc: "Profile picture with online indicator",        color: "#2ec4b6", usedBy: "Feed, Chat, Events" },
  { name: "AlertToast",         desc: "Feedback toast messages (success/error)",      color: "#3ecf8e", usedBy: "All modules" },
  { name: "ConnectionGraph",    desc: "D3-based social graph visualisation",          color: "#a855f7", usedBy: "User profile page", isNew: true },
  { name: "VisibilitySelector", desc: "Post audience picker dropdown",                color: "#60a5fa", usedBy: "Post creation form", isNew: true },
  { name: "CompatibilityScore", desc: "Alumni–student match score display",           color: "#3ecf8e", usedBy: "Mentorship module", isNew: true },
  { name: "GraphQLClient",      desc: "Apollo client for mobile GraphQL queries",     color: "#e84393", usedBy: "Mobile client only", isNew: true },
  { name: "SearchBar",          desc: "Global search across users, jobs, events",     color: "#60a5fa", usedBy: "Users, Jobs, Events" },
  { name: "LoadingSpinner",     desc: "Async state indicator",                        color: "#e87c3e", usedBy: "All modules" },
];

const improvementsSummary = [
  { id: "mentorship",    icon: "🤝", label: "Mentorship Module",       color: "#3ecf8e", affects: ["Mentorship Module (NEW)", "Analytics Module (+MentorshipStats)", "Notification (+mentorship events)"] },
  { id: "graph",         icon: "🕸️", label: "Dept. Social Graph",      color: "#a855f7", affects: ["User Module (+ConnectionGraph, +GraphTraversal)", "Shared: ConnectionGraph component"] },
  { id: "feed_ranking",  icon: "📊", label: "Smart Feed Ranking",      color: "#e87c3e", affects: ["Feed Module (+FeedRankingEngine component)"] },
  { id: "notifications", icon: "🔔", label: "Notif. Batching",         color: "#f59e0b", affects: ["Notification Module (+BatchScheduler component)"] },
  { id: "graphql",       icon: "⚡", label: "GraphQL Gateway",         color: "#e84393", affects: ["Shared: GraphQLClient component (mobile only)"] },
  { id: "privacy",       icon: "🔒", label: "Post Privacy Controls",   color: "#60a5fa", affects: ["Feed Module (+VisibilityFilter)", "Shared: VisibilitySelector component"] },
  { id: "acl",           icon: "🛡️", label: "ACL Service Auth",        color: "#3ecf8e", affects: ["Auth Module (+ACL enforcement in API Gateway config)"] },
  { id: "research",      icon: "🔬", label: "Research Hub Enhanced",   color: "#4f8ef7", affects: ["Research Module (+VersionHistory, +DOILinker components)"] },
];

export default function ProductModularity() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("modules");

  const allModules = [...coreModules, ...extendedModules];
  const sel = allModules.find(m => m.id === selected);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, padding: "24px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ display: "inline-block", background: "linear-gradient(135deg, #3ecf8e, #4f8ef7)", borderRadius: "10px", padding: "3px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", color: "#fff" }}>Product Architecture — Updated</div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #e2e8f8, #4a5275)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Product Modularity Diagram</h1>
        <p style={{ color: C.muted, fontSize: "12px", margin: 0 }}>1 new module (Mentorship) + 7 module-level improvements from platform research</p>
      </div>

      {/* View Toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        {["modules", "shared", "improvements", "maintainability"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "6px 16px", borderRadius: "20px", border: `1px solid ${view === v ? "#3ecf8e" : C.border}`, background: view === v ? "#3ecf8e22" : "transparent", color: view === v ? "#3ecf8e" : C.muted, cursor: "pointer", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" }}>{v}</button>
        ))}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── MODULES VIEW ── */}
        {view === "modules" && (
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <Section label="Core Modules" color="#4f8ef7" desc="Always deployed — required for platform to function" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {coreModules.map(m => <ModuleCard key={m.id} m={m} selected={selected} onSelect={setSelected} />)}
              </div>
              <Section label="Extended / Optional Modules" color="#c084fc" desc="Can be deployed independently" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {extendedModules.map(m => <ModuleCard key={m.id} m={m} selected={selected} onSelect={setSelected} />)}
              </div>
            </div>

            {/* Detail Panel */}
            <div style={{ width: "300px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "18px", alignSelf: "flex-start", position: "sticky", top: "24px" }}>
              {!sel ? (
                <div style={{ textAlign: "center", color: C.muted, padding: "40px 0" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>📦</div>
                  <div style={{ fontSize: "12px" }}>Click a module to see its components, improvements, and reuse map</div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "26px" }}>{sel.icon}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <div style={{ fontWeight: 800, fontSize: "14px", color: sel.color }}>{sel.name}</div>
                        {sel.isNew && <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "9px", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>NEW</span>}
                      </div>
                      {sel.optional && <span style={{ background: `${sel.color}22`, color: sel.color, fontSize: "9px", padding: "1px 6px", borderRadius: "5px", fontWeight: 700 }}>OPTIONAL</span>}
                    </div>
                  </div>

                  <p style={{ color: C.muted, fontSize: "11px", lineHeight: 1.6, marginBottom: "12px" }}>{sel.description}</p>

                  {sel.improvements.length > 0 && (
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", marginBottom: "6px" }}>✨ Research Improvements</div>
                      {sel.improvements.map(impId => {
                        const imp = improvementsSummary.find(i => i.id === impId);
                        return imp ? (
                          <div key={impId} style={{ background: `${imp.color}15`, border: `1px solid ${imp.color}33`, borderRadius: "6px", padding: "5px 8px", marginBottom: "4px", fontSize: "11px", color: imp.color, fontWeight: 600 }}>
                            {imp.icon} {imp.label}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: sel.color, textTransform: "uppercase", marginBottom: "6px" }}>Internal Components</div>
                    {sel.components.map(c => (
                      <div key={c} style={{ background: `${sel.color}10`, border: `1px solid ${sel.color}30`, borderRadius: "5px", padding: "4px 8px", marginBottom: "3px", fontSize: "10px", fontFamily: "monospace", color: sel.color }}>{c}</div>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: "#3ecf8e", textTransform: "uppercase", marginBottom: "6px" }}>Reused By</div>
                    {sel.reusedBy.map(r => (
                      <div key={r} style={{ background: "#3ecf8e10", borderRadius: "5px", padding: "3px 8px", marginBottom: "3px", fontSize: "10px", color: "#3ecf8e" }}>↗ {r}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SHARED COMPONENTS VIEW ── */}
        {view === "shared" && (
          <div>
            <div style={{ background: "#4f8ef710", border: "1px solid #4f8ef730", borderRadius: "12px", padding: "12px 18px", marginBottom: "16px", fontSize: "12px", color: "#4f8ef7", fontWeight: 600, textAlign: "center" }}>
              🔄 Built once, used across both Web (React) and Mobile (React Native). 4 new shared components added from research improvements.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "12px" }}>
              {sharedComponents.map(sc => (
                <div key={sc.name} style={{ background: C.card, border: `1px solid ${sc.isNew ? sc.color : sc.color + "44"}`, borderRadius: "12px", padding: "14px", borderStyle: sc.isNew ? "dashed" : "solid" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.color, flexShrink: 0 }} />
                    <div style={{ fontWeight: 700, fontSize: "12px", fontFamily: "monospace", color: sc.color }}>{sc.name}</div>
                    {sc.isNew && <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "8px", padding: "1px 5px", borderRadius: "4px", fontWeight: 800 }}>NEW</span>}
                  </div>
                  <div style={{ color: C.muted, fontSize: "11px", marginBottom: "6px" }}>{sc.desc}</div>
                  <div style={{ fontSize: "10px", color: sc.color, background: `${sc.color}18`, padding: "2px 7px", borderRadius: "5px", display: "inline-block" }}>Used by: {sc.usedBy}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── IMPROVEMENTS VIEW ── */}
        {view === "improvements" && (
          <div>
            <div style={{ background: "#f59e0b10", border: "1px solid #f59e0b33", borderRadius: "12px", padding: "12px 18px", marginBottom: "16px", fontSize: "12px", color: "#f59e0b", textAlign: "center", fontWeight: 600 }}>
              Each improvement below shows exactly which modules and components were added or changed
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {improvementsSummary.map(imp => (
                <div key={imp.id} style={{ background: C.card, border: `1px solid ${imp.color}44`, borderRadius: "14px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "22px" }}>{imp.icon}</span>
                    <div style={{ fontWeight: 800, fontSize: "13px", color: imp.color }}>{imp.label}</div>
                  </div>
                  {imp.affects.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "5px", fontSize: "11px", color: C.muted }}>
                      <span style={{ color: imp.color }}>▸</span>{a}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MAINTAINABILITY VIEW ── */}
        {view === "maintainability" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { icon: "🧩", title: "Independent Deployability",  color: "#3ecf8e", points: ["Each service has its own Docker container and ECS service","Services deploy independently via GitHub Actions CI/CD","Optional modules (Mentorship, Research) can be disabled without affecting core","Rolling updates — zero downtime on AWS ECS"] },
              { icon: "🔌", title: "API Contracts & Versioning", color: "#4f8ef7", points: ["All APIs versioned: /api/v1/**","OpenAPI/Swagger auto-docs for all Spring Boot services","New improvements added as new endpoints — no breaking changes","Mentorship endpoints fully isolated from existing services"] },
              { icon: "🧪", title: "Testing Strategy",           color: "#a855f7", points: ["Unit tests per service (JUnit 5)","Integration tests for cross-service flows","E2E tests on critical paths: login, post, apply, match","New services (Mentorship) require full unit + integration test coverage"] },
              { icon: "📈", title: "Scalability Plan",           color: "#e87c3e", points: ["Feed Service scales most — FeedRankingEngine is CPU-intensive","Messaging Service needs sticky sessions on ALB for WebSocket","Redis caches ranked feed results (TTL: 5 minutes)","Mentorship matching runs async — no blocking the user request"] },
              { icon: "🛡️", title: "ACL Security Plan",          color: "#e84393", points: ["ACL matrix defined in API Gateway config (improvement from LinkedIn)","Analytics: READ only — cannot write to any service","Mentorship: isolated data — only accessible by matched pair","Auth Service issues scoped tokens per role (student/alumni/admin)"] },
              { icon: "📁", title: "Monorepo & Dev Workflow",    color: "#f59e0b", points: ["Single GitHub repo, /services/* per service","docker-compose.yml starts all 10 services + 3 DBs + RabbitMQ","New Mentorship Service added at /services/mentorship-service","Shared DTOs in /shared library to avoid duplication across services"] },
            ].map(card => (
              <div key={card.title} style={{ background: C.card, border: `1px solid ${card.color}44`, borderRadius: "14px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "20px" }}>{card.icon}</span>
                  <div style={{ fontWeight: 800, fontSize: "13px", color: card.color }}>{card.title}</div>
                </div>
                {card.points.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: "7px", marginBottom: "6px", fontSize: "11px", color: C.muted, lineHeight: 1.5 }}>
                    <div style={{ color: card.color, flexShrink: 0 }}>▸</div>{p}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, color, desc }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "3px", height: "14px", background: color, borderRadius: "2px" }} />
        <span style={{ fontSize: "10px", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
        <div style={{ flex: 1, height: "1px", background: `${color}22` }} />
      </div>
      <div style={{ color: "#4a5275", fontSize: "10px", marginTop: "3px", paddingLeft: "11px" }}>{desc}</div>
    </div>
  );
}

function ModuleCard({ m, selected, onSelect }) {
  const isSelected = selected === m.id;
  return (
    <div onClick={() => onSelect(isSelected ? null : m.id)} style={{ background: isSelected ? `${m.color}18` : "#111520", border: `1px solid ${isSelected ? m.color : m.optional ? `${m.color}33` : `${m.color}66`}`, borderRadius: "12px", padding: "12px", cursor: "pointer", transition: "all 0.18s", borderStyle: m.optional ? "dashed" : "solid" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
        <span style={{ fontSize: "18px" }}>{m.icon}</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ fontWeight: 700, fontSize: "12px", color: m.color }}>{m.name}</div>
            {m.isNew && <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "8px", padding: "1px 4px", borderRadius: "3px", fontWeight: 800 }}>NEW</span>}
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
            {m.optional && <span style={{ background: `${m.color}22`, color: m.color, fontSize: "9px", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>OPTIONAL</span>}
            {m.improvements.length > 0 && <span style={{ background: "#f59e0b22", color: "#f59e0b", fontSize: "9px", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>✨ {m.improvements.length} improved</span>}
          </div>
        </div>
      </div>
      <div style={{ color: "#4a5275", fontSize: "10px" }}>{m.components.length} components</div>
    </div>
  );
}
