import { useState } from "react";

const C = {
  bg: "#06080e",
  surface: "#0b0e18",
  card: "#0f1320",
  border: "#181d30",
  text: "#dde4f5",
  muted: "#424a6a",
  aws: "#ff9900",
};

const improvementBadges = {
  graphql:       { label: "⚡ GraphQL",         color: "#e84393" },
  acl:           { label: "🛡️ ACL",             color: "#3ecf8e" },
  mentorship:    { label: "🤝 Mentorship",       color: "#3ecf8e" },
  notifications: { label: "🔔 Notif. Batching",  color: "#f59e0b" },
  feed_ranking:  { label: "📊 Feed Ranking",     color: "#e87c3e" },
  privacy:       { label: "🔒 Privacy",          color: "#60a5fa" },
  graph:         { label: "🕸️ Social Graph",     color: "#a855f7" },
  research:      { label: "🔬 Research Hub",     color: "#4f8ef7" },
};

const infrastructure = {
  public: [
    {
      id: "cf", icon: "🌍", name: "CloudFront CDN", aws: "AWS CloudFront", color: "#ff9900",
      desc: "Serves React SPA static assets globally. Origin: S3 bucket for web build. Also serves GraphQL introspection schema to mobile clients.",
      spec: "Price class: All edges, HTTPS enforced",
      improvements: [],
    },
    {
      id: "alb", icon: "⚖️", name: "Application Load Balancer", aws: "AWS ALB", color: "#ff9900",
      desc: "Distributes traffic to ECS tasks. HTTPS termination via ACM. Sticky sessions enabled for WebSocket (Messaging Service). ACL rules enforced at gateway layer behind ALB.",
      spec: "HTTPS :443, HTTP :80 → redirect. Sticky sessions for /ws",
      improvements: ["acl"],
    },
  ],
  private: [
    {
      id: "gateway_svc", icon: "🔀", name: "API Gateway Service", aws: "ECS Fargate", color: "#f0c040", tech: "Spring Cloud Gateway",
      desc: "Routes /api/** to services and /graphql to GraphQL layer. Enforces ACL matrix — defines which services can READ/WRITE to which. JWT passthrough to all services.",
      instances: "2 tasks (min) / 6 tasks (max) — auto-scale on CPU > 70%",
      improvements: ["graphql", "acl"],
    },
    {
      id: "graphql_layer", icon: "⚡", name: "GraphQL Gateway", aws: "ECS Fargate", color: "#e84393", tech: "Netflix DGS (Spring Boot)",
      desc: "NEW — Optional GraphQL layer for mobile client. Sits in front of Post and User services. Lets mobile client request exactly the fields it needs — reduces bandwidth on slow networks. Inspired by Facebook's GraphQL.",
      instances: "1 task (min) / 3 tasks (max)",
      improvements: ["graphql"],
      isNew: true,
    },
    {
      id: "core_svcs", icon: "☕", name: "Core Spring Boot Services", aws: "ECS Fargate", color: "#6db33f", tech: "Spring Boot",
      desc: "Auth, User (+Social Graph), Post (+FeedRankingEngine +VisibilityFilter), Job, Event, Analytics. Each runs as an independent ECS service with its own task definition.",
      instances: "1–3 tasks each. Post Service may scale higher due to FeedRankingEngine CPU usage.",
      improvements: ["graph", "feed_ranking", "privacy"],
    },
    {
      id: "extended_svcs", icon: "🔧", name: "Extended Spring Boot Services", aws: "ECS Fargate", color: "#3ecf8e", tech: "Spring Boot",
      desc: "Research (+VersionHistory, +DOILinker), Messaging (WebSocket+STOMP), Notification (+BatchScheduler), and NEW Mentorship Service. All independently deployable.",
      instances: "1–2 tasks each. Mentorship matching runs as async job — no scaling pressure.",
      improvements: ["mentorship", "notifications", "research"],
      isNew: true,
    },
  ],
  data: [
    {
      id: "rds", icon: "🐘", name: "PostgreSQL", aws: "AWS RDS", color: "#4169e1",
      desc: "Primary DB for Users (with connection graph edges), Jobs, Events, Auth, Analytics, and NEW Mentorship (mentor/mentee profiles, sessions, compatibility scores).",
      spec: "db.t3.medium, Multi-AZ, automated backups 7-day retention",
    },
    {
      id: "docdb", icon: "🍃", name: "MongoDB", aws: "AWS DocumentDB", color: "#3ecf8e",
      desc: "Document store for Posts (now includes visibility field), Messages, Research documents (with version history). Flexible schema suits the evolving post structure.",
      spec: "db.r5.large, 1 primary + 1 read replica",
    },
    {
      id: "redis", icon: "⚡", name: "Redis", aws: "AWS ElastiCache", color: "#e84393",
      desc: "Session storage, ranked feed cache (TTL 5 min — FeedRankingEngine results cached here), notification batching queue (raw events stored before 30-min flush), WebSocket session tracking.",
      spec: "cache.t3.medium — expanded usage due to feed ranking + notification batching",
      improvements: ["feed_ranking", "notifications"],
    },
    {
      id: "s3", icon: "🗂️", name: "S3 Storage", aws: "AWS S3", color: "#e87c3e",
      desc: "Media for posts, research documents (versioned — S3 versioning enabled for research files), profile pictures. Presigned URLs for direct client uploads.",
      spec: "Standard + S3 Versioning enabled for /research/* prefix",
      improvements: ["research"],
    },
  ],
  messaging: [
    {
      id: "sqs", icon: "📨", name: "SQS Message Queue", aws: "AWS SQS", color: "#a855f7",
      desc: "Production message broker replacing local RabbitMQ. Carries events: post.created, job.posted, event.rsvp, mentorship.matched (new), message.sent, research.invited. Dead-letter queue for failed processing.",
      spec: "Standard queue, 14-day retention, DLQ configured. mentorship.* queues added.",
      improvements: ["mentorship"],
    },
    {
      id: "sns", icon: "🔔", name: "SNS + Batch Scheduler", aws: "AWS SNS + EventBridge", color: "#f59e0b",
      desc: "Mobile push via FCM/APNs. BatchScheduler (EventBridge rule) triggers every 30 min to flush batched notifications from Redis — prevents notification overload. Inspired by Facebook's grouping.",
      spec: "FCM + APNs platform apps. EventBridge rule: rate(30 minutes) → Notification Service /batch endpoint",
      improvements: ["notifications"],
    },
  ],
  devops: [
    { id: "ecr",    icon: "📦", name: "ECR",              aws: "Container Registry",    color: "#ff9900", desc: "Docker images for all 10 services including new Mentorship + GraphQL services" },
    { id: "gh",     icon: "⚙️", name: "GitHub Actions",   aws: "CI/CD Pipeline",        color: "#ffffff", desc: "Build → Test → Push ECR → Deploy ECS (rolling). Separate pipelines per service." },
    { id: "cw",     icon: "📊", name: "CloudWatch",       aws: "Monitoring & Logs",     color: "#ff9900", desc: "Logs, metrics, alarms. Custom dashboard for feed ranking latency + mentorship match rate." },
    { id: "ssm",    icon: "🔑", name: "Parameter Store",  aws: "AWS SSM",               color: "#ff9900", desc: "ACL matrix config, JWT secrets, DB URLs, Firebase credentials. All services read from SSM." },
    { id: "waf",    icon: "🛡️", name: "AWS WAF",          aws: "Web Application Firewall", color: "#e84393", desc: "ACL improvement: WAF rules block malicious requests before reaching ALB. Rate limiting per IP.", isNew: true },
  ],
};

