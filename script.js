const { useState, useEffect, useMemo, useRef } = React;

/* ==========================================================================
   MOCK DATA & REPOSITORIES (PRESERVED & ENHANCED)
   ========================================================================== */

const PERSONNEL = [
  { armyNo: "JC-118820P", name: "Rawat, V.", rank: "Hav", unit: "2 GRENADIERS", status: "ON DUTY", rest: 0, role: "Guard Commander" },
  { armyNo: "IC-56231X", name: "Menon, S.", rank: "Lt", unit: "2 GRENADIERS", status: "ON DUTY", rest: 0, role: "Duty Officer" },
  { armyNo: "JC-224871K", name: "Bhatt, A.", rank: "Nb Sub", unit: "HQ COY", rest: 6, status: "REST", role: "Section Leader" },
  { armyNo: "NK-994102", name: "Chauhan, R.", rank: "Sep", unit: "HQ COY", rest: 0, status: "AVAILABLE", role: "Rifleman" },
  { armyNo: "JC-330019L", name: "Yadav, D.", rank: "Nk", unit: "3 PARA", status: "ON DUTY", rest: 0, role: "Specialist" },
  { armyNo: "NK-771145", name: "Singh, P.", rank: "Sep", unit: "3 PARA", status: "LEAVE", rest: 0, role: "Scout" },
  { armyNo: "IC-70234R", name: "Kulkarni, N.", rank: "Capt", unit: "HQ COY", status: "AVAILABLE", rest: 0, role: "Adjutant" },
  { armyNo: "JC-441982", name: "Thapa, B.", rank: "Hav", unit: "2 GRENADIERS", status: "AVAILABLE", rest: 0, role: "Armourer" },
];

const POSTS = [
  { id: "PST-01", name: "Main Gate", priority: "HIGH", manpower: 2, filled: 2, location: "Sector Alpha Perimeter" },
  { id: "PST-02", name: "Armoury", priority: "HIGH", manpower: 2, filled: 1, location: "Secure Depot Complex" },
  { id: "PST-03", name: "Perimeter — North", priority: "MED", manpower: 3, filled: 3, location: "Outer Watchtower Grid" },
  { id: "PST-04", name: "QRT Standby", priority: "HIGH", manpower: 4, filled: 3, location: "Rapid Response Bay" },
  { id: "PST-05", name: "Officers' Mess", priority: "LOW", manpower: 1, filled: 1, location: "Administrative Enclave" },
];

const DUTY_ROSTER = [
  { shift: "0600–1400", post: "Main Gate", personnel: ["JC-118820P Rawat", "NK-994102 Chauhan"], sector: "Sector A" },
  { shift: "0600–1400", post: "Armoury", personnel: ["IC-56231X Menon"], sector: "Depot B" },
  { shift: "1400–2200", post: "Perimeter — North", personnel: ["JC-330019L Yadav", "JC-441982 Thapa", "IC-70234R Kulkarni"], sector: "Perimeter N" },
  { shift: "2200–0600", post: "QRT Standby", personnel: ["JC-118820P Rawat", "JC-330019L Yadav", "JC-441982 Thapa"], sector: "QRT Bay" },
];

const WEAPONS_INITIAL = [
  { serial: "INSAS-4471", type: "INSAS Rifle 5.56mm", status: "ISSUED", holder: "JC-118820P Rawat", qr: "WPN-4471", ammo: "90 Rds" },
  { serial: "INSAS-4472", type: "INSAS Rifle 5.56mm", status: "IN ARMOURY", holder: "—", qr: "WPN-4472", ammo: "In Stock" },
  { serial: "GLOCK-0091", type: "Glock 17 9mm", status: "ISSUED", holder: "IC-56231X Menon", qr: "WPN-0091", ammo: "30 Rds" },
  { serial: "INSAS-4480", type: "INSAS Rifle 5.56mm", status: "ISSUED", holder: "JC-330019L Yadav", qr: "WPN-4480", ammo: "90 Rds" },
  { serial: "LMG-0012", type: "7.62mm LMG", status: "IN ARMOURY", holder: "—", qr: "WPN-0012", ammo: "In Stock" },
  { serial: "INSAS-4491", type: "INSAS Rifle 5.56mm", status: "MAINTENANCE", holder: "—", qr: "WPN-4491", ammo: "Depot Insp" },
];

const ALERTS_INITIAL = [
  { level: "amber", text: "Nb Sub Bhatt, A. rest period ends in 40 min — reassign PST-02 relief", time: "10m ago" },
  { level: "danger", text: "Armoury PST-02 understaffed: 1 of 2 filled — immediate assignment required", time: "24m ago" },
  { level: "steel", text: "6 weapons due for quarterly ordnance & maintenance check", time: "1h ago" },
  { level: "gold", text: "Sector Bravo perimeter communications link verified operational", time: "2h ago" },
];

const AUDIT_LOG = [
  { ts: "29 JUL 06:02", event: "Weapon Issued", detail: "INSAS-4471 → JC-118820P Rawat", by: "Sys/QR" },
  { ts: "29 JUL 05:58", event: "Duty Assigned", detail: "PST-01 Main Gate, 0600–1400", by: "Capt Kulkarni" },
  { ts: "29 JUL 05:40", event: "Leave Approved", detail: "NK-771145 Singh — 3 days", by: "Adjt" },
  { ts: "28 JUL 22:10", event: "Weapon Returned", detail: "GLOCK-0091 ← IC-56231X Menon", by: "Sys/QR" },
  { ts: "28 JUL 18:30", event: "QRT Shift Change", detail: "Night patrol handover completed", by: "Lt Menon" },
];

