"use client";

import { useMemo, useState } from "react";

type HealthStatus = "healthy" | "warning" | "critical";
type View = "Overview" | "Applications" | "Pull requests" | "Policies" | "Dependencies" | "Reports";

type Mfe = {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  score: number;
  status: HealthStatus;
  uiScore: number;
  bundleKb: number;
  bundleDelta: number;
  mountP75: number;
  apiP95: number;
  deploy: string;
  version: string;
  trend: number[];
  route: string;
};

const mfes: Mfe[] = [
  {
    id: "shell",
    name: "Bedrock Shell",
    description: "Composition, navigation and shared runtime",
    owner: "Platform Experience",
    ownerInitials: "PE",
    score: 94,
    status: "healthy",
    uiScore: 96,
    bundleKb: 188,
    bundleDelta: -3.2,
    mountP75: 184,
    apiP95: 128,
    deploy: "18 min ago",
    version: "v4.18.2",
    trend: [86, 88, 91, 90, 93, 92, 94],
    route: "/",
  },
  {
    id: "catalog",
    name: "Catalog",
    description: "Search, filters and product discovery",
    owner: "Discovery",
    ownerInitials: "DS",
    score: 78,
    status: "warning",
    uiScore: 81,
    bundleKb: 257,
    bundleDelta: 20.4,
    mountP75: 436,
    apiP95: 684,
    deploy: "2 hr ago",
    version: "v2.31.0",
    trend: [88, 87, 84, 83, 82, 80, 78],
    route: "/shop",
  },
  {
    id: "pip",
    name: "Product Information",
    description: "Gallery, variants and product configuration",
    owner: "Product Journey",
    ownerInitials: "PJ",
    score: 89,
    status: "healthy",
    uiScore: 92,
    bundleKb: 232,
    bundleDelta: 1.8,
    mountP75: 318,
    apiP95: 412,
    deploy: "Yesterday",
    version: "v3.12.4",
    trend: [84, 86, 86, 87, 88, 89, 89],
    route: "/product/:id",
  },
  {
    id: "cart",
    name: "Cart",
    description: "Bag management and order summary",
    owner: "Checkout Core",
    ownerInitials: "CC",
    score: 96,
    status: "healthy",
    uiScore: 98,
    bundleKb: 146,
    bundleDelta: -6.7,
    mountP75: 162,
    apiP95: 206,
    deploy: "3 days ago",
    version: "v1.44.1",
    trend: [90, 91, 93, 92, 94, 95, 96],
    route: "/cart",
  },
  {
    id: "checkout",
    name: "Checkout",
    description: "Delivery, payment and confirmation",
    owner: "Checkout Core",
    ownerInitials: "CC",
    score: 68,
    status: "critical",
    uiScore: 72,
    bundleKb: 298,
    bundleDelta: 15.3,
    mountP75: 612,
    apiP95: 1240,
    deploy: "42 min ago",
    version: "v2.8.0",
    trend: [90, 89, 91, 88, 84, 76, 68],
    route: "/checkout",
  },
  {
    id: "phygital",
    name: "Phygital",
    description: "Shoppable rooms and inspiration boards",
    owner: "Digital Experience",
    ownerInitials: "DX",
    score: 84,
    status: "warning",
    uiScore: 86,
    bundleKb: 286,
    bundleDelta: 4.1,
    mountP75: 391,
    apiP95: 348,
    deploy: "5 days ago",
    version: "v1.16.3",
    trend: [79, 80, 82, 82, 83, 85, 84],
    route: "/spaces",
  },
];