export default function DeploymentDiagram() {
  const [selected, setSelected] = useState(null);
  const [filterImprovement, setFilterImprovement] = useState(null);

  const allItems = [...infrastructure.public, ...infrastructure.private, ...infrastructure.data, ...infrastructure.messaging, ...infrastructure.devops];
  const sel = allItems.find(i => i.id === selected);

  const isDimmed = (item) => {
    if (!filterImprovement) return false;
    return !(item.improvements || []).includes(filterImprovement);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, padding: "24px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ display: "inline-block", background: "linear-gradient(135deg, #ff9900, #e87c3e)", borderRadius: "10px", padding: "3px 14px", fontSize: "10px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", color: "#000" }}>Deployment Diagram — Updated</div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #dde4f5, #424a6a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AWS Cloud Deployment Architecture</h1>
        <p style={{ color: C.muted, fontSize: "12px", margin: 0 }}>Updated with GraphQL layer, WAF, Mentorship Service, Redis batching, S3 versioning, EventBridge scheduler</p>
      </div>

      {/* Improvement Filter */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Highlight improvement in deployment:</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button onClick={() => setFilterImprovement(null)} style={{ padding: "4px 12px", borderRadius: "10px", border: `1px solid ${!filterImprovement ? "#ffffff44" : C.border}`, background: !filterImprovement ? "#ffffff11" : "transparent", color: !filterImprovement ? C.text : C.muted, cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>All</button>
          {Object.entries(improvementBadges).map(([id, imp]) => (
            <button key={id} onClick={() => setFilterImprovement(filterImprovement === id ? null : id)} style={{ padding: "4px 12px", borderRadius: "10px", border: `1px solid ${filterImprovement === id ? imp.color : C.border}`, background: filterImprovement === id ? `${imp.color}22` : "transparent", color: filterImprovement === id ? imp.color : C.muted, cursor: "pointer", fontSize: "11px", fontWeight: 600 }}>{imp.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>

          {/* Clients */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "10px" }}>
            {[
              { icon: "🌐", label: "Web (React)", sub: "REST API" },
              { icon: "📱", label: "Mobile (React Native)", sub: "REST + GraphQL" },
            ].map(c => (
              <div key={c.label} style={{ background: "#1a2040", border: "1px solid #2a3060", borderRadius: "10px", padding: "10px 20px", textAlign: "center", fontSize: "12px" }}>
                <div style={{ fontSize: "20px" }}>{c.icon}</div>
                <div style={{ fontWeight: 700 }}>{c.label}</div>
                <div style={{ color: C.muted, fontSize: "10px" }}>{c.sub}</div>
              </div>
            ))}
          </div>

          <FlowLine />

          {/* AWS Region */}
          <div style={{ border: "1px dashed #ff990066", borderRadius: "16px", padding: "14px", background: "#ff990005" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.aws, marginBottom: "10px" }}>🌏 AWS Region: ap-southeast-1 (Singapore)</div>

            {/* WAF */}
            <div style={{ background: "#e8439315", border: "1px solid #e8439355", borderRadius: "10px", padding: "8px 14px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "12px", color: "#e84393", fontWeight: 600 }}>🛡️ AWS WAF — blocks malicious requests, rate limits per IP</div>
              <NewBadge />
            </div>

            {/* Public Subnet */}
            <SubnetBox label="Public Subnet" color="#ff9900">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {infrastructure.public.map(item => <DeployCard key={item.id} item={item} selected={selected} onSelect={setSelected} dimmed={isDimmed(item)} />)}
              </div>
            </SubnetBox>

            <FlowLine />

            {/* Private Subnet */}
            <SubnetBox label="Private Subnet — VPC" color="#4f8ef7">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {infrastructure.private.map(item => <DeployCard key={item.id} item={item} selected={selected} onSelect={setSelected} dimmed={isDimmed(item)} />)}
              </div>
            </SubnetBox>

            <FlowLine />

            {/* Data Subnet */}
            <SubnetBox label="Data Subnet (Isolated)" color="#3ecf8e">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
                {infrastructure.data.map(item => <DeployCard key={item.id} item={item} selected={selected} onSelect={setSelected} dimmed={isDimmed(item)} />)}
              </div>
            </SubnetBox>

            <FlowLine />

            {/* Managed Services */}
            <SubnetBox label="Managed Services (outside VPC)" color="#a855f7">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {infrastructure.messaging.map(item => <DeployCard key={item.id} item={item} selected={selected} onSelect={setSelected} dimmed={isDimmed(item)} />)}
              </div>
            </SubnetBox>
          </div>

          {/* DevOps */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, color: C.aws, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>DevOps & Observability</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "8px" }}>
              {infrastructure.devops.map(item => <DeployCard key={item.id} item={item} selected={selected} onSelect={setSelected} small dimmed={isDimmed(item)} />)}
            </div>
          </div>

          {/* CI/CD note */}
          <div style={{ marginTop: "12px", background: "#ffffff08", border: "1px solid #1a1f35", borderRadius: "10px", padding: "10px 14px", fontSize: "11px", color: C.muted, textAlign: "center" }}>
            🔄 <strong style={{ color: C.text }}>CI/CD:</strong> Push to GitHub → GitHub Actions → Tests → Build Docker → Push ECR → ECS rolling deploy (per service independently)
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ width: "290px", background: C.surface, border: "1px solid #181d30", borderRadius: "14px", padding: "18px", alignSelf: "flex-start", position: "sticky", top: "24px" }}>
          {!sel ? (
            <div style={{ textAlign: "center", color: C.muted, padding: "40px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>☁️</div>
              <div style={{ fontSize: "12px" }}>Click any component to see its AWS configuration and which improvements it supports</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "24px" }}>{sel.icon}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ fontWeight: 800, fontSize: "13px", color: sel.color }}>{sel.name}</div>
                    {sel.isNew && <NewBadge />}
                  </div>
                  <span style={{ background: `${sel.color}22`, color: sel.color, fontSize: "10px", padding: "2px 7px", borderRadius: "5px", fontWeight: 700 }}>{sel.aws}</span>
                </div>
              </div>

              {(sel.improvements || []).length > 0 && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
                  {(sel.improvements || []).map(impId => {
                    const imp = improvementBadges[impId];
                    return imp ? <span key={impId} style={{ background: `${imp.color}22`, color: imp.color, fontSize: "10px", padding: "2px 7px", borderRadius: "5px", fontWeight: 700 }}>{imp.label}</span> : null;
                  })}
                </div>
              )}

              <p style={{ color: C.muted, fontSize: "11px", lineHeight: 1.7, marginBottom: "10px" }}>{sel.desc}</p>

              {sel.spec && (
                <div style={{ background: `${sel.color}10`, border: `1px solid ${sel.color}30`, borderRadius: "8px", padding: "9px 11px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: sel.color, marginBottom: "3px", textTransform: "uppercase" }}>Spec</div>
                  <div style={{ fontSize: "11px", fontFamily: "monospace", color: C.text }}>{sel.spec}</div>
                </div>
              )}
              {sel.instances && (
                <div style={{ background: `${sel.color}10`, border: `1px solid ${sel.color}30`, borderRadius: "8px", padding: "9px 11px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: sel.color, marginBottom: "3px", textTransform: "uppercase" }}>Scaling</div>
                  <div style={{ fontSize: "11px", color: C.text }}>{sel.instances}</div>
                </div>
              )}
              {sel.tech && <div style={{ marginTop: "8px", fontSize: "11px", color: sel.color }}>🛠 Runtime: <strong>{sel.tech}</strong></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeployCard({ item, selected, onSelect, small, dimmed }) {
  const isSelected = selected === item.id;
  return (
    <div onClick={() => onSelect(isSelected ? null : item.id)} style={{ background: isSelected ? `${item.color}18` : C.card, border: `1px solid ${isSelected ? item.color : item.color + "44"}`, borderRadius: "10px", padding: small ? "8px" : "12px", cursor: "pointer", transition: "all 0.18s", textAlign: small ? "center" : "left", opacity: dimmed ? 0.2 : 1, borderStyle: item.isNew ? "dashed" : "solid" }}>
      <div style={{ fontSize: small ? "16px" : "20px", marginBottom: "3px" }}>{item.icon}</div>
      <div style={{ fontWeight: 700, fontSize: small ? "10px" : "11px", color: item.color }}>{item.name}</div>
      {!small && (
        <div style={{ display: "flex", gap: "4px", marginTop: "3px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "9px", color: C.muted }}>{item.aws}</div>
          {item.isNew && <NewBadge />}
          {(item.improvements || []).length > 0 && <span style={{ fontSize: "9px", color: "#f59e0b" }}>✨</span>}
        </div>
      )}
    </div>
  );
}

function SubnetBox({ label, color, children }) {
  return (
    <div style={{ border: `1px dashed ${color}55`, borderRadius: "12px", padding: "12px", background: `${color}05`, marginBottom: "4px" }}>
      <div style={{ fontSize: "10px", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>📁 {label}</div>
      {children}
    </div>
  );
}

function NewBadge() {
  return <span style={{ background: "#3ecf8e22", color: "#3ecf8e", fontSize: "8px", padding: "1px 5px", borderRadius: "4px", fontWeight: 800 }}>NEW</span>;
}

function FlowLine() {
  return <div style={{ textAlign: "center", color: "#1e2640", fontSize: "16px", margin: "5px 0" }}>↕</div>;
}