const COMMANDS_DATA = [
  { name: "Northern Command", hq: "Udhampur, J&K", motto: "Always in Front", desc: "Guards the northern frontiers, Siachen Glacier, and LOC with supreme readiness in high altitude terrain." },
  { name: "Western Command", hq: "Chandimandir, Haryana", motto: "Ever Victorious", desc: "Defends the northern plains and western sectors, maintaining rapid armoured and mechanised strike capability." },
  { name: "Eastern Command", hq: "Fort William, Kolkata", motto: "Courage and Valour", desc: "Protects eastern borders, dense jungle corridors, and high-altitude Himalayan mountain passes." },
  { name: "Southern Command", hq: "Pune, Maharashtra", motto: "Valour and Wisdom", desc: "Spans island territories, desert sectors, and southern peninsula defence with combined-arms agility." },
  { name: "Central Command", hq: "Lucknow, Uttar Pradesh", motto: "Devotion to Duty", desc: "Oversees key strategic axes, logistical hubs, and operational reserves across central India." },
  { name: "South Western Command", hq: "Jaipur, Rajasthan", motto: "Forever Victorious", desc: "Command specialized in desert warfare, mechanized strike formations, and rapid response deployment." },
  { name: "ARTRAC", hq: "Shimla, Himachal Pradesh", motto: "Training for War", desc: "Army Training Command formulating military doctrine, advanced tactical concepts, and officer leadership." },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Mountain Warfare & High Altitude",
    tag: "Northern Theatre // Siachen Axis",
    desc: "Indian Army troops conducting high-altitude reconnaissance across Himalayan ridges in sub-zero snow terrain.",
    img: "assets/images/mountain.png",
    specs: "Specialized cold-weather survival gear, mountaineering warfare kit, tactical SATCOM link."
  },
  {
    id: 2,
    title: "Armoured Strike Columns",
    tag: "Western & South-Western Theatre",
    desc: "Main Battle Tanks maneuvering in battle formation across arid terrain during tactical readiness exercises.",
    img: "assets/images/armour.png",
    specs: "Thermal imaging fire control, dynamic reactive armour, indigenous weapon integration."
  },
  {
    id: 3,
    title: "Special Forces (PARA SF)",
    tag: "Special Operations Wing",
    desc: "Elite Para Commandos conducting airborne tactical insertion and counter-terrorism precision drills.",
    img: "assets/images/airborne.png",
    specs: "High-altitude freefall insertion, night-vision combat suites, suppressed assault weapons."
  },
  {
    id: 4,
    title: "C4ISR & Tactical Operations Centre",
    tag: "Integrated Command Network",
    desc: "Commanders and operations officers monitoring real-time telemetry, satellite feeds, and drone reconnaissance.",
    img: "assets/images/c4isr.png",
    specs: "Secure 256-bit encrypted mesh, multi-domain battlefield management, live asset tracking."
  },
];

const NOTICES = [
  { date: "15 AUG", title: "79th Independence Day Gallantry Citations Gazetted", desc: "Honours and awards conferred for supreme devotion to duty and exceptional bravery in operational areas." },
  { date: "02 AUG", title: "Agniveer Recruitment Rally Notification (Cycle 2026-27)", desc: "Direct recruitment portal opened for technical, general duty, and tradesmen categories across all zonal recruiting offices." },
  { date: "28 JUL", title: "Modernization Directive: Indigenous Drone Integration", desc: "Induction of advanced surveillance UAVs and tactical counter-drone systems into infantry battalions." },
  { date: "19 JUL", title: "Armed Forces Medical & ECHS Digital Portal Upgrade", desc: "Enhanced digital healthcare cards and telemedicine services enabled for veterans and active serving personnel." },
];

/* ==========================================================================
   SVG VECTOR ICONS & EMBLEMS
   ========================================================================== */

function ArmyEmblemSvg() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#c5a059" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.75" />
      <circle cx="50" cy="50" r="41" stroke="#c5a059" strokeWidth="1.5" />
      
      {/* Crossed Swords */}
      <path d="M28 72 L72 28 M30 74 L24 80 M70 26 L76 20" stroke="#f0f4f1" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 72 L28 28 M70 74 L76 80 M30 26 L24 20" stroke="#f0f4f1" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="7" fill="#294430" stroke="#c5a059" strokeWidth="2" />
      
      {/* Ashoka Lion Motif Pillar Top */}
      <path d="M46 36 L54 36 L53 45 L47 45 Z" fill="#c5a059" />
      <rect x="44" y="32" width="12" height="4" rx="1" fill="#dfba74" />
      
      {/* Golden Star & Laurel */}
      <path d="M50 20 L52 24 L56 25 L53 28 L54 32 L50 30 L46 32 L47 28 L44 25 L48 24 Z" fill="#c5a059" />
      <path d="M35 62 C40 68, 60 68, 65 62" stroke="#c5a059" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconRadar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path d="M12 3v9l6 6" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconQr() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

/* ==========================================================================
   HELPER UI COMPONENTS
   ========================================================================== */

function StatusChip({ status }) {
  const map = {
    "ON DUTY": "chip-duty",
    "AVAILABLE": "chip-available",
    "REST": "chip-rest",
    "LEAVE": "chip-leave",
    "ISSUED": "chip-duty",
    "IN ARMOURY": "chip-available",
    "MAINTENANCE": "chip-danger",
  };
  const cls = map[status] || "chip-leave";
  return <span className={`chip ${cls}`}>{status}</span>;
}

function PriorityTag({ p }) {
  const c = p === "HIGH" ? "var(--danger)" : p === "MED" ? "var(--amber)" : "var(--ink-muted)";
  return (
    <span className="mono" style={{ color: c, fontSize: 11, fontWeight: 700, letterSpacing: '.06em' }}>
      {p} PRIORITY
    </span>
  );
}