const pullRequests = [
  {
    id: "#1842",
    title: "Add faceted search and predictive suggestions",
    mfe: "Catalog",
    author: "A. Khan",
    branch: "feat/catalog-facets",
    status: "warning" as HealthStatus,
    conclusion: "2 budgets exceeded",
    updated: "8 min ago",
    checks: [
      { label: "Initial JS", before: "214 KB", after: "257 KB", delta: "+20.4%", state: "bad" },
      { label: "Mount p75", before: "310 ms", after: "436 ms", delta: "+40.6%", state: "bad" },
      { label: "LCP", before: "2.1 s", after: "2.2 s", delta: "+4.8%", state: "good" },
      { label: "API p95", before: "711 ms", after: "684 ms", delta: "-3.8%", state: "good" },
    ],
  },
  {
    id: "#1839",
    title: "Enable express payment experiment",
    mfe: "Checkout",
    author: "M. Silva",
    branch: "exp/express-pay",
    status: "critical" as HealthStatus,
    conclusion: "Merge blocked",
    updated: "21 min ago",
    checks: [
      { label: "Initial JS", before: "258 KB", after: "298 KB", delta: "+15.3%", state: "bad" },
      { label: "Mount p75", before: "388 ms", after: "612 ms", delta: "+57.7%", state: "bad" },
      { label: "CLS", before: "0.03", after: "0.18", delta: "+500%", state: "bad" },
      { label: "API p95", before: "620 ms", after: "1.24 s", delta: "+100%", state: "bad" },
    ],
  },
  {
    id: "#1837",
    title: "Align Vue shared singleton configuration",
    mfe: "Bedrock Shell",
    author: "S. Patel",
    branch: "fix/shared-vue-runtime",
    status: "healthy" as HealthStatus,
    conclusion: "Ready to merge",
    updated: "1 hr ago",
    checks: [
      { label: "Initial JS", before: "201 KB", after: "188 KB", delta: "-6.5%", state: "good" },
      { label: "Vue copies", before: "2", after: "1", delta: "-1", state: "good" },
      { label: "Mount p75", before: "216 ms", after: "184 ms", delta: "-14.8%", state: "good" },
      { label: "Remote load", before: "99.88%", after: "99.96%", delta: "+0.08%", state: "good" },
    ],
  },
];

const dependencyRows = [
  { name: "vue", version: "3.5.21", usedBy: 6, parsed: "126 KB", installed: "2.4 MB", duplicate: "1 version", risk: "good" },
  { name: "lucide-vue-next", version: "0.468.0", usedBy: 6, parsed: "57 KB", installed: "5.8 MB", duplicate: "1 version", risk: "good" },
  { name: "@module-federation/vite", version: "1.19.1", usedBy: 6, parsed: "42 KB", installed: "18.6 MB", duplicate: "1 version", risk: "good" },
  { name: "date-fns", version: "4.1.0 / 3.6.0", usedBy: 2, parsed: "81 KB", installed: "7.2 MB", duplicate: "2 versions", risk: "warning" },
  { name: "lodash-es", version: "4.17.21", usedBy: 3, parsed: "69 KB", installed: "2.7 MB", duplicate: "1 version", risk: "warning" },
  { name: "zod", version: "4.1.5 / 3.25.1", usedBy: 3, parsed: "48 KB", installed: "4.9 MB", duplicate: "2 versions", risk: "critical" },
];

const navItems: View[] = ["Overview", "Applications", "Pull requests", "Policies", "Dependencies", "Reports"];

const statusCopy: Record<HealthStatus, string> = {
  healthy: "Healthy",
  warning: "Needs attention",
  critical: "Critical",
};

function StatusPill({ status, compact = false }: { status: HealthStatus; compact?: boolean }) {
  return (
    <span className={`status-pill ${status} ${compact ? "compact" : ""}`}>
      <span className="status-dot" />
      {statusCopy[status]}
    </span>
  );
}

function MiniTrend({ values, status }: { values: number[]; status: HealthStatus }) {
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 3;
  return (
    <div className={`mini-trend ${status}`} aria-label={`Seven day score trend from ${values[0]} to ${values.at(-1)}`}>
      {values.map((value, index) => (
        <span key={`${value}-${index}`} style={{ height: `${Math.max(18, ((value - min) / (max - min)) * 100)}%` }} />
      ))}
    </div>
  );
}