function Panel({ title, eyebrow, children, right, className = "" }) {
  return (
    <div className={`card ${className}`}>
      <div className="panel-header" style={{ margin: '-22px -22px 18px -22px' }}>
        <div>
          {eyebrow && <div className="mono text-gold" style={{ fontSize: 10, letterSpacing: '.12em', marginBottom: 2 }}>{eyebrow.toUpperCase()}</div>}
          <div className="disp" style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-bright)' }}>{title}</div>
        </div>
        {right}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ==========================================================================
   TOPBAR COMPONENT (LIVE CLOCK & DEFCON READINESS)
   ========================================================================== */

function TopBar() {
  const [timeStr, setTimeStr] = useState("");
  const [zuluMode, setZuluMode] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      if (zuluMode) {
        setTimeStr(d.toUTCString().replace("GMT", "ZULU (UTC)"));
      } else {
        setTimeStr(d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false }) + " IST · " + d.toDateString().toUpperCase());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [zuluMode]);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-badge">
          <span className="radar-ping"></span> INTEGRATED DEFENCE HEADQUARTERS
        </span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span>GOVERNMENT OF INDIA</span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span className="text-gold">READINESS: DEFCON 4 NORMAL READY</span>
      </div>
      <div className="topbar-right">
        <span 
          onClick={() => setZuluMode(!zuluMode)} 
          title="Click to toggle IST / ZULU (UTC)"
          style={{ cursor: 'pointer', color: 'var(--ink-dim)' }}
        >
          ⏱ {timeStr}
        </span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span>SECURE NODE: DEL-09-TACTICAL</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   HEADER / NAVBAR COMPONENT
   ========================================================================== */

function Navbar({ activeSection, onNavigate, onTogglePortal, portalMode, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About & Pillars' },
    { id: 'commands', label: 'Commands' },
    { id: 'ddms', label: 'DDMS Command' },
    { id: 'gallery', label: 'Fleet & Ops' },
    { id: 'notices', label: 'Gazette' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="site-header">
      <TopBar />
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Brand Area */}
        <div className="brand-area" onClick={() => handleNavClick('hero')}>
          <div className="brand-logo-wrap">
            <ArmyEmblemSvg />
          </div>
          <div className="brand-titles">
            <span className="brand-name">INDIAN ARMY</span>
            <span className="brand-motto">SERVICE BEFORE SELF // सेवा परमो धर्म:</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <button 
            className="portal-switch-btn"
            onClick={onTogglePortal}
            title="Toggle between Public Defence Overview & Interactive DDMS Command Suite"
          >
            <IconShield />
            <span>{portalMode === 'ddms' ? 'PUBLIC PORTAL' : 'DDMS COMMAND'}</span>
          </button>

          <button 
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title="Switch theme"
          >
            {theme === 'dark' ? '☾ DARK' : '☀ LIGHT'}
          </button>

          <button 
            className="hamburger-btn" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="mobile-nav-content" onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34 }}><ArmyEmblemSvg /></div>
              <span className="disp" style={{ fontWeight: 800, fontSize: 16 }}>INDIAN ARMY</span>
            </div>
            <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ink-dim)', fontSize: 22, cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 14px', fontSize: '1rem' }}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => { setMobileOpen(false); onTogglePortal(); }}>
              {portalMode === 'ddms' ? 'VIEW PUBLIC DEFENCE PORTAL' : 'OPEN DDMS COMMAND DESK'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */

function HeroSection({ onExplore, onOpenDDMS }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-bg-media">
        <img src="assets/images/hero.png" alt="Indian Army Tactical Vanguard" />
      </div>
      <div className="hero-backdrop-gradient"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badges-row">
            <span className="chip chip-gold">
              <span className="radar-ping"></span> DEFENCE COMMAND PORTAL
            </span>
            <span className="chip" style={{ background: 'rgba(41,68,48,0.5)', color: 'var(--ink-bright)', borderColor: 'var(--line-light)' }}>
              ESTD. 1895 // SIKH, GORKHA, PARA, GRENADIERS, ARMOURED
            </span>
          </div>

          <div className="hero-title heading-hero">
            <span>SERVICE BEFORE</span>
            <span className="title-accent">SELF</span>
          </div>

          <div className="hero-sanskrit">
            सेवा परमो धर्म: // SEVA PARAMO DHARMA
          </div>

          <p className="hero-description">
            Guarding the sovereignty of the nation across high-altitude glaciers, desert frontiers, dense riverines, and aerospace. Committed to iron discipline, supreme valor, and state-of-the-art technological vigilance.
          </p>

          <div className="hero-actions">
            <button className="btn btn-gold btn-lg" onClick={onExplore}>
              EXPLORE CAPABILITIES ➔
            </button>
            <button className="btn btn-secondary btn-lg" onClick={onOpenDDMS}>
              <IconShield /> ACCESS DDMS COMMAND
            </button>
          </div>
        </div>

        {/* Telemetry Live HUD */}
        <div className="hero-telemetry-card hud-corner scanline">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
            <span className="eyebrow">COMMAND TELEMETRY</span>
            <span className="chip chip-duty">LIVE SYSTEM</span>
          </div>

          <div className="telemetry-grid">
            <div className="telemetry-item">
              <div className="telemetry-label">THEATRE COMMANDS</div>
              <div className="telemetry-val">7</div>
              <div className="telemetry-sub">Northern to Southern</div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">READINESS STATUS</div>
              <div className="telemetry-val" style={{ color: 'var(--success)' }}>100%</div>
              <div className="telemetry-sub">All Formations Active</div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">DUTY POST MANNING</div>
              <div className="telemetry-val">10 / 12</div>
              <div className="telemetry-sub">Maintained via DDMS</div>
            </div>

            <div className="telemetry-item">
              <div className="telemetry-label">ENCRYPTION PROTOCOL</div>
              <div className="telemetry-val" style={{ fontSize: '1.25rem', color: 'var(--steel)' }}>256-BIT SHA</div>
              <div className="telemetry-sub">Restricted Defence Node</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   STRATEGIC PILLARS COMPONENT
   ========================================================================== */

function StrategicPillars() {
  const pillars = [
    {
      icon: <IconShield />,
      title: "MISSION & SECURITY",
      desc: "Safeguarding territorial integrity across 15,000+ km of land borders. Deterring aggression through proactive forward posture, mountain warfare excellence, and rapid joint-force strike capabilities."
    },
    {
      icon: <IconUsers />,
      title: "DISCIPLINE & HERITAGE",
      desc: "Forged in over a century of unparalleled valor, sacrifice, and supreme devotion. Upholding the highest standards of military ethics, rigorous conditioning, and selfless duty to the motherland."
    },
    {
      icon: <IconCpu />,
      title: "TECHNOLOGY & MODERNIZATION",
      desc: "Integrating state-of-the-art C4ISR systems, indigenous drone surveillance networks, AI-assisted telemetry, automated QR logistics, and digital duty roster algorithms."
    },
    {
      icon: <IconRadar />,
      title: "NATION BUILDING & SERVICE",
      desc: "Providing round-the-clock humanitarian assistance, disaster relief (HADR), infrastructure in remote border frontiers, and leading global peacekeeping deployments under the UN mandate."
    },
  ];

  return (
    <section id="about" className="section">
      <div className="section-container">
        <div className="section-header section-header-center">
          <span className="eyebrow">CORE FOUNDATIONS</span>
          <h2 className="heading-section">STRATEGIC PILLARS OF DEFENCE</h2>
          <p className="section-subtitle">
            The values, doctrine, and technological framework empowering the Indian Army across every operational frontier.
          </p>
        </div>

        <div className="pillars-grid">
          {pillars.map((p, idx) => (
            <div key={idx} className="pillar-card hud-corner">
              <div className="pillar-icon-box">{p.icon}</div>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   COMMANDS & STATS COMPONENT
   ========================================================================== */

function CommandsSection() {
  const stats = [
    { num: "7", title: "Theatre Commands", sub: "Operational Strategic Wings" },
    { num: "125+", title: "Years of Heritage", sub: "Valour, Glory & Sacrifice" },
    { num: "1.2M+", title: "Active Personnel", sub: "Standing Ready 24/7" },
    { num: "100%", title: "Border Vigilance", sub: "Siachen to Thar Desert" },
  ];

  return (
    <section id="commands" style={{ position: 'relative', zIndex: 1 }}>
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-bar-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{s.num}</div>
              <div className="stat-title">{s.title}</div>
              <div className="stat-subtitle">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commands Grid */}
      <div className="section">
        <div className="section-container">
          <div className="section-header">
            <span className="eyebrow">OPERATIONAL STRUCTURE</span>
            <h2 className="heading-section">ARMY COMMAND FORMATIONS</h2>
            <p className="section-subtitle">
              The Indian Army is organized into seven specialized tactical and operational commands covering the vast geographical expanse of the nation.
            </p>
          </div>

          <div className="commands-grid">
            {COMMANDS_DATA.map((c, i) => (
              <div key={i} className="command-card hud-corner">
                <div>
                  <div className="command-card-header">
                    <div>
                      <h3 className="command-name">{c.name}</h3>
                      <div className="command-hq">HQ: {c.hq}</div>
                    </div>
                    <span className="chip chip-gold">Active Command</span>
                  </div>
                  <p className="command-desc">{c.desc}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>MOTTO: "{c.motto.toUpperCase()}"</span>
                  <span className="mono text-dim" style={{ fontSize: 10 }}>CMD-0{i+1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   DDMS (DEFENCE DUTY MANAGEMENT SYSTEM) INTERACTIVE SUITE
   ========================================================================== */

function QRScanModal({ onClose, onScan }) {
  const [step, setStep] = useState("scanning"); // scanning -> found -> confirmed

  useEffect(() => {
    const t = setTimeout(() => {
      setStep("found");
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const handleConfirm = () => {
    setStep("confirmed");
    setTimeout(() => {
      onScan();
      onClose();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog hud-corner" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconQr />
            <span className="disp" style={{ fontSize: 15, fontWeight: 700 }}>TACTICAL QR WEAPON SCANNER</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ink-dim)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <div className="scanline" style={{ height: 220, margin: 20, border: '2px dashed var(--gold-dark)', borderRadius: 'var(--radius-xs)', background: '#040805', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {step === "scanning" && (
            <div style={{ textAlign: 'center' }}>
              <div className="radar-ping" style={{ width: 14, height: 14, margin: '0 auto 12px' }}></div>
              <div className="mono text-gold" style={{ fontSize: 12, letterSpacing: '.1em' }}>ALIGNING OPTICAL SCANNER…</div>
              <div className="mono text-dim" style={{ fontSize: 11, marginTop: 4 }}>Reading Weapon QR Encrypted Tag</div>
            </div>
          )}

          {step === "found" && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <span className="chip chip-duty" style={{ marginBottom: 8 }}>QR MATCH ACQUIRED</span>
              <div className="disp" style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-bright)' }}>INSAS-4472</div>
              <div className="mono text-gold" style={{ fontSize: 12, marginTop: 2 }}>5.56mm Standard Infantry Rifle</div>
              <div className="mono text-dim" style={{ fontSize: 11, marginTop: 6 }}>TAG: WPN-4472 · DEPOT ARMOURY PST-02</div>
            </div>
          )}

          {step === "confirmed" && (
            <div style={{ textAlign: 'center' }}>
              <span className="chip chip-gold" style={{ fontSize: 13, padding: '6px 14px' }}>✓ TRANSACTION COMMITTED</span>
              <div className="mono text-dim" style={{ fontSize: 11, marginTop: 8 }}>Armoury Registry Updated & Cryptographically Logged</div>
            </div>
          )}
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          {step === "found" && (
            <button onClick={handleConfirm} className="btn btn-gold" style={{ width: '100%' }}>
              CONFIRM WEAPON CHECK-IN (INSAS-4472)
            </button>
          )}
          {step === "scanning" && (
            <div className="mono text-dim" style={{ textAlign: 'center', fontSize: 11 }}>Hold weapon tag within optical frame</div>
          )}
        </div>
      </div>
    </div>
  );
}

function DDMSLogin({ onLogin }) {
  const [id, setId] = useState("JC-118820P");
  const [pw, setPw] = useState("••••••••");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!id.trim() || !pw.trim()) {
      setErr("Please enter a valid Army / Service ID.");
      return;
    }
    onLogin(id.trim());
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 480, padding: 20 }}>
      <div className="card hud-corner fade-in" style={{ width: '100%', maxWidth: 440, padding: 0, overflow: 'hidden' }}>
        <div className="scanline" style={{ padding: '26px 28px', background: 'var(--bg-panel-2)', borderBottom: '1px solid var(--line)' }}>
          <div className="eyebrow">DDMS SECURE AUTHENTICATION</div>
          <div className="disp" style={{ fontSize: 24, fontWeight: 800, marginTop: 6, color: 'var(--ink-bright)' }}>
            DEFENCE DUTY MANAGEMENT
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 4 }}>
            Direct Roster & Armoury Tactical Interface
          </div>
        </div>

        <form onSubmit={submit} style={{ padding: '28px' }}>
          <div style={{ marginBottom: 16 }}>
            <label className="mono" style={{ fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>
              ARMY / SERVICE NUMBER
            </label>
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="JC-118820P"
              className="mono"
              style={{
                width: '100%', padding: '12px 14px', background: 'var(--bg-base)',
                border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="mono" style={{ fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>
              SECURITY CREDENTIAL / PIN
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="••••••••"
              className="mono"
              style={{
                width: '100%', padding: '12px 14px', background: 'var(--bg-base)',
                border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)'
              }}
            />
          </div>

          {err && <div className="mono" style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 12 }}>{err}</div>}

          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: 13, fontSize: '0.95rem' }}>
            AUTHENTICATE & ENTER DDMS ➔
          </button>

          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 16, textAlign: 'center' }}>
            Restricted Defence Node · Any credentials grant demo access
          </div>
        </form>
      </div>
    </div>
  );
}

function DDMSDashboardView({ user, personnel, posts, alerts, weapons }) {
  const onDuty = personnel.filter(p => p.status === "ON DUTY").length;
  const available = personnel.filter(p => p.status === "AVAILABLE").length;
  const issued = weapons.filter(w => w.status === "ISSUED").length;
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridColor = isLight ? '#d1cab7' : '#223727';
    const textColor = isLight ? '#546559' : '#97aba0';

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: posts.map(p => p.name),
        datasets: [
          {
            label: 'Required Manpower',
            data: posts.map(p => p.manpower),
            backgroundColor: 'transparent',
            borderColor: isLight ? '#8f7236' : '#c5a059',
            borderWidth: 2,
            borderRadius: 2,
          },
          {
            label: 'Filled Posts',
            data: posts.map(p => p.filled),
            backgroundColor: isLight ? '#3d5a44' : '#3f684a',
            borderColor: '#4d825c',
            borderWidth: 1,
            borderRadius: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { family: 'IBM Plex Mono', size: 11, weight: '600' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { family: 'IBM Plex Mono', size: 11 } },
            grid: { color: gridColor }
          },
          y: {
            ticks: { color: textColor, font: { family: 'IBM Plex Mono', size: 11 }, stepSize: 1 },
            grid: { color: gridColor },
            beginAtZero: true
          }
        }
      }
    });

    return () => chart.destroy();
  }, [posts]);

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        {[
          { label: 'On Duty Now', val: onDuty, sub: `of ${personnel.length} soldiers assigned`, color: 'var(--gold-light)' },
          { label: 'Standby / Available', val: available, sub: 'Immediate tasking reserve', color: 'var(--steel)' },
          { label: 'Weapons Issued', val: issued, sub: `of ${weapons.length} registered weapons`, color: 'var(--army-green-bright)' },
          { label: 'Active Alerts', val: alerts.length, sub: 'Requires guard officer review', color: 'var(--amber)' },
        ].map((s, i) => (
          <div key={i} className="card hud-corner">
            <div className="mono text-dim" style={{ fontSize: 10.5, letterSpacing: '.1em' }}>{s.label.toUpperCase()}</div>
            <div className="disp" style={{ fontSize: 36, fontWeight: 800, margin: '6px 0 2px', color: s.color }}>{s.val}</div>
            <div className="mono text-dim" style={{ fontSize: 11 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <Panel title="Post Manning Real-Time Ratio" eyebrow="Manning Statistics">
          <div style={{ height: 240 }}><canvas ref={chartRef}></canvas></div>
        </Panel>

        <Panel title="Live Command & Shift Alerts" eyebrow="Operational Feed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 10, borderBottom: i < alerts.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', marginTop: 5, background: `var(--${a.level === 'amber' ? 'amber' : a.level === 'danger' ? 'danger' : 'steel'})`, flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink-bright)' }}>{a.text}</div>
                  <div className="mono text-dim" style={{ fontSize: 10.5, marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Today's Shift Board */}
      <Panel title="Today's Shift Allocation Board" eyebrow={`Shift cycle · ${new Date().toDateString()}`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>SHIFT WINDOW</th>
                <th>POST / SECTOR</th>
                <th>ASSIGNED PERSONNEL</th>
                <th>LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {DUTY_ROSTER.map((r, i) => (
                <tr key={i} className="board-row">
                  <td className="mono text-gold" style={{ fontWeight: 600 }}>{r.shift}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink-bright)' }}>{r.post}</td>
                  <td className="mono" style={{ color: 'var(--ink-dim)' }}>{r.personnel.join(' · ')}</td>
                  <td className="mono text-dim" style={{ fontSize: 12 }}>{r.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function DDMSRosterView({ personnel, posts }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const units = ["ALL", ...new Set(personnel.map(p => p.unit))];

  const filtered = personnel.filter(p => {
    const matchesUnit = filter === "ALL" || p.unit === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.armyNo.toLowerCase().includes(search.toLowerCase());
    return matchesUnit && matchesSearch;
  });

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      <Panel 
        title="Personnel Duty Master Roster" 
        eyebrow="Roster Registry"
        right={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Name or Army No…"
              className="mono"
              style={{ padding: '6px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 12px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        }
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>ARMY NO.</th>
                <th>NAME</th>
                <th>RANK</th>
                <th>UNIT</th>
                <th>ROLE</th>
                <th>DUTY STATUS</th>
                <th>REST (HRS)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="board-row">
                  <td className="mono text-gold" style={{ fontWeight: 600 }}>{p.armyNo}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink-bright)' }}>{p.name}</td>
                  <td className="mono text-dim">{p.rank}</td>
                  <td className="mono">{p.unit}</td>
                  <td className="mono text-dim" style={{ fontSize: 12 }}>{p.role}</td>
                  <td><StatusChip status={p.status} /></td>
                  <td className="mono">{p.rest > 0 ? `${p.rest}h rest` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Post Manning Requirements */}
      <Panel title="Post Manning Status & Readiness" eyebrow="Station Requirements">
        <div style={{ display: 'grid', gap: 12 }}>
          {posts.map((p, i) => (
            <div key={i} className="board-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 8px' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span className="mono text-gold" style={{ fontWeight: 700 }}>{p.id}</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink-bright)' }}>{p.name}</div>
                  <div className="mono text-dim" style={{ fontSize: 11 }}>{p.location}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <PriorityTag p={p.priority} />
                <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: p.filled < p.manpower ? 'var(--danger)' : 'var(--success)' }}>
                  {p.filled} / {p.manpower} Filled
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DDMSWeaponsView({ weapons, onScanReturn }) {
  const [showScan, setShowScan] = useState(false);

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      <Panel 
        title="Weapons & Armaments Registry" 
        eyebrow="Ordnance Tracking"
        right={
          <button 
            onClick={() => setShowScan(true)} 
            className="btn btn-gold btn-sm"
          >
            <IconQr /> SCAN WEAPON QR
          </button>
        }
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>SERIAL NO.</th>
                <th>WEAPON TYPE</th>
                <th>STATUS</th>
                <th>CURRENT HOLDER</th>
                <th>AMMUNITION</th>
                <th>QR CODE TAG</th>
              </tr>
            </thead>
            <tbody>
              {weapons.map((w, i) => (
                <tr key={i} className="board-row">
                  <td className="mono text-gold" style={{ fontWeight: 600 }}>{w.serial}</td>
                  <td style={{ fontWeight: 600, color: 'var(--ink-bright)' }}>{w.type}</td>
                  <td><StatusChip status={w.status} /></td>
                  <td style={{ color: 'var(--ink-dim)' }}>{w.holder}</td>
                  <td className="mono text-dim" style={{ fontSize: 12 }}>{w.ammo}</td>
                  <td className="mono text-gold" style={{ fontSize: 11 }}>{w.qr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {showScan && <QRScanModal onClose={() => setShowScan(false)} onScan={onScanReturn} />}
    </div>
  );
}

function DDMSPersonnelView({ personnel }) {
  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      <Panel title="Servicemen Roster & Rest Matrix" eyebrow="Unit Personnel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {personnel.map((p, i) => (
            <div key={i} className="card hud-corner" style={{ background: 'var(--bg-panel-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-bright)' }}>{p.name}</div>
                  <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>{p.rank} · {p.armyNo}</div>
                </div>
                <StatusChip status={p.status} />
              </div>

              <div className="stenciled"></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <span className="mono text-dim">UNIT:</span>
                <span className="mono text-gold" style={{ fontWeight: 600 }}>{p.unit}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                <span className="mono text-dim">ROLE:</span>
                <span style={{ color: 'var(--ink-bright)' }}>{p.role}</span>
              </div>

              {p.rest > 0 && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--amber)', marginTop: 10, background: 'rgba(203,139,48,0.12)', padding: '4px 8px', borderRadius: 'var(--radius-xs)' }}>
                  ⏳ Rest cycle ends in {p.rest}h
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DDMSReportsView() {
  const [generating, setGenerating] = useState(null);
  const reports = [
    { id: 'duty', name: 'Master Duty Allocation Report (PDF)', desc: 'Official roster with shift rosters, sector duties, and officer sign-offs.' },
    { id: 'weapon', name: 'Armoury & Munitions Ledger (PDF)', desc: 'Complete issue and return transaction audit with QR security hashes.' },
    { id: 'attendance', name: 'Personnel Attendance & Muster Roll (PDF)', desc: 'Muster roll summary covering active duty, leave authorizations, and rest cycles.' },
  ];

  const handleDownload = (id) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      alert(`Report generated successfully! (Simulated PDF download for ${id.toUpperCase()} report)`);
    }, 1400);
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      <Panel title="Command PDF Document Generator" eyebrow="Official Records">
        <div style={{ display: 'grid', gap: 14 }}>
          {reports.map(r => (
            <div key={r.id} className="board-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-bright)' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 3 }}>{r.desc}</div>
              </div>
              <button 
                onClick={() => handleDownload(r.id)} 
                className="btn btn-secondary btn-sm"
                disabled={generating === r.id}
                style={{ minWidth: 140 }}
              >
                {generating === r.id ? 'GENERATING…' : '⬇ DOWNLOAD PDF'}
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Cryptographic Shift Audit Log" eyebrow="Immutable Ledger">
        <div style={{ display: 'grid', gap: 0 }}>
          {AUDIT_LOG.map((a, i) => (
            <div key={i} className="board-row" style={{ display: 'grid', gridTemplateColumns: '120px 150px 1fr 120px', gap: 14, padding: '12px 8px', alignItems: 'center' }}>
              <span className="mono text-dim" style={{ fontSize: 11 }}>{a.ts}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-light)' }}>{a.event}</span>
              <span style={{ fontSize: 13, color: 'var(--ink)' }}>{a.detail}</span>
              <span className="mono text-dim" style={{ fontSize: 11, textAlign: 'right' }}>{a.by}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DDMSCommandSuite({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [personnel, setPersonnel] = useState(PERSONNEL);
  const [weapons, setWeapons] = useState(WEAPONS_INITIAL);
  const [alerts, setAlerts] = useState(ALERTS_INITIAL);

  const handleScanReturn = () => {
    setWeapons(prev => prev.map(w => w.serial === "INSAS-4472" ? { ...w, status: "IN ARMOURY", holder: "—" } : w));
    setAlerts(prev => [{ level: "gold", text: "INSAS-4472 confirmed returned to Armoury via QR Scan", time: "Just now" }, ...prev]);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Command Board' },
    { id: 'roster', label: 'Duty Roster' },
    { id: 'weapons', label: 'Weapons Registry' },
    { id: 'personnel', label: 'Personnel' },
    { id: 'reports', label: 'Reports & Logs' },
  ];

  return (
    <div className="ddms-wrapper hud-corner fade-in">
      {/* Top Status Strip */}
      <div className="ddms-top-status-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="text-gold" style={{ fontWeight: 700 }}>DDMS COMMAND DESK</span>
          <span style={{ color: 'var(--line-strong)' }}>|</span>
          <span style={{ color: 'var(--ink-dim)' }}>AUTHENTICATED OPERATOR: {user}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="chip chip-duty">NODE ACTIVE</span>
          <span className="chip chip-danger">{alerts.length} ALERTS</span>
        </div>
      </div>

      <div className="ddms-body-layout">
        {/* Sidebar */}
        <div className="ddms-sidebar">
          <div className="ddms-sidebar-header">
            <div className="mono text-gold" style={{ fontSize: 10, letterSpacing: '.12em' }}>DUTY OPERATIONS</div>
            <div className="disp" style={{ fontSize: 17, fontWeight: 800, marginTop: 2, color: 'var(--ink-bright)' }}>COMMAND CONSOLE</div>
          </div>

          <nav className="ddms-sidebar-nav">
            {navTabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`ddms-nav-btn ${tab === t.id ? 'active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: 18, borderTop: '1px solid var(--line)' }}>
            <div className="mono text-dim" style={{ fontSize: 11, marginBottom: 8 }}>{user} · 2 GRENADIERS</div>
            <button 
              onClick={onLogout}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', border: '1px solid var(--line)' }}
            >
              SIGN OUT (LOCK CONSOLE)
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="ddms-content-area">
          <div className="ddms-subnav-bar">
            <div>
              <div className="mono text-dim" style={{ fontSize: 10.5, letterSpacing: '.08em' }}>{new Date().toDateString().toUpperCase()}</div>
              <div className="disp" style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-bright)' }}>
                {navTabs.find(t => t.id === tab)?.label}
              </div>
            </div>
            <span className="chip chip-gold">SECURE LEVEL 3</span>
          </div>

          <div className="ddms-view-content">
            {tab === 'dashboard' && <DDMSDashboardView user={user} personnel={personnel} posts={POSTS} alerts={alerts} weapons={weapons} />}
            {tab === 'roster' && <DDMSRosterView personnel={personnel} posts={POSTS} />}
            {tab === 'weapons' && <DDMSWeaponsView weapons={weapons} onScanReturn={handleScanReturn} />}
            {tab === 'personnel' && <DDMSPersonnelView personnel={personnel} />}
            {tab === 'reports' && <DDMSReportsView />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   GALLERY & MISSIONS COMPONENT
   ========================================================================== */

function GallerySection({ onSelectImage }) {
  return (
    <section id="gallery" className="section">
      <div className="section-container">
        <div className="section-header">
          <span className="eyebrow">DEFENCE FLEET & WARFARE WINGS</span>
          <h2 className="heading-section">COMBAT READINESS & CAPABILITIES</h2>
          <p className="section-subtitle">
            A visual overview of Indian Army operational capabilities across high-altitude warfare, armoured strike columns, special operations, and digital C4ISR command.
          </p>
        </div>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map(item => (
            <div 
              key={item.id} 
              className="gallery-card hud-corner"
              onClick={() => onSelectImage(item)}
            >
              <img src={item.img} alt={item.title} />
              <div className="gallery-overlay">
                <span className="gallery-tag">{item.tag}</span>
                <h3 className="gallery-title">{item.title}</h3>
                <p className="gallery-desc">{item.desc}</p>
                <span className="mono text-gold" style={{ fontSize: 11, marginTop: 8, fontWeight: 600 }}>
                  CLICK TO VIEW SPECIFICATIONS ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog hud-corner" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div style={{ position: 'relative', height: 320, background: '#000' }}>
          <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button 
            onClick={onClose} 
            style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, background: 'rgba(0,0,0,0.7)', border: '1px solid var(--line)', color: '#fff', borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 24 }}>
          <span className="chip chip-gold" style={{ marginBottom: 8 }}>{item.tag}</span>
          <h3 className="disp" style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink-bright)', marginTop: 4 }}>{item.title}</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-dim)', marginTop: 8, lineHeight: 1.6 }}>{item.desc}</p>
          <div className="stenciled" style={{ margin: '16px 0' }}></div>
          <div>
            <div className="mono text-gold" style={{ fontSize: 11, letterSpacing: '.08em', marginBottom: 4 }}>OPERATIONAL SPECIFICATIONS</div>
            <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink)' }}>{item.specs}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   NOTICES & DIRECTIVES (GAZETTE)
   ========================================================================== */

function NoticesSection() {
  return (
    <section id="notices" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="section-container">
        <div className="section-header">
          <span className="eyebrow">OFFICIAL COMMUNICATIONS</span>
          <h2 className="heading-section">GAZETTE & DIRECTIVES</h2>
          <p className="section-subtitle">
            Official announcements, Agniveer recruitment notifications, gallantry citations, and defence advisories.
          </p>
        </div>

        <div className="notices-grid">
          <div className="card hud-corner">
            <div className="eyebrow" style={{ marginBottom: 14 }}>HEADQUARTERS BULLETINS</div>
            <div>
              {NOTICES.map((n, i) => (
                <div key={i} className="notice-item">
                  <div className="notice-date">{n.date}</div>
                  <div>
                    <h4 className="notice-title">{n.title}</h4>
                    <p className="notice-desc">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="helpline-box hud-corner">
              <div className="mono text-gold" style={{ fontSize: 11, letterSpacing: '.1em', marginBottom: 6 }}>EMERGENCY DEFENCE HELPLINE</div>
              <div className="disp" style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>1904 / 1800-11-0022</div>
              <p style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 8 }}>
                24/7 Army Headquarters Emergency Operations & Veer Nari Assistance Cell.
              </p>
            </div>

            <div className="card hud-corner">
              <div className="eyebrow" style={{ marginBottom: 8 }}>JOIN INDIAN ARMY</div>
              <p style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.55 }}>
                Opportunities for Officers (NDA, CDS, TGC, SSC) and Agniveers across all arms and services. Serve the nation with honour, dignity, and pride.
              </p>
              <a 
                href="https://joinindianarmy.nic.in" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: 14, width: '100%' }}
              >
                JOININDIANARMY.NIC.IN ➔
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FOOTER COMPONENT
   ========================================================================== */

function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40 }}><ArmyEmblemSvg /></div>
              <div>
                <div className="disp" style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink-bright)' }}>INDIAN ARMY</div>
                <div className="mono text-gold" style={{ fontSize: 10 }}>INTEGRATED DEFENCE HEADQUARTERS</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.6, maxWidth: 360 }}>
              South Block, Integrated HQ of MoD (Army), New Delhi, 110011.<br/>
              Committed to the highest traditions of duty, sacrifice, and technological self-reliance.
            </p>
            <div className="footer-motto-badge">
              सेवा परमो धर्म: · SERVICE BEFORE SELF
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">DEFENCE DIRECTORY</h4>
            <ul className="footer-links">
              <li><a href="#about" className="footer-link">Strategic Pillars</a></li>
              <li><a href="#commands" className="footer-link">Operational Commands</a></li>
              <li><a href="#gallery" className="footer-link">Warfare Wings</a></li>
              <li><a href="#notices" className="footer-link">Official Gazette</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">OFFICIAL PORTALS</h4>
            <ul className="footer-links">
              <li><a href="https://joinindianarmy.nic.in" target="_blank" rel="noreferrer" className="footer-link">Join Indian Army</a></li>
              <li><a href="https://mod.gov.in" target="_blank" rel="noreferrer" className="footer-link">Ministry of Defence</a></li>
              <li><a href="https://nationalwarmemorial.gov.in" target="_blank" rel="noreferrer" className="footer-link">National War Memorial</a></li>
              <li><a href="https://echs.gov.in" target="_blank" rel="noreferrer" className="footer-link">ECHS Veteran Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">SECURITY & ACCESS</h4>
            <ul className="footer-links">
              <li className="mono text-dim" style={{ fontSize: 11 }}>PROTOCOL: HTTPS / TLS 1.3</li>
              <li className="mono text-dim" style={{ fontSize: 11 }}>ENCRYPTION: 256-BIT SHA</li>
              <li className="mono text-dim" style={{ fontSize: 11 }}>PORTAL: DDMS NODE 09</li>
              <li className="mono text-gold" style={{ fontSize: 11, marginTop: 6 }}>NIC CLOUD CERTIFIED</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Integrated Headquarters, Ministry of Defence (Army), Government of India. All Rights Reserved.
          </div>
          <div className="mono">
            Designed for Supreme Defence Vigilance & Command
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   MAIN ROOT APP COMPONENT
   ========================================================================== */

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('hero');
  const [portalMode, setPortalMode] = useState('overview'); // 'overview' (Public Portal) or 'ddms' (DDMS Command Suite)
  const [user, setUser] = useState("JC-118820P Hav Rawat, V.");
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'ddms') {
      setPortalMode('ddms');
      const el = document.getElementById('ddms-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTogglePortal = () => {
    if (portalMode === 'overview') {
      setPortalMode('ddms');
      setTimeout(() => {
        const el = document.getElementById('ddms-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      setPortalMode('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onTogglePortal={handleTogglePortal}
        portalMode={portalMode}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Areas */}
      <main style={{ flex: 1 }}>
        {/* 1. Hero Section */}
        <HeroSection
          onExplore={() => handleNavigate('about')}
          onOpenDDMS={() => {
            setPortalMode('ddms');
            const el = document.getElementById('ddms-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Strategic Pillars */}
        <StrategicPillars />

        {/* 3. Commands & Structure */}
        <CommandsSection />

        {/* 4. Integrated DDMS Command Suite */}
        <section id="ddms-section" className="section" style={{ background: 'var(--bg-darkest)' }}>
          <div className="section-container">
            <div className="section-header">
              <span className="eyebrow">INTEGRATED DUTY & OPERATIONS SYSTEM</span>
              <h2 className="heading-section">DDMS COMMAND & STAFF DESK</h2>
              <p className="section-subtitle">
                Automated personnel shift management, weapon QR issuance tracking, post manning metrics, and cryptographic audit logs.
              </p>
            </div>

            {user ? (
              <DDMSCommandSuite user={user} onLogout={() => setUser(null)} />
            ) : (
              <DDMSLogin onLogin={setUser} />
            )}
          </div>
        </section>

        {/* 5. Special Warfare Wings & Fleet Gallery */}
        <GallerySection onSelectImage={setSelectedGalleryItem} />

        {/* 6. Gazette, Directives & Notices */}
        <NoticesSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal Lightbox */}
      <GalleryModal item={selectedGalleryItem} onClose={() => setSelectedGalleryItem(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