function ScoreRing({ score, size = "large" }: { score: number; size?: "large" | "small" }) {
  const color = score >= 90 ? "#24c58b" : score >= 75 ? "#f1ad45" : "#ef6c6c";
  return (
    <div
      className={`score-ring ${size}`}
      style={{ "--score": `${score * 3.6}deg`, "--ring-color": color } as React.CSSProperties}
      aria-label={`Health score ${score} out of 100`}
    >
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const [range, setRange] = useState("Last 7 days");
  const [environment, setEnvironment] = useState("Production");
  const [search, setSearch] = useState("");
  const [selectedMfeId, setSelectedMfeId] = useState("catalog");
  const [selectedPr, setSelectedPr] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedMfe = mfes.find((mfe) => mfe.id === selectedMfeId) ?? mfes[1];
  const filteredMfes = useMemo(
    () => mfes.filter((mfe) => `${mfe.name} ${mfe.owner}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const openApplication = (id: string) => {
    setSelectedMfeId(id);
    setActiveView("Applications");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (view: View) => {
    setActiveView(view);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><i /><i /><i /><i /></span>
          <div><strong>Pulseboard</strong><span>MFE governance</span></div>
        </div>

        <nav aria-label="Primary navigation">
          <p className="nav-label">Control plane</p>
          {navItems.map((item, index) => (
            <button key={item} className={activeView === item ? "active" : ""} type="button" onClick={() => navigate(item)}>
              <span className="nav-glyph" aria-hidden="true">{["◫", "⌘", "⑂", "◆", "◇", "▤"][index]}</span>
              {item}
              {item === "Pull requests" && <span className="nav-count">3</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="collector-status"><span /><div><strong>Collector online</strong><small>Last sync 42s ago</small></div></div>
          <div className="user-card"><span className="avatar">IK</span><div><strong>Irfan Khan</strong><small>Engineering lead</small></div><button aria-label="Open account menu" type="button">•••</button></div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" type="button" onClick={() => setSidebarOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="breadcrumb"><span>Commerce platform</span><b>/</b><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <label className="select-control"><span className={`environment-dot ${environment.toLowerCase()}`} /><select value={environment} onChange={(event) => setEnvironment(event.target.value)} aria-label="Environment"><option>Production</option><option>Staging</option><option>PR previews</option></select></label>
            <label className="select-control"><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Date range"><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select></label>
            <button className="icon-control" type="button" aria-label="Notifications">●<span>2</span></button>
          </div>
        </header>

        <div className="page-wrap">
          {activeView === "Overview" && (
            <>
              <section className="page-heading">
                <div><p className="eyebrow">Engineering health</p><h1>Portfolio overview</h1><p>Release confidence and customer-facing health across every micro frontend.</p></div>
                <button className="primary-button" type="button" onClick={() => navigate("Pull requests")}><span>+</span> Analyze pull request</button>
              </section>

              <section className="summary-grid" aria-label="Portfolio summary">
                <article className="health-summary-card">
                  <ScoreRing score={85} />
                  <div><span className="card-kicker">Overall health</span><h2>Stable, with two risks</h2><p>Checkout and Catalog account for 78% of the active performance regression.</p><button type="button" onClick={() => navigate("Applications")}>Review applications <span>→</span></button></div>
                </article>
                <article className="metric-card"><div className="metric-top"><span className="metric-icon green">⌘</span><span className="delta good">+1 this month</span></div><strong>6</strong><h3>Registered MFEs</h3><p>100% reporting build metadata</p></article>
                <article className="metric-card"><div className="metric-top"><span className="metric-icon red">!</span><span className="delta bad">+2 this week</span></div><strong>2</strong><h3>Critical regressions</h3><p>One currently blocks a merge</p></article>
                <article className="metric-card"><div className="metric-top"><span className="metric-icon amber">◒</span><span className="delta warn">Target 90%</span></div><strong>83%</strong><h3>Budget compliance</h3><p>5 of 6 MFEs within policy</p></article>
              </section>

              <section className="overview-grid">
                <article className="panel health-chart-panel">
                  <div className="panel-heading"><div><span className="card-kicker">Experience score</span><h2>Portfolio health trend</h2></div><div className="legend"><span className="field">Field p75</span><span className="lab">Lab baseline</span></div></div>
                  <div className="chart-area" aria-label="Portfolio health increased from 79 to 85 over seven days">
                    <div className="axis"><span>100</span><span>90</span><span>80</span><span>70</span></div>
                    <div className="chart-plot">
                      {[79, 81, 80, 83, 82, 86, 85].map((value, index) => (
                        <div className="chart-column" key={`${value}-${index}`}><span className="lab-bar" style={{ height: `${value - 58}%` }} /><span className="field-bar" style={{ height: `${value - 64}%` }} /><i>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</i></div>
                      ))}
                    </div>
                  </div>
                  <div className="chart-footer"><div><strong>+6.2%</strong><span>Health improvement</span></div><div><strong>2.14 s</strong><span>Portfolio LCP p75</span></div><div><strong>184 ms</strong><span>Portfolio INP p75</span></div><div><strong>0.07</strong><span>Portfolio CLS p75</span></div></div>
                </article>

                <article className="panel attention-panel">
                  <div className="panel-heading"><div><span className="card-kicker">Prioritized by impact</span><h2>Needs attention</h2></div><button type="button" onClick={() => navigate("Reports")}>View all</button></div>
                  <div className="attention-list">
                    <button type="button" onClick={() => openApplication("checkout")}><span className="severity critical">P0</span><div><strong>Checkout API p95 doubled</strong><p>Payment intent is now 620ms over its SLO.</p><small>Checkout · 42 min ago</small></div><b>→</b></button>
                    <button type="button" onClick={() => openApplication("catalog")}><span className="severity warning">P1</span><div><strong>Catalog exceeded JS budget</strong><p>Predictive search adds 43.8 KB to initial JS.</p><small>Catalog · PR #1842</small></div><b>→</b></button>
                    <button type="button" onClick={() => navigate("Dependencies")}><span className="severity info">P2</span><div><strong>Duplicate Zod versions</strong><p>Two versions add 31 KB across three remotes.</p><small>Platform · Detected today</small></div><b>→</b></button>
                  </div>
                </article>
              </section>

              <section className="panel portfolio-panel">
                <div className="panel-heading portfolio-heading"><div><span className="card-kicker">Live service catalog</span><h2>Micro frontend health</h2></div><div className="table-actions"><label className="search-control"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications" aria-label="Search applications" /></label><button type="button" onClick={() => navigate("Applications")}>All applications</button></div></div>
                <div className="mfe-table" role="table" aria-label="Micro frontend health">
                  <div className="table-row table-header" role="row"><span>Application</span><span>Health</span><span>UI score</span><span>Bundle</span><span>Mount p75</span><span>API p95</span><span>7 day trend</span><span /></div>
                  {filteredMfes.map((mfe) => (
                    <button className="table-row" type="button" role="row" key={mfe.id} onClick={() => openApplication(mfe.id)}>
                      <span className="application-cell"><i>{mfe.name.slice(0, 2).toUpperCase()}</i><span><strong>{mfe.name}</strong><small>{mfe.owner} · {mfe.version}</small></span></span>
                      <span><StatusPill status={mfe.status} compact /></span>
                      <span className="score-cell"><b>{mfe.uiScore}</b><i className="score-track"><em style={{ width: `${mfe.uiScore}%` }} /></i></span>
                      <span><strong>{mfe.bundleKb} KB</strong><small className={mfe.bundleDelta > 10 ? "bad-text" : mfe.bundleDelta < 0 ? "good-text" : ""}>{mfe.bundleDelta > 0 ? "+" : ""}{mfe.bundleDelta}%</small></span>
                      <span><strong>{mfe.mountP75} ms</strong><small>budget 450</small></span>
                      <span><strong>{mfe.apiP95 >= 1000 ? `${(mfe.apiP95 / 1000).toFixed(2)} s` : `${mfe.apiP95} ms`}</strong><small>p95</small></span>
                      <span><MiniTrend values={mfe.trend} status={mfe.status} /></span><span className="row-arrow">→</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="overview-grid lower-grid">
                <article className="panel pr-summary">
                  <div className="panel-heading"><div><span className="card-kicker">Release governance</span><h2>Pull request checks</h2></div><button type="button" onClick={() => navigate("Pull requests")}>Open queue</button></div>
                  {pullRequests.map((pr) => <button className="pr-row" type="button" key={pr.id} onClick={() => { setSelectedPr(pullRequests.indexOf(pr)); navigate("Pull requests"); }}><span className={`check-mark ${pr.status}`}>{pr.status === "healthy" ? "✓" : pr.status === "critical" ? "×" : "!"}</span><div><strong>{pr.id} <span>{pr.title}</span></strong><small>{pr.mfe} · {pr.author} · {pr.updated}</small></div><StatusPill status={pr.status} compact /></button>)}
                </article>
                <article className="panel bundle-panel">
                  <div className="panel-heading"><div><span className="card-kicker">Installed footprint</span><h2>Dependency weight</h2></div><button type="button" onClick={() => navigate("Dependencies")}>Explore</button></div>
                  <div className="package-total"><strong>42.8 MB</strong><span>installed production packages</span><b>1.31 MB parsed JS</b></div>
                  <div className="package-bars"><span style={{ width: "34%" }} className="framework" title="Framework 34%" /><span style={{ width: "27%" }} className="platform" title="Platform 27%" /><span style={{ width: "22%" }} className="ui" title="UI 22%" /><span style={{ width: "17%" }} className="utility" title="Utilities 17%" /></div>
                  <div className="package-legend"><span><i className="framework" />Framework <b>34%</b></span><span><i className="platform" />Federation <b>27%</b></span><span><i className="ui" />UI <b>22%</b></span><span><i className="utility" />Utilities <b>17%</b></span></div>
                  <div className="duplicate-note"><span>!</span><div><strong>2 duplicate dependency groups</strong><p>Potential savings of 49 KB parsed JavaScript.</p></div><button type="button" onClick={() => navigate("Dependencies")}>Review</button></div>
                </article>
              </section>
            </>
          )}

          {activeView === "Applications" && (
            <>
              <section className="page-heading compact-heading"><div><p className="eyebrow">Service catalog</p><h1>Applications</h1><p>Ownership, budgets and runtime quality for every registered remote.</p></div><button className="secondary-button" type="button">+ Register MFE</button></section>
              <section className="application-layout">
                <aside className="application-list panel">
                  <label className="search-control full"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find an MFE" aria-label="Find an MFE" /></label>
                  {filteredMfes.map((mfe) => <button type="button" className={selectedMfe.id === mfe.id ? "selected" : ""} key={mfe.id} onClick={() => setSelectedMfeId(mfe.id)}><span className={`app-monogram ${mfe.status}`}>{mfe.name.slice(0, 2).toUpperCase()}</span><div><strong>{mfe.name}</strong><small>{mfe.owner}</small></div><b>{mfe.score}</b></button>)}
                </aside>
                <section className="application-detail">
                  <article className="detail-hero panel"><div className="detail-title"><span className={`app-monogram large ${selectedMfe.status}`}>{selectedMfe.name.slice(0, 2).toUpperCase()}</span><div><div className="detail-meta"><StatusPill status={selectedMfe.status} compact /><span>{selectedMfe.version}</span><span>{environment}</span></div><h2>{selectedMfe.name}</h2><p>{selectedMfe.description}</p></div></div><ScoreRing score={selectedMfe.score} size="small" /></article>
                  <div className="detail-metrics"><article><span>UI experience</span><strong>{selectedMfe.uiScore}<small>/100</small></strong><p>LCP 2.18s · INP 176ms · CLS 0.06</p></article><article><span>Initial bundle</span><strong>{selectedMfe.bundleKb}<small> KB</small></strong><p className={selectedMfe.bundleDelta > 10 ? "bad-text" : ""}>{selectedMfe.bundleDelta > 0 ? "+" : ""}{selectedMfe.bundleDelta}% vs baseline</p></article><article><span>Mount p75</span><strong>{selectedMfe.mountP75}<small> ms</small></strong><p>Budget: 450 ms</p></article><article><span>API response p95</span><strong>{selectedMfe.apiP95 >= 1000 ? (selectedMfe.apiP95 / 1000).toFixed(2) : selectedMfe.apiP95}<small>{selectedMfe.apiP95 >= 1000 ? " s" : " ms"}</small></strong><p>4 critical endpoints</p></article></div>
                  <article className="panel detail-panel"><div className="panel-heading"><div><span className="card-kicker">Seven day signal</span><h2>Customer experience</h2></div><span className="route-chip">{selectedMfe.route}</span></div><div className="vitals-grid"><div><span>LCP p75</span><strong>2.18 s</strong><i><em style={{ width: "72%" }} /></i><small>Good threshold ≤ 2.5 s</small></div><div><span>INP p75</span><strong>176 ms</strong><i><em style={{ width: "84%" }} /></i><small>Good threshold ≤ 200 ms</small></div><div><span>CLS p75</span><strong>0.06</strong><i><em style={{ width: "88%" }} /></i><small>Good threshold ≤ 0.10</small></div></div></article>
                  <div className="detail-columns"><article className="panel"><div className="panel-heading"><div><span className="card-kicker">Budget breakdown</span><h2>Bundle composition</h2></div><button type="button" onClick={() => navigate("Dependencies")}>Full report</button></div><div className="bundle-stack"><div><span>Application code</span><i><em style={{ width: "78%" }} /></i><strong>118 KB</strong></div><div><span>Shared runtime</span><i><em style={{ width: "61%" }} /></i><strong>74 KB</strong></div><div><span>UI libraries</span><i><em style={{ width: "46%" }} /></i><strong>42 KB</strong></div><div><span>Utilities</span><i><em style={{ width: "24%" }} /></i><strong>23 KB</strong></div></div></article><article className="panel"><div className="panel-heading"><div><span className="card-kicker">Ownership</span><h2>Release context</h2></div></div><dl className="ownership-list"><div><dt>Team</dt><dd><span className="avatar small">{selectedMfe.ownerInitials}</span>{selectedMfe.owner}</dd></div><div><dt>Last deployment</dt><dd>{selectedMfe.deploy}</dd></div><div><dt>Repository</dt><dd>commerce/{selectedMfe.id}-mfe ↗</dd></div><div><dt>Policy tier</dt><dd>Tier 1 · Customer critical</dd></div></dl></article></div>
                </section>
              </section>
            </>
          )}

          {activeView === "Pull requests" && (
            <>
              <section className="page-heading compact-heading"><div><p className="eyebrow">Release governance</p><h1>Pull request analysis</h1><p>Evidence-based release decisions, compared with the target branch baseline.</p></div><button className="primary-button" type="button"><span>+</span> Analyze pull request</button></section>
              <section className="pr-layout">
                <aside className="pr-queue panel"><div className="queue-heading"><strong>Open checks</strong><span>{pullRequests.length}</span></div>{pullRequests.map((pr, index) => <button key={pr.id} className={selectedPr === index ? "selected" : ""} type="button" onClick={() => setSelectedPr(index)}><span className={`check-mark ${pr.status}`}>{pr.status === "healthy" ? "✓" : pr.status === "critical" ? "×" : "!"}</span><div><strong>{pr.id} · {pr.mfe}</strong><p>{pr.title}</p><small>{pr.updated} · {pr.author}</small></div></button>)}</aside>
                <section className="pr-detail">
                  <article className="panel pr-hero"><div><div className="detail-meta"><StatusPill status={pullRequests[selectedPr].status} /><span>{pullRequests[selectedPr].branch}</span></div><h2>{pullRequests[selectedPr].id} {pullRequests[selectedPr].title}</h2><p>{pullRequests[selectedPr].mfe} · opened by {pullRequests[selectedPr].author}</p></div><div className={`decision ${pullRequests[selectedPr].status}`}><small>Governance decision</small><strong>{pullRequests[selectedPr].conclusion}</strong></div></article>
                  <article className="panel comparison-panel"><div className="panel-heading"><div><span className="card-kicker">Base vs head</span><h2>Performance comparison</h2></div><span className="baseline-chip">main → pull request</span></div><div className="comparison-grid"><div className="comparison-header"><span>Metric</span><span>Base</span><span>PR</span><span>Change</span><span>Policy</span></div>{pullRequests[selectedPr].checks.map((check) => <div className="comparison-row" key={check.label}><strong>{check.label}</strong><span>{check.before}</span><span>{check.after}</span><b className={check.state === "good" ? "good-text" : "bad-text"}>{check.delta}</b><span className={`policy-result ${check.state}`}>{check.state === "good" ? "Pass" : "Exceeded"}</span></div>)}</div></article>
                  <div className="detail-columns"><article className="panel findings-panel"><div className="panel-heading"><div><span className="card-kicker">Actionable evidence</span><h2>Findings</h2></div></div><div><span className="severity critical">P0</span><p><strong>Initial JavaScript exceeds the 240 KB budget.</strong> Move predictive-search models behind the first interaction.</p></div><div><span className="severity warning">P1</span><p><strong>Mount time regressed beyond the 15% tolerance.</strong> 91ms is spent parsing the suggestion library.</p></div><div><span className="severity info">P2</span><p><strong>API performance improved.</strong> Search p95 is 27ms faster than the base branch.</p></div></article><article className="panel"><div className="panel-heading"><div><span className="card-kicker">Critical journey</span><h2>Synthetic check</h2></div><StatusPill status="healthy" compact /></div><div className="journey"><span><i>1</i>Shell ready <b>184 ms</b></span><span><i>2</i>Remote loaded <b>302 ms</b></span><span><i>3</i>Catalog rendered <b>436 ms</b></span><span><i>4</i>Search interactive <b>781 ms</b></span></div></article></div>
                </section>
              </section>
            </>
          )}

          {activeView === "Policies" && (
            <>
              <section className="page-heading compact-heading"><div><p className="eyebrow">Guardrails</p><h1>Health policies</h1><p>Shared budgets that turn engineering standards into release decisions.</p></div><button className="secondary-button" type="button">+ Create policy</button></section>
              <section className="policy-grid">{[
                ["Initial JavaScript", "≤ 240 KB", "Block above 280 KB", "5 / 6 compliant", "warning"],
                ["MFE mount p75", "≤ 450 ms", "Block regression > 25%", "5 / 6 compliant", "warning"],
                ["Core Web Vitals", "All metrics good", "Warn on any regression", "6 / 6 compliant", "healthy"],
                ["API reliability", "≥ 99.5% success", "Block below 99%", "5 / 6 compliant", "critical"],
                ["Shared dependencies", "Single runtime version", "Block framework duplicates", "6 / 6 compliant", "healthy"],
                ["Dependency risk", "No critical CVEs", "Block critical findings", "6 / 6 compliant", "healthy"],
              ].map((policy) => <article className="panel policy-card" key={policy[0]}><div><span className={`policy-icon ${policy[4]}`}>◆</span><StatusPill status={policy[4] as HealthStatus} compact /></div><h2>{policy[0]}</h2><p>{policy[1]}</p><dl><div><dt>Enforcement</dt><dd>{policy[2]}</dd></div><div><dt>Coverage</dt><dd>{policy[3]}</dd></div></dl><button type="button">Edit policy →</button></article>)}</section>
            </>
          )}

          {activeView === "Dependencies" && (
            <>
              <section className="page-heading compact-heading"><div><p className="eyebrow">Software footprint</p><h1>Dependencies</h1><p>Installed weight, shipped cost and duplication across the MFE estate.</p></div><button className="secondary-button" type="button">Export SBOM</button></section>
              <section className="dependency-summary"><article className="panel"><span>Installed footprint</span><strong>42.8 MB</strong><p>183 production packages</p></article><article className="panel"><span>Parsed JavaScript</span><strong>1.31 MB</strong><p>Across 6 initial routes</p></article><article className="panel"><span>Duplicate groups</span><strong>2</strong><p>49 KB potential savings</p></article><article className="panel"><span>Critical findings</span><strong>1</strong><p>Zod version policy</p></article></section>
              <section className="panel dependency-panel"><div className="panel-heading"><div><span className="card-kicker">Production inventory</span><h2>Package impact</h2></div><label className="search-control"><span>⌕</span><input placeholder="Search packages" aria-label="Search packages" /></label></div><div className="dependency-table"><div className="dependency-row header"><span>Package</span><span>Used by</span><span>Parsed</span><span>Installed</span><span>Duplication</span><span>Governance</span></div>{dependencyRows.map((row) => <div className="dependency-row" key={row.name}><span><strong>{row.name}</strong><small>{row.version}</small></span><span>{row.usedBy} MFEs</span><span>{row.parsed}</span><span>{row.installed}</span><span>{row.duplicate}</span><span><StatusPill status={(row.risk === "good" ? "healthy" : row.risk) as HealthStatus} compact /></span></div>)}</div></section>
            </>
          )}

          {activeView === "Reports" && (
            <>
              <section className="page-heading compact-heading"><div><p className="eyebrow">Leadership reporting</p><h1>Engineering health report</h1><p>A concise weekly view of risk, ownership and measurable progress.</p></div><button className="secondary-button" type="button">Export weekly report</button></section>
              <section className="report-hero panel"><div><span className="card-kicker">Week of 28 July</span><h2>Customer experience remained stable while release risk increased.</h2><p>Portfolio health improved 6.2% week over week, but two active pull requests exceed critical budgets. Checkout requires intervention before the express payment rollout.</p></div><ScoreRing score={85} size="small" /></section>
              <section className="report-grid"><article className="panel"><span className="report-number good">+6.2%</span><h2>Experience health</h2><p>Five MFEs improved or held steady. Bedrock shared-runtime work reduced duplicate Vue execution.</p></article><article className="panel"><span className="report-number bad">2</span><h2>Release risks</h2><p>Checkout API latency and Catalog bundle growth need owners before merge.</p></article><article className="panel"><span className="report-number">49 KB</span><h2>Efficiency opportunity</h2><p>Aligning Zod and date-fns versions removes two duplicate dependency groups.</p></article></section>
              <section className="panel action-register"><div className="panel-heading"><div><span className="card-kicker">Owner-backed follow-up</span><h2>Action register</h2></div></div><div><span className="severity critical">P0</span><p><strong>Rollback or optimize express payment API calls</strong><small>Checkout Core · Due today</small></p><StatusPill status="critical" compact /></div><div><span className="severity warning">P1</span><p><strong>Split predictive search from the Catalog entry chunk</strong><small>Discovery · Due 6 Aug</small></p><StatusPill status="warning" compact /></div><div><span className="severity info">P2</span><p><strong>Align platform validation dependency versions</strong><small>Platform Experience · Due 9 Aug</small></p><StatusPill status="healthy" compact /></div></section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
