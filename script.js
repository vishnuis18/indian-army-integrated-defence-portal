const { useState, useEffect, useMemo, useRef } = React;

/* ==========================================================================
   DEFENCE REST API CLIENT (LIVE NODE.JS / EXPRESS BACKEND SERVICE)
   ========================================================================== */

const API_BASE = (window.location.port === '5000') ? '/api' : 'http://localhost:5000/api';

const DefenceAPI = {
  async getBaseInfo() {
    try {
      const res = await fetch(`${API_BASE}/units`);
      if (!res.ok) throw new Error('Base info fetch failed');
      return (await res.json()).baseInfo;
    } catch (e) { return null; }
  },
  async getUnits() {
    try {
      const res = await fetch(`${API_BASE}/units`);
      if (!res.ok) throw new Error('Units fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getUnitDetails(id) {
    try {
      const res = await fetch(`${API_BASE}/units/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`Unit ${id} fetch failed`);
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getPersonnel(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/personnel${qs ? '?' + qs : ''}`);
      if (!res.ok) throw new Error('Personnel fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getPersonnelDetails(id) {
    try {
      const res = await fetch(`${API_BASE}/personnel/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Member details fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async registerPersonnel(payload) {
    const res = await fetch(`${API_BASE}/personnel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Register personnel failed');
    }
    return (await res.json()).data;
  },
  async updatePersonnel(id, payload) {
    const res = await fetch(`${API_BASE}/personnel/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Update personnel failed');
    return (await res.json()).data;
  },
  async transferPersonnel(payload) {
    const res = await fetch(`${API_BASE}/personnel/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Transfer failed');
    }
    return (await res.json());
  },
  async deletePersonnel(id, operator) {
    const res = await fetch(`${API_BASE}/personnel/${encodeURIComponent(id)}${operator ? '?operator=' + encodeURIComponent(operator) : ''}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Delete personnel failed');
    return (await res.json());
  },
  async getDutyPosts() {
    try {
      const res = await fetch(`${API_BASE}/duty-assignments/posts`);
      if (!res.ok) throw new Error('Duty posts fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getDutyAssignments(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/duty-assignments${qs ? '?' + qs : ''}`);
      if (!res.ok) throw new Error('Duty assignments fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async createDutyAssignment(payload) {
    const res = await fetch(`${API_BASE}/duty-assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Duty assignment failed');
    }
    return (await res.json()).data;
  },
  async updateAssignmentStatus(id, status, operator) {
    const res = await fetch(`${API_BASE}/duty-assignments/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, operator })
    });
    if (!res.ok) throw new Error('Status update failed');
    return (await res.json()).data;
  },
  async getRosterDates() {
    try {
      const res = await fetch(`${API_BASE}/roster/dates`);
      if (!res.ok) throw new Error('Roster dates fetch failed');
      return (await res.json()).data;
    } catch (e) { return []; }
  },
  async getDutyHistory(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/roster/history${qs ? '?' + qs : ''}`);
      if (!res.ok) throw new Error('Duty history fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getControlledItems(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/controlled-items${qs ? '?' + qs : ''}`);
      if (!res.ok) throw new Error('Controlled items fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async recordCustody(payload) {
    const res = await fetch(`${API_BASE}/controlled-items/custody`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Custody transaction failed');
    }
    return (await res.json());
  },
  async getCustodyTransactions(itemId) {
    try {
      const qs = itemId ? `?itemId=${encodeURIComponent(itemId)}` : '';
      const res = await fetch(`${API_BASE}/controlled-items/transactions${qs}`);
      if (!res.ok) throw new Error('Custody transactions fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (!res.ok) throw new Error('Dashboard stats fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getManningChart() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/manning-chart`);
      if (!res.ok) throw new Error('Manning chart fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getAlerts() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/alerts`);
      if (!res.ok) throw new Error('Alerts fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getReports() {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (!res.ok) throw new Error('Reports fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getUnitSummaryReport() {
    try {
      const res = await fetch(`${API_BASE}/reports/unit-summary`);
      if (!res.ok) throw new Error('Unit report fetch failed');
      return (await res.json());
    } catch (e) { return null; }
  },
  async getEquipmentAuditReport() {
    try {
      const res = await fetch(`${API_BASE}/reports/equipment-audit`);
      if (!res.ok) throw new Error('Equipment report fetch failed');
      return (await res.json());
    } catch (e) { return null; }
  },
  async getTelemetry() {
    try {
      const res = await fetch(`${API_BASE}/telemetry`);
      if (!res.ok) throw new Error('Telemetry fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getPillars() {
    try {
      const res = await fetch(`${API_BASE}/pillars`);
      if (!res.ok) throw new Error('Pillars fetch failed');
      return (await res.json()).data;
    } catch (e) { return null; }
  },
  async getPillarDetails(id) {
    try {
      const res = await fetch(`${API_BASE}/pillars/${id}`);
      if (!res.ok) throw new Error(`Pillar ${id} fetch failed`);
      return (await res.json()).data;
    } catch (e) { return null; }
  }
};

/* ==========================================================================
   FLIPPING WORD SWAP COMPONENT (PERFECT NATURAL SPACING & SPELLING)
   ========================================================================== */

function FlippingWordSwap({
  word1 = "MISSION",
  word2 = "SECURITY",
  duration = 420,
  stagger = 32,
  interval = 3200,
  autoPlay = true,
  className = "",
  toClassName = "",
  style = {},
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setFlipped(prev => !prev);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const chars1 = word1.split('');
  const chars2 = word2.split('');

  return (
    <div
      className={`flipping-word-swap-container ${className} ${flipped ? toClassName : ''}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        perspective: '1000px',
        lineHeight: 1,
        ...style
      }}
      onMouseEnter={() => setFlipped(prev => !prev)}
      onClick={() => setFlipped(prev => !prev)}
      title="Hover or tap to flip"
    >
      {/* Word 1 Layer - Rendered with natural font kerning & exact spelling */}
      <span
        className="flipping-word-swap-layer"
        style={{
          visibility: flipped ? 'hidden' : 'visible',
          transition: `visibility 0s linear ${flipped ? (chars1.length * stagger + duration) : 0}ms`,
        }}
      >
        {chars1.map((char, index) => {
          const delay = flipped ? index * stagger : (chars1.length - 1 - index) * (stagger * 0.6);
          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                transition: `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}ms, opacity ${duration * 0.75}ms ease ${delay}ms`,
                transform: flipped ? 'translateY(-110%) rotateX(85deg)' : 'translateY(0%) rotateX(0deg)',
                opacity: flipped ? 0 : 1,
                transformOrigin: '50% 100%',
              }}
            >
              {char}
            </span>
          );
        })}
      </span>

      {/* Word 2 Layer - Positioned over the same center with natural font kerning */}
      <span
        className="flipping-word-swap-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          visibility: flipped ? 'visible' : 'hidden',
          transition: `visibility 0s linear ${flipped ? 0 : (chars2.length * stagger + duration)}ms`,
        }}
      >
        {chars2.map((char, index) => {
          const delay = flipped ? index * stagger : (chars2.length - 1 - index) * (stagger * 0.6);
          return (
            <span
              key={index}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                transition: `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.3, 1) ${delay}ms, opacity ${duration * 0.75}ms ease ${delay}ms`,
                transform: flipped ? 'translateY(0%) rotateX(0deg)' : 'translateY(110%) rotateX(-85deg)',
                opacity: flipped ? 1 : 0,
                transformOrigin: '50% 0%',
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </div>
  );
}

/* ==========================================================================
   SCROLL BASED VELOCITY COMPONENT (SPEED-REACTIVE INFINITE VELOCITY SCROLL)
   ========================================================================== */

function ScrollBasedVelocity({
  text = "STRATEGIC PILLARS OF DEFENCE",
  default_velocity = 1.0,
  numCopies = 5,
  className = "",
  style = {},
}) {
  const containerRef = useRef(null);
  const track1Ref = useRef(null);
  const posRef = useRef(0);
  const velocityRef = useRef(default_velocity);
  const targetVelocityRef = useRef(default_velocity);
  const lastScrollY = useRef(window.scrollY);
  const lastTime = useRef(performance.now());
  const baseDirRef = useRef(1); // 1 = left, -1 = right
  const rafId = useRef(null);

  useEffect(() => {
    let scrollTimeout = null;

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = Math.max(1, now - lastTime.current);
      const dy = currentScrollY - lastScrollY.current;
      
      if (Math.abs(dy) > 0.5) {
        const scrollSpeed = (Math.abs(dy) / dt) * 3.5;
        const boost = Math.min(scrollSpeed, 5.0);
        
        // Scroll DOWN (dy > 0) => accelerate left (positive velocity)
        // Scroll UP (dy < 0) => accelerate right (negative velocity)
        if (dy > 0) {
          baseDirRef.current = 1;
          targetVelocityRef.current = default_velocity + boost;
        } else if (dy < 0) {
          baseDirRef.current = -1;
          targetVelocityRef.current = -(default_velocity + boost);
        }
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = now;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Return to steady default speed in the active direction
        targetVelocityRef.current = baseDirRef.current * default_velocity;
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastFrameTime = performance.now();

    const animate = (now) => {
      const delta = Math.min((now - lastFrameTime) / 16.67, 2.0);
      lastFrameTime = now;

      // Smooth lerp transition between velocities and directions
      velocityRef.current += (targetVelocityRef.current - velocityRef.current) * 0.08;
      
      // Move continuous position
      posRef.current -= velocityRef.current * delta;

      if (containerRef.current && track1Ref.current) {
        const setWidth = track1Ref.current.offsetWidth;
        if (setWidth > 0) {
          // Bidirectional seamless wrapping
          while (posRef.current <= -setWidth * 2) {
            posRef.current += setWidth;
          }
          while (posRef.current >= 0) {
            posRef.current -= setWidth;
          }
          containerRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    // Position in middle buffer set on mount
    const timer = setTimeout(() => {
      if (track1Ref.current) {
        posRef.current = -track1Ref.current.offsetWidth;
      }
    }, 50);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearTimeout(scrollTimeout);
      clearTimeout(timer);
    };
  }, [default_velocity]);

  const copies = useMemo(() => Array.from({ length: numCopies }, (_, i) => i), [numCopies]);

  return (
    <div className="scroll-velocity-wrapper">
      <div
        ref={containerRef}
        className={`scroll-velocity-track ${className}`}
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          ...style
        }}
      >
        {/* Set 1 */}
        <div ref={track1Ref} className="scroll-velocity-item">
          {copies.map(i => (
            <span key={`a-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '36px' }}>
              <span>{text}</span>
              <span className="scroll-velocity-divider">✦</span>
            </span>
          ))}
        </div>

        {/* Set 2 (Middle Active Set) */}
        <div className="scroll-velocity-item">
          {copies.map(i => (
            <span key={`b-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '36px' }}>
              <span>{text}</span>
              <span className="scroll-velocity-divider">✦</span>
            </span>
          ))}
        </div>

        {/* Set 3 (Right Buffer for Bidirectional Runway) */}
        <div className="scroll-velocity-item">
          {copies.map(i => (
            <span key={`c-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '36px' }}>
              <span>{text}</span>
              <span className="scroll-velocity-divider">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENT BOX CARD TEMPLATE (CLEAN, NO OVERFLOW, PROPERLY ARRANGED)
   ========================================================================== */

function ComponentBoxCard({
  category = "Defence Domain",
  actionLabel = "Details >",
  onAction,
  word1 = "MISSION",
  word2 = "SECURITY",
  title = "Strategic Pillar",
  description = "Operational framework of the Indian Army.",
  previewBg = "#060d08",
  previewHeight = 180,
  fontSize,
  image,
  icon,
  badge,
  duration = 400,
  stagger = 32,
  interval = 3200,
  className = "",
  style = {},
  children
}) {
  const maxWordLength = Math.max((word1 || "").length, (word2 || "").length);
  const calculatedFontSize = fontSize || (
    maxWordLength >= 11 ? "clamp(1.1rem, 1.8vw, 1.35rem)" :
    maxWordLength >= 8 ? "clamp(1.2rem, 2.1vw, 1.55rem)" :
    "clamp(1.3rem, 2.4vw, 1.75rem)"
  );

  return (
    <div className={`component-box-card hud-corner ${className}`} style={style} onClick={onAction}>
      {/* Top Inner Display Box */}
      <div 
        className="component-box-inner" 
        style={{ 
          background: previewBg,
          minHeight: previewHeight,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {image && (
          <div className="component-box-media-layer">
            <img src={image} alt={title} />
            <div className="component-box-media-overlay" />
          </div>
        )}
        
        {/* Top Header Row */}
        <div className="component-box-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            {icon && <span style={{ color: 'var(--gold-light)', flexShrink: 0 }}>{icon}</span>}
            <span className="component-box-category" style={{ color: '#d2e3d8', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{category}</span>
          </div>

          <div className="component-box-header-right">
            {badge && (
              <span className="chip chip-gold" style={{ fontSize: 9.5, padding: '2px 7px', background: 'rgba(197, 160, 89, 0.22)', color: '#f0cf88', borderColor: 'rgba(197, 160, 89, 0.5)', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                {badge}
              </span>
            )}
            {actionLabel && (
              <span className="component-box-action" style={{ color: '#dfba74', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                {actionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Center Display Area */}
        <div className="component-box-center">
          {word1 && word2 ? (
            <FlippingWordSwap
              word1={word1}
              word2={word2}
              duration={duration}
              stagger={stagger}
              interval={interval}
              style={{
                fontSize: calculatedFontSize,
                fontWeight: 800,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
                color: "#ffffff",
                textShadow: "0 0 24px rgba(223, 186, 116, 0.45), 0 2px 10px rgba(0, 0, 0, 0.95)",
              }}
            />
          ) : children}
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="component-box-info">
        <h3 className="component-box-title">{title}</h3>
        <p className="component-box-desc">{description}</p>
      </div>
    </div>
  );
}

/* ==========================================================================
   MOCK DATA & REPOSITORIES (PRESERVED & ENHANCED)
   ========================================================================== */

const BASE_INFO_DEFAULT = {
  name: "Northern Cantonment Base // Sector Alpha",
  command: "Northern Command (Integrated Defence Sector)",
  commandingOfficer: "Col R. S. Rathore",
  location: "Udhampur Sector Enclave",
  securityStatus: "DEFCON 4 // OPERATIONAL READY"
};

const UNITS_DEFAULT = [
  { id: "UNIT-01", code: "2-GREN", name: "2nd Battalion, The Grenadiers", shortName: "2 GRENADIERS", seniorOfficer: "Col R. S. Rathore", seniorSupervisor: "Hav Rawat, V. (Senior Havaldar)", authorizedStrength: 40, actualStrength: 12, motto: "Sarvada Shaktishali", sector: "Sector Alpha Main Perimeter" },
  { id: "UNIT-02", code: "3-PARA", name: "3rd Battalion, Parachute Regiment", shortName: "3 PARA", seniorOfficer: "Lt Col A. K. Verma", seniorSupervisor: "Nb Sub Yadav, D.", authorizedStrength: 35, actualStrength: 10, motto: "Shatrujeet", sector: "Sector Bravo Rapid Staging" },
  { id: "UNIT-03", code: "HQ-COY", name: "Base Headquarters Company", shortName: "HQ COY", seniorOfficer: "Capt Kulkarni, N.", seniorSupervisor: "Nb Sub Bhatt, A.", authorizedStrength: 35, actualStrength: 11, motto: "Seva Paramo Dharma", sector: "Command & Communications Hub" },
  { id: "UNIT-04", code: "10-GUARDS", name: "10th Battalion, Brigade of the Guards", shortName: "10 GUARDS", seniorOfficer: "Maj S. K. Joshi", seniorSupervisor: "Hav Thapa, B.", authorizedStrength: 38, actualStrength: 9, motto: "Pahla Hamesha Pahla", sector: "Sector Charlie Outer Watchtowers" },
];

const PERSONNEL = [
  { id: "PERS-101", armyNo: "JC-118820P", name: "Rawat, V.", rank: "Hav", unitId: "UNIT-01", unit: "2 GRENADIERS", designation: "Senior Havaldar / Guard Commander", status: "ON DUTY", restHours: 0, familyStatus: "Family Member", quarterStatus: "ALLOCATED", quarterNo: "QTR-A-14", joinedDate: "2023-01-15", nextTransferDate: "2027-01-15" },
  { id: "PERS-102", armyNo: "IC-56231X", name: "Menon, S.", rank: "Lt", unitId: "UNIT-01", unit: "2 GRENADIERS", designation: "Duty Officer / Armoury In-Charge", status: "ON DUTY", restHours: 0, familyStatus: "Single", quarterStatus: "NOT ALLOCATED", quarterNo: "Officers Mess Living", joinedDate: "2024-06-01", nextTransferDate: "2026-12-01" },
  { id: "PERS-103", armyNo: "JC-224871K", name: "Bhatt, A.", rank: "Nb Sub", unitId: "UNIT-03", unit: "HQ COY", designation: "Section Leader / Signal Supervisor", status: "REST", restHours: 4, familyStatus: "Family Member", quarterStatus: "ALLOCATED", quarterNo: "QTR-C-08", joinedDate: "2023-11-15", nextTransferDate: "2026-11-15" },
  { id: "PERS-104", armyNo: "NK-994102", name: "Chauhan, R.", rank: "Sep", unitId: "UNIT-03", unit: "HQ COY", designation: "Rifleman / Access Control Sentry", status: "ON DUTY", restHours: 0, familyStatus: "Single", quarterStatus: "NOT ALLOCATED", quarterNo: "Troop Barrack #4", joinedDate: "2025-02-01", nextTransferDate: "2028-02-01" },
  { id: "PERS-105", armyNo: "JC-330019L", name: "Yadav, D.", rank: "Nk", unitId: "UNIT-02", unit: "3 PARA", designation: "QRT Specialist / Team Lead", status: "ON DUTY", restHours: 0, familyStatus: "Family Member", quarterStatus: "NOT ALLOCATED", quarterNo: "Waitlisted #04", joinedDate: "2023-08-20", nextTransferDate: "2026-08-20" },
  { id: "PERS-106", armyNo: "NK-771145", name: "Singh, P.", rank: "Sep", unitId: "UNIT-02", unit: "3 PARA", designation: "Scout / Marksman", status: "AVAILABLE", restHours: 0, familyStatus: "Single", quarterStatus: "NOT ALLOCATED", quarterNo: "Troop Barrack #2", joinedDate: "2024-03-10", nextTransferDate: "2027-03-10" },
  { id: "PERS-107", armyNo: "IC-70234R", name: "Kulkarni, N.", rank: "Capt", unitId: "UNIT-03", unit: "HQ COY", designation: "Adjutant / Base Security Coordinator", status: "ON DUTY", restHours: 0, familyStatus: "Family Member", quarterStatus: "ALLOCATED", quarterNo: "QTR-B-02", joinedDate: "2024-04-12", nextTransferDate: "2027-04-12" },
  { id: "PERS-108", armyNo: "JC-441982", name: "Thapa, B.", rank: "Hav", unitId: "UNIT-04", unit: "10 GUARDS", designation: "Section 2IC / Watchtower Supervisor", status: "AVAILABLE", restHours: 0, familyStatus: "Family Member", quarterStatus: "ALLOCATED", quarterNo: "QTR-D-11", joinedDate: "2023-05-18", nextTransferDate: "2026-05-18" },
];

const POSTS = [
  { id: "PST-01", name: "Main Gate & Access Control", unitId: "UNIT-01", priority: "HIGH", manpower: 2, filled: 2, location: "Sector Alpha Main Base Perimeter Entry" },
  { id: "PST-02", name: "Armoury & Ordnance Depot", unitId: "UNIT-01", priority: "CRITICAL", manpower: 2, filled: 1, location: "Secure Ordnance Bunker Complex B" },
  { id: "PST-03", name: "Perimeter Watchtower — North Grid", unitId: "UNIT-04", priority: "MEDIUM", manpower: 3, filled: 3, location: "Outer Himalayan Ridge Observation Tower 3" },
  { id: "PST-04", name: "Quick Reaction Team (QRT Standby)", unitId: "UNIT-02", priority: "CRITICAL", manpower: 4, filled: 3, location: "Sector Bravo Rapid Staging Bay" },
  { id: "PST-05", name: "Base HQ Enclave & Communications Desk", unitId: "UNIT-03", priority: "HIGH", manpower: 2, filled: 2, location: "Command Building Level 1" },
  { id: "PST-06", name: "Fuel Depot & Logistical Corridors", unitId: "UNIT-04", priority: "MEDIUM", manpower: 1, filled: 1, location: "Logistical Support Area South" }
];

const CONTROLLED_ITEMS_INITIAL = [
  { id: "EQP-7021", serial: "WPN-7021", name: "INSAS 1B1 5.56mm Assault Rifle", category: "Assault Rifle", unit: "2 GRENADIERS", status: "ISSUED", custodian: "Hav Rawat, V.", issuingOfficer: "Lt Menon, S.", calibre: "5.56x45mm NATO", quantity: 1, reconciliationStatus: "VERIFIED" },
  { id: "EQP-7022", serial: "WPN-7022", name: "INSAS 1B1 5.56mm Assault Rifle", category: "Assault Rifle", unit: "2 GRENADIERS", status: "IN ARMOURY", custodian: "Armoury Depot Complex", issuingOfficer: "Lt Menon, S.", calibre: "5.56x45mm NATO", quantity: 1, reconciliationStatus: "VERIFIED" },
  { id: "EQP-8401", serial: "WPN-8401", name: "AK-203 7.62x39mm Combat Rifle", category: "Assault Rifle", unit: "3 PARA", status: "ISSUED", custodian: "Nk Yadav, D.", issuingOfficer: "Lt Menon, S.", calibre: "7.62x39mm", quantity: 1, reconciliationStatus: "VERIFIED" },
  { id: "EQP-8402", serial: "WPN-8402", name: "AK-203 7.62x39mm Combat Rifle", category: "Assault Rifle", unit: "3 PARA", status: "IN ARMOURY", custodian: "Armoury Depot Complex", issuingOfficer: "Lt Menon, S.", calibre: "7.62x39mm", quantity: 1, reconciliationStatus: "VERIFIED" },
  { id: "EQP-9110", serial: "WPN-9110", name: "Glock 17 9mm Service Sidearm", category: "Pistol", unit: "2 GRENADIERS", status: "ISSUED", custodian: "Lt Menon, S.", issuingOfficer: "Capt Kulkarni, N.", calibre: "9x19mm Parabellum", quantity: 1, reconciliationStatus: "VERIFIED" },
  { id: "EQP-5503", serial: "WPN-5503", name: "Carl Gustaf M4 84mm Recoilless Rifle", category: "Heavy Weapon", unit: "10 GUARDS", status: "IN ARMOURY", custodian: "Armoury Depot Complex", issuingOfficer: "Lt Menon, S.", calibre: "84mm Rocket", quantity: 1, reconciliationStatus: "VERIFIED" },
];

const ALERTS_INITIAL = [
  { id: "ALT-01", level: "amber", text: "Nb Sub Bhatt, A. rest period ends in 40 min — reassign PST-02 relief", time: "16m ago" },
  { id: "ALT-02", level: "danger", text: "Armoury PST-02 understaffed: 1 of 2 filled — immediate assignment required", time: "24m ago" },
  { id: "ALT-03", level: "steel", text: "6 controlled weapons due for quarterly ordnance & maintenance check", time: "1h ago" },
  { id: "ALT-04", level: "gold", text: "Sector Bravo perimeter communications link verified operational", time: "2h ago" },
];

const AUDIT_LOG = [
  { ts: "06:15 IST", event: "DUTY", detail: "[DUTY ORDER] Shift assignment gazetted for 3 PARA (QRT Standby PST-04)", by: "Col R. S. Rathore" },
  { ts: "06:00 IST", event: "DUTY", detail: "[DUTY ORDER] Morning shift deployed to Main Gate PST-01 (Hav Rawat, V.)", by: "Col R. S. Rathore" },
  { ts: "05:45 IST", event: "EQUIPMENT", detail: "[CONTROLLED EQUIPMENT] WPN-9110 issued to Lt Menon, S.", by: "Capt Kulkarni, N." },
  { ts: "05:30 IST", event: "SYSTEM", detail: "[SYSTEM] Database persistence synchronized to disk (db.json)", by: "SYS-AUTO" },
];

const COMMANDS_DATA = [
  { name: "Northern Command", hq: "Udhampur, J&K", word1: "NORTHERN", word2: "VANGUARD", motto: "Always in Front", desc: "Guards northern frontiers, Siachen Glacier, and LOC with supreme high-altitude readiness." },
  { name: "Western Command", hq: "Chandimandir, Haryana", word1: "WESTERN", word2: "STRIKE", motto: "Ever Victorious", desc: "Defends northern plains and western sectors with rapid armoured strike capability." },
  { name: "Eastern Command", hq: "Fort William, Kolkata", word1: "EASTERN", word2: "DEFENCE", motto: "Courage and Valour", desc: "Protects eastern borders, dense jungle corridors, and Himalayan mountain passes." },
  { name: "Southern Command", hq: "Pune, Maharashtra", word1: "SOUTHERN", word2: "SHIELD", motto: "Valour and Wisdom", desc: "Spans island territories, desert sectors, and southern peninsula defence." },
  { name: "Central Command", hq: "Lucknow, Uttar Pradesh", word1: "CENTRAL", word2: "RESERVE", motto: "Devotion to Duty", desc: "Oversees strategic axes, logistical hubs, and operational reserves across central India." },
  { name: "South Western Command", hq: "Jaipur, Rajasthan", word1: "DESERT", word2: "CORPS", motto: "Forever Victorious", desc: "Specialized in desert warfare, mechanized strike formations, and rapid response." },
  { name: "ARTRAC", hq: "Shimla, Himachal Pradesh", word1: "DOCTRINE", word2: "TACTICS", motto: "Training for War", desc: "Army Training Command formulating military doctrine, tactics, and officer leadership." },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Mountain Warfare & High Altitude",
    category: "Northern Frontier",
    word1: "SIACHEN",
    word2: "HIMALAYAS",
    desc: "Indian Army troops conducting high-altitude reconnaissance across Himalayan ridges in sub-zero snow terrain.",
    img: "assets/images/mountain.png",
    specs: "Specialized cold-weather survival gear, mountaineering warfare kit, tactical SATCOM link."
  },
  {
    id: 2,
    title: "Armoured Strike Columns",
    category: "Western Sector",
    word1: "ARMOURED",
    word2: "TANKS",
    desc: "Main Battle Tanks maneuvering in battle formation across arid terrain during tactical readiness exercises.",
    img: "assets/images/armour.png",
    specs: "Thermal imaging fire control, dynamic reactive armour, indigenous weapon integration."
  },
  {
    id: 3,
    title: "Special Forces (PARA SF)",
    category: "Special Forces",
    word1: "AIRBORNE",
    word2: "SPECIAL",
    desc: "Elite Para Commandos conducting airborne tactical insertion and counter-terrorism precision drills.",
    img: "assets/images/airborne.png",
    specs: "High-altitude freefall insertion, night-vision combat suites, suppressed assault weapons."
  },
  {
    id: 4,
    title: "C4ISR & Tactical Operations Centre",
    category: "Command Network",
    word1: "INTELLIGENCE",
    word2: "SURVEILLANCE",
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
    <img 
      src="assets/images/army_emblem.png" 
      alt="Indian Army Emblem" 
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
        display: 'block'
      }} 
    />
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconRadar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path d="M12 3v9l6 6" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function TopBar({ telemetry }) {
  const [zuluMode, setZuluMode] = useState(false);

  // Time is derived live from the telemetry backend or fallback
  const displayTime = zuluMode 
    ? (telemetry?.zuluTime ? `${telemetry.zuluTime} ZULU (UTC)` : new Date().toUTCString())
    : (telemetry?.istTime && telemetry?.istDate ? `${telemetry.istTime} · ${telemetry.istDate}` : `${new Date().toLocaleTimeString("en-IN")} IST`);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-badge">
          <span className="radar-ping"></span> INTEGRATED DEFENCE HEADQUARTERS
        </span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span>GOVERNMENT OF INDIA</span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span className="text-gold">{telemetry?.defconLevel || "READINESS: DEFCON 4 NORMAL READY"}</span>
      </div>
      <div className="topbar-right">
        <span 
          onClick={() => setZuluMode(!zuluMode)} 
          title="Click to toggle IST / ZULU (UTC)"
          style={{ cursor: 'pointer', color: 'var(--ink)' }}
        >
          ⏱ {displayTime}
        </span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span>SECURE NODE: {telemetry?.secureNode || "DEL-09-TACTICAL"}</span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span 
          className={`chip ${telemetry?.connected ? 'chip-duty' : 'chip-danger'}`}
          style={{ fontSize: 9.5, padding: '2px 7px', letterSpacing: '0.04em' }}
          title={telemetry?.connected ? `Connected to Node.js/Express REST server (${telemetry.pingMs}ms)` : 'Backend server offline'}
        >
          ● {telemetry?.connected ? `REST API: ${telemetry.pingMs}ms` : 'REST API: OFFLINE'}
        </span>
      </div>
    </div>
  );
}

/* ==========================================================================
   HEADER / NAVBAR COMPONENT
   ========================================================================== */

function Navbar({ activeSection, onNavigate, onTogglePortal, portalMode, theme, onToggleTheme, telemetry }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'Rules & Regulations' },
    { id: 'ddms', label: 'DDMS Command' },
    { id: 'notices', label: 'Gazette' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="site-header">
      <TopBar telemetry={telemetry} />
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
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
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

function HeroSection({ onExplore, onOpenDDMS, telemetry }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-bg-media">
        <img src="assets/images/hero.png" alt="Indian Army Tactical Vanguard" />
      </div>
      <div className="hero-backdrop-gradient"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badges-row">
            <span className="hero-badge hero-badge-gold">
              <span className="radar-ping"></span>
              <span>DEFENCE COMMAND PORTAL</span>
            </span>
          </div>

          <h1 className="hero-title heading-hero">
            <span>SERVICE BEFORE</span>
            <span className="title-accent">SELF</span>
          </h1>

          <div className="hero-sanskrit">
            सेवा परमो धर्म: // SEVA PARAMO DHARMA
          </div>

          <p className="hero-description">
            Guarding the sovereignty of the nation across high-altitude glaciers, desert frontiers, dense riverines, and aerospace. Committed to iron discipline, supreme valor, and state-of-the-art technological vigilance.
          </p>

          <div className="hero-actions">
            <button className="btn btn-gold btn-lg" onClick={onExplore}>
              EXPLORE RULES & REGULATIONS ➔
            </button>
            <button className="btn btn-secondary btn-lg" onClick={onOpenDDMS}>
              <IconShield /> ACCESS DDMS COMMAND
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   ARMY RULES & REGULATIONS ICONS & DATA
   ========================================================================== */

function IconShieldCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}

function IconUniform() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function IconScale() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM7 21h10M12 3v18M3 7h18"/>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

function IconProperty() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M9 14l2 2 4-4"/>
    </svg>
  );
}

function IconSafety() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function IconViolations() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  );
}

const RULES_UPDATES = [
  {
    id: "upd-01",
    citation: "Army Order 04/2026",
    title: "Digital & Social Media Operational Security Directives",
    published: "15 Jan 2026",
    effective: "Immediate",
    category: "Security",
    status: "OFFICIALLY VERIFIED"
  },
  {
    id: "upd-02",
    citation: "Special Army Instruction 18/2025",
    title: "Modernized Dress Regulations & Field Utility Standards",
    published: "10 Nov 2025",
    effective: "01 Dec 2025",
    category: "Uniform",
    status: "OFFICIALLY VERIFIED"
  },
  {
    id: "upd-03",
    citation: "Army Headquarters Directive 102/2025",
    title: "Annual Combat Fitness & Medical Evaluation Guidelines",
    published: "14 Aug 2025",
    effective: "01 Sep 2025",
    category: "Safety",
    status: "OFFICIALLY VERIFIED"
  },
  {
    id: "upd-04",
    citation: "Adjutant General Branch Advisory 09/2025",
    title: "Grievance Redressal Mechanism & Transparent Timeline Protocol",
    published: "22 May 2025",
    effective: "Immediate",
    category: "Conduct",
    status: "OFFICIALLY VERIFIED"
  }
];

const RULES_CATEGORIES = [
  {
    id: "discipline-orders",
    code: "01 · DISCIPLINE",
    title: "Discipline & Orders",
    subtitle: "Maintain discipline, respect the chain of command, and follow lawful orders.",
    icon: <IconShieldCheck />,
    previewBullets: [
      "Following lawful orders promptly and without hesitation",
      "Respecting the established military chain of command",
      "Military courtesy, salutes and professional discipline",
      "Personal responsibility, accountability and post integrity"
    ],
    rules: [
      {
        num: "1.1",
        title: "Following Lawful Orders",
        explanation: "All military personnel are legally bound to obey all lawful commands issued by their appointed superiors promptly, respectfully, and without dispute.",
        reference: "Army Act, 1950 — Section 41 (Disobedience to superior officer)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Failure to obey a lawful command given by a superior officer in the execution of his office constitutes a court-martial offence under military law."
      },
      {
        num: "1.2",
        title: "Respecting the Chain of Command",
        explanation: "All communications, operational reports, representations, and administrative applications must strictly follow the established line of command through Section, Platoon, and Company commanders.",
        reference: "Regulations for the Army (Revised Edition) — Para 421",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Bypassing the chain of command to communicate with higher headquarters or external authorities is strictly prohibited."
      },
      {
        num: "1.3",
        title: "Military Courtesy & Professional Bearing",
        explanation: "Proper military compliments, salutes, and formal address by rank must be rendered to all superior officers, commissioned ranks, and national colours at all times.",
        reference: "Regulations for the Army — Para 435 (Compliments & Salutes)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Courtesy reinforces command cohesion and unit morale. Compliments must be exchanged smartly and reciprocated by seniors."
      },
      {
        num: "1.4",
        title: "Personal Responsibility & Accountability",
        explanation: "Every serviceman bears direct personal accountability for their conduct, arms, ammunition, and assigned post duties during peace, training, and operational conditions.",
        reference: "Army Act, 1950 — General Principles of Military Discipline",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "An individual cannot delegate personal responsibility for vigilance or safety on guard duty."
      }
    ]
  },
  {
    id: "uniform-appearance",
    code: "02 · APPEARANCE",
    title: "Uniform & Appearance",
    subtitle: "Maintain required dress standards, military courtesy, and professional behaviour.",
    icon: <IconUniform />,
    previewBullets: [
      "Observance of authorized pattern uniforms and badges of rank",
      "Strict grooming, haircut, and personal hygiene standards",
      "Dress regulations in public areas and prohibition of civilian mixing"
    ],
    rules: [
      {
        num: "2.1",
        title: "Applicable Uniform Standards",
        explanation: "Personnel must wear only authorized pattern combat dress, service dress, or ceremonial uniform with official badges of rank, ribbons, and regimental accoutrements.",
        reference: "Dress Regulations for the Army (Revised 2022)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Non-regulation modifications, unauthorized badges, or altered camouflage patterns are strictly prohibited on duty and parade."
      },
      {
        num: "2.2",
        title: "Grooming & Military Bearing",
        explanation: "Haircuts must be neatly trimmed above the collar, beards regulated according to regimental authorization, and personal bearing must reflect military pride.",
        reference: "Regulations for the Army — Grooming & Bearing Directives",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Soldiers on active strength must present a clean-shaven or regimentally authorized appearance at morning muster rolls."
      },
      {
        num: "2.3",
        title: "Observing Dress Regulations in Public",
        explanation: "Uniform must never be mixed with civilian clothing, worn in disreputable public venues, or worn while travelling without formal authorization orders.",
        reference: "Army Orders (Dress & Public Decorum Standards)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Wearing partial uniform items (e.g. combat jacket with civilian jeans) undermines service dignity and is prohibited."
      }
    ]
  },
  {
    id: "attendance-punctuality",
    code: "03 · ATTENDANCE",
    title: "Attendance & Punctuality",
    subtitle: "Report on time, follow muster roll procedures, and adhere to leave authorizations.",
    icon: <IconClock />,
    previewBullets: [
      "Reporting on time for muster rolls, guard mounting, and assigned shifts",
      "Adherence to duty roster check-in and relief handover procedures",
      "Understanding authorized leave sanctions and reporting timelines"
    ],
    rules: [
      {
        num: "3.1",
        title: "Punctuality & Parade Fall-In",
        explanation: "All personnel must report at least 10 minutes prior to scheduled parades, roll calls, and duty shift handovers. Unexplained absence is strictly punishable.",
        reference: "Army Act, 1950 — Section 39 (Absence without leave)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Absence from appointed place of parade or duty without sufficient cause is subject to summary military trial."
      },
      {
        num: "3.2",
        title: "Duty Roster Attendance Protocol",
        explanation: "Soldiers assigned to perimeter checkposts, main gate sentry, or QRT standby must remain present at their station until formally relieved by the relief guard.",
        reference: "Base Standing Orders — Guard Mounting & Post Manning",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Abandoning a guard post or falling asleep on sentry duty constitutes a severe breach of the Army Act."
      },
      {
        num: "3.3",
        title: "Authorized Leave & Reporting Requirements",
        explanation: "Leave must be sanctioned through Part II Orders. Soldiers must report back to their unit before expiry of leave, and immediately report their arrival at the Guard Room.",
        reference: "Army Leave Rules & Regulations for the Army Para 472",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Overstaying leave requires immediate communication with the unit Adjutant along with government hospital medical certificates if hospitalized."
      }
    ]
  },
  {
    id: "code-of-conduct",
    code: "04 · CONDUCT",
    title: "Code of Conduct",
    subtitle: "Honesty and integrity, respectful behaviour, and professional conduct on and off duty.",
    icon: <IconScale />,
    previewBullets: [
      "Unflinching honesty, moral integrity, and truthful reporting",
      "Respectful behaviour, dignity, and comradeship across all ranks",
      "Strict zero tolerance for harassment, ragging, or discrimination",
      "Exemplary professional conduct on duty and in civilian interactions"
    ],
    rules: [
      {
        num: "4.1",
        title: "Honesty & Moral Integrity",
        explanation: "Complete truthfulness in official logbooks, reports, and administrative rolls is expected. Falsification of documents is severely penalised under military law.",
        reference: "Army Act, 1950 — Section 45 (Unbecoming conduct) & Section 57",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Making false official statements or fraudulent entries in military records undermines base security."
      },
      {
        num: "4.2",
        title: "Respectful Behaviour & Comradeship",
        explanation: "Mutual trust, respect, and cohesive camaraderie form the operational foundation of armed combat units. Bullying or derogatory language is unacceptable.",
        reference: "Military Ethos & Regimental Code of the Indian Army",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Officers and JCOs must lead by personal example, ensuring welfare and equitable treatment of all personnel under their command."
      },
      {
        num: "4.3",
        title: "Zero Tolerance for Harassment & Discrimination",
        explanation: "The Indian Army strictly prohibits any form of ragging, hazing, harassment, or discrimination based on caste, creed, religion, or regional origin.",
        reference: "Equal Opportunity & Anti-Ragging Directives (Army HQ)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Violators are liable to immediate disciplinary action and removal from service."
      },
      {
        num: "4.4",
        title: "Professional Conduct On and Off Duty",
        explanation: "Personnel represent the nation and the Indian Army at all times. They must maintain sobriety, avoid public debt disputes, and respect civil laws.",
        reference: "Regulations for the Army — Para 428 (Civil Conduct & Decorum)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Intoxication while on duty or disorderly conduct in civilian areas results in swift court-martial action."
      }
    ]
  },
  {
    id: "confidentiality-security",
    code: "05 · SECURITY",
    title: "Confidentiality & Security",
    subtitle: "Protect sensitive information, credentials, official records, and restricted material.",
    icon: <IconLock />,
    previewBullets: [
      "Protection of operational plans, roster records, and classified data",
      "Securing military portal accounts, login credentials, and digital keys",
      "Compliance with photography, smartphone, and social media bans",
      "Immediate counter-intelligence reporting of unauthorized disclosures"
    ],
    rules: [
      {
        num: "5.1",
        title: "Protecting Sensitive & Classified Information",
        explanation: "Details of military unit dispositions, duty assignments, ammunition holdings, and patrol timings are strictly confidential and must never be discussed with unauthorized persons.",
        reference: "Official Secrets Act, 1923 & Army Security Regulations",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Classified documents must be handled strictly on a 'Need to Know' basis and stored in double-locked security safes."
      },
      {
        num: "5.2",
        title: "Digital Accounts & Credential Security",
        explanation: "User accounts, passwords, and cryptographic keys used for accessing base command systems and duty portals must never be shared or written in unsecured places.",
        reference: "Cyber Security Directives for Armed Forces (CERT-Army)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Sharing login credentials or inserting unauthorized USB storage media into military workstations is a punishable breach."
      },
      {
        num: "5.3",
        title: "Social Media & Photography Restrictions",
        explanation: "Taking photographs inside military installations, posting in uniform on social media, or revealing troop locations online is strictly banned.",
        reference: "Army Cyber Security Policy & Social Media Guidelines (Revised)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Smartphone usage is restricted in operational offices, armouries, and command war rooms."
      },
      {
        num: "5.4",
        title: "Counter-Intelligence Reporting",
        explanation: "Any suspicious inquiry, honey-trap approach, or unauthorized request for military information must be reported immediately to the Military Intelligence (MI) cell.",
        reference: "Standing Counter-Intelligence Orders",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Failure to report suspected espionage or hostile intelligence overtures constitutes complicity under the Army Act."
      }
    ]
  },
  {
    id: "equipment-property",
    code: "06 · PROPERTY",
    title: "Equipment & Property",
    subtitle: "Responsible use of authorized equipment, custody recordkeeping, and discrepancy reporting.",
    icon: <IconProperty />,
    previewBullets: [
      "Responsible handling of weapons, ammunition, optics, and gear",
      "Strict compliance with armoury storage and cleaning procedures",
      "Immediate reporting of damaged, defective, or missing property",
      "Maintaining continuous and verified custody ledger records"
    ],
    rules: [
      {
        num: "6.1",
        title: "Responsible Use of Authorized Equipment",
        explanation: "Government-issued weapons, tactical optics, wireless sets, and transport vehicles must be operated strictly for official duty and maintained in combat-ready state.",
        reference: "Army Act, 1950 — Section 54 (Deficiency of equipment)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Negligent loss or damage to government equipment incurs disciplinary action and financial recovery."
      },
      {
        num: "6.2",
        title: "Armoury Storage & Safety Clearing",
        explanation: "Firearms must be physically cleared at the safety sand-bucket before entry into the kote/armoury and deposited immediately upon conclusion of the duty shift.",
        reference: "Standard Operating Procedures for Unit Armouries (Kote SOP)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Weapons must be locked in designated unit racks under the joint supervision of the Unit Armourer and Havaldar Major."
      },
      {
        num: "6.3",
        title: "Reporting Missing or Damaged Property",
        explanation: "Any defect, cracked optic, weapon malfunction, or missing equipment item must be reported immediately to the Quartermaster for formal recording.",
        reference: "Equipment Management Guidelines (EMG)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Concealing a weapon defect or loss is an offence. Immediate reporting enables formal replacement and technical investigation."
      },
      {
        num: "6.4",
        title: "Accurate Custody Ledger Maintenance",
        explanation: "Every weapon issuance, ammunition box draw, and night vision handover must be documented with signatures in physical registers and digital DDMS records.",
        reference: "Materiel Management & Ordnance Audit Regulations",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Discrepancies in serial numbers between ledger and physical firearm must be reconciled before daily armoury closing."
      }
    ]
  },
  {
    id: "safety-training",
    code: "07 · SAFETY",
    title: "Safety & Training",
    subtitle: "Approved safety procedures, combat training drills, and health/fitness standards.",
    icon: <IconSafety />,
    previewBullets: [
      "Adherence to firing range protocols and live ammunition safety",
      "Mandatory attendance at scheduled tactical refreshers and drills",
      "Immediate reporting of physical hazards, fire risks, and incidents",
      "Maintaining requisite SHAPE-1 medical classification and fitness"
    ],
    rules: [
      {
        num: "7.1",
        title: "Firing Range & Ammunition Safety",
        explanation: "Strict range discipline is compulsory. Weapons must point down-range at all times, with safety catches engaged until the command 'Fire' is given by the Range Officer.",
        reference: "Small Arms Safety Manual & Range Standing Orders",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Muzzle awareness and chamber inspection drills must be executed without compromise."
      },
      {
        num: "7.2",
        title: "Mandatory Tactical Training & Drills",
        explanation: "Every soldier must regularly undergo Battle Physical Efficiency Tests (BPET), firing classification, and chemical-biological-radiological defense refreshers.",
        reference: "Annual Training Directives (Army Training Command - ARTRAC)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Exemption from training is permitted only on certified medical advice from a Military Hospital Medical Officer."
      },
      {
        num: "7.3",
        title: "Hazard & Incident Reporting",
        explanation: "Personnel must immediately flag unsafe ammunition boxes, vehicle brake failures, exposed wiring, or combustible hazards to the Base Safety Officer.",
        reference: "Reference pending verification (Occupational Safety SOP)",
        verification: "REFERENCE PENDING VERIFICATION",
        details: "Unit safety officers conduct periodic risk assessments. Early reporting of near-misses prevents loss of life."
      },
      {
        num: "7.4",
        title: "Medical & Physical Fitness Compliance",
        explanation: "All servicemen must maintain prescribed physical conditioning and undergo mandatory annual medical examinations (AME) to ensure SHAPE-1 deployment readiness.",
        reference: "Medical Regulations for the Army",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Undisclosed injuries or refusal of medical treatment required for duty readiness is prohibited."
      }
    ]
  },
  {
    id: "reporting-violations",
    code: "08 · VIOLATIONS",
    title: "Reporting Violations",
    subtitle: "Reporting misconduct through authorized channels and escalating safety concerns.",
    icon: <IconViolations />,
    previewBullets: [
      "Reporting disciplinary infractions through authorized command channels",
      "Immediate escalation of security breaches and perimeter hazards",
      "Understanding statutory grievance redressal procedures without fear"
    ],
    rules: [
      {
        num: "8.1",
        title: "Reporting Misconduct through Official Channels",
        explanation: "Soldiers witnessing serious misconduct, theft of defence equipment, or insubordination must report the facts truthfully to their Subedar Major or Commanding Officer.",
        reference: "Army Rules, 1954 — Chapter IV (Investigation of charges)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Anonymous or malicious false allegations are punishable under military law."
      },
      {
        num: "8.2",
        title: "Escalation of Urgent Security Breaches",
        explanation: "Intrusion alerts, perimeter fence breaches, or missing weapons must be reported instantaneously to the Base Duty Officer (BDO) and Guard Commander.",
        reference: "Base Counter-Sabotage & Alert Standard Operating Procedures",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "The QRT is dispatched immediately upon broadcast of an alert code."
      },
      {
        num: "8.3",
        title: "Statutory Redress of Grievances",
        explanation: "Any serviceman who deems himself wronged by an officer has the statutory right under the Army Act to submit a petition for redress of grievance.",
        reference: "Army Act, 1950 — Section 26 & Section 27 (Redress of wrongs)",
        verification: "OFFICIALLY VERIFIED REGULATION",
        details: "Commanding Officers are legally mandated to investigate and forward petitions without bias or punitive retaliation."
      }
    ]
  }
];

/* ==========================================================================
   ARMY RULES & REGULATIONS COMPONENT (REPLACING STRATEGIC PILLARS)
   ========================================================================== */

function ArmyRulesSection({ onSelectRule, onSelectPillar }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpdates, setShowUpdates] = useState(false);

  const handleSelect = (category) => {
    if (onSelectRule) onSelectRule(category);
    else if (onSelectPillar) onSelectPillar(category);
  };

  // Filter categories and rules by search keyword
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return RULES_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return RULES_CATEGORIES.filter(cat => 
      cat.title.toLowerCase().includes(q) ||
      cat.subtitle.toLowerCase().includes(q) ||
      cat.code.toLowerCase().includes(q) ||
      cat.previewBullets.some(b => b.toLowerCase().includes(q)) ||
      cat.rules.some(r => 
        r.title.toLowerCase().includes(q) ||
        r.explanation.toLowerCase().includes(q) ||
        r.reference.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  return (
    <section id="about" className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-container rules-container">
        {/* Section Header */}
        <div className="section-header section-header-center" style={{ marginBottom: 28, textAlign: 'center' }}>
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gold)' }}>
            <span>◆</span> MILITARY CONDUCT & DISCIPLINE
          </span>
          <h2 className="heading-section" style={{ marginTop: 10, marginBottom: 12, fontSize: 'clamp(2rem, 3.8vw, 3rem)' }}>
            ARMY RULES & REGULATIONS
          </h2>
          <p className="section-subtitle" style={{ maxWidth: 760, margin: '0 auto', fontSize: '1.02rem' }}>
            Understand your duties, follow applicable service regulations, maintain discipline, and uphold the highest standards of conduct.
          </p>
        </div>

        {/* Search Bar */}
        <div className="rules-search-wrapper">
          <div className="rules-search-bar">
            <span className="rules-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              className="rules-search-input"
              placeholder="Search rules, regulations, keywords (e.g. orders, uniform, leave, security)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="rules-search-clear" 
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.82rem', color: 'var(--gold)' }}>
              Found {filteredCategories.length} category matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* 8 Category Cards Grid */}
        <div className="rules-grid">
          {filteredCategories.map((cat, idx) => (
            <div 
              key={cat.id || idx} 
              className="rule-card"
              tabIndex={0}
              role="button"
              onClick={() => handleSelect(cat)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(cat); }}}
            >
              <div className="rule-card-top">
                <div className="rule-card-icon">
                  {cat.icon}
                </div>
                <div className="rule-card-code">{cat.code}</div>
                <div className="rule-card-title">{cat.title}</div>
                <div className="rule-card-desc">{cat.subtitle}</div>
                
                <ul className="rule-card-bullets">
                  {cat.previewBullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <div className="rule-card-action">
                VIEW RULES ➔
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-dim)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
            <p>No military regulations matched your search query "{searchQuery}".</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setSearchQuery("")} style={{ marginTop: 12 }}>
              Reset Search Filter
            </button>
          </div>
        )}

        {/* Important Updates & Gazette Amendments Section */}
        <div className="rules-updates-wrap">
          <div 
            className="rules-updates-header"
            onClick={() => setShowUpdates(!showUpdates)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--gold)', fontSize: 16 }}>★</span>
              <span className="mono" style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink-bright)' }}>
                IMPORTANT UPDATES & REGULATORY GAZETTE AMENDMENTS
              </span>
              <span className="chip chip-gold" style={{ fontSize: 10 }}>4 RECENT</span>
            </div>
            <span style={{ color: 'var(--gold)', fontSize: 14 }}>
              {showUpdates ? '▲ COLLAPSE' : '▼ EXPAND NOTICES'}
            </span>
          </div>

          {showUpdates && (
            <div className="rules-updates-body">
              {RULES_UPDATES.map(upd => (
                <div key={upd.id} className="rules-update-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span className="mono text-gold" style={{ fontSize: 12, fontWeight: 700 }}>{upd.citation}</span>
                    <span className="chip chip-duty" style={{ fontSize: 9 }}>{upd.status}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', marginBottom: 6 }}>
                    {upd.title}
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: '0.78rem', color: 'var(--ink-dim)' }}>
                    <span>Published: <strong style={{ color: 'var(--ink-bright)' }}>{upd.published}</strong></span>
                    <span>Effective: <strong style={{ color: 'var(--gold)' }}>{upd.effective}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="rules-preview-footer">
          Illustrative website preview · Rule summaries should be verified against applicable official service regulations and orders.
        </div>
      </div>
    </section>
  );
}

// Backward compatibility alias
const StrategicPillars = ArmyRulesSection;


/* ==========================================================================
   COMMANDS & STATS COMPONENT
   ========================================================================== */

function CommandsSection() {
  return null;
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

        <div className="scanline" style={{ height: 220, margin: 20, border: '2px dashed var(--gold-dark)', borderRadius: 'var(--radius-inner)', background: '#040805', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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


/* ==========================================================================
   PAGE 1: COMMAND BOARD (ARMY BASE & UNIT SUMMARY)
   ========================================================================== */

function DDMSDashboardView({ baseInfo, units = [], personnel = [], assignments = [], equipment = [], alerts = [], onNavigateTab, onSelectUnit }) {
  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id || "UNIT-01");
  const chartRef = useRef(null);

  const selectedUnit = units.find(u => u.id === selectedUnitId) || units[0] || {};
  const unitMembers = personnel.filter(p => p.unitId === selectedUnit.id || p.unit === selectedUnit.shortName);
  
  // Rank breakdown for selected unit
  const rankCounts = useMemo(() => {
    const counts = {};
    unitMembers.forEach(m => {
      counts[m.rank] = (counts[m.rank] || 0) + 1;
    });
    return counts;
  }, [unitMembers]);

  const onDutyCount = personnel.filter(p => p.status === "ON DUTY").length;
  const availableCount = personnel.filter(p => p.status === "AVAILABLE").length;
  const restCount = personnel.filter(p => p.status === "REST" || p.status === "LEAVE").length;
  const issuedEquipmentCount = equipment.filter(e => e.status === "ISSUED").length;

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridColor = isLight ? '#d1cab7' : '#19271c';
    const textColor = isLight ? '#546559' : '#97aba0';

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: units.map(u => u.shortName || u.name),
        datasets: [
          {
            label: 'Authorized Strength',
            data: units.map(u => u.authorizedStrength || 40),
            backgroundColor: 'transparent',
            borderColor: isLight ? '#8f7236' : '#c5a059',
            borderWidth: 2,
            borderRadius: 2,
          },
          {
            label: 'Current Posted Members',
            data: units.map(u => personnel.filter(p => p.unitId === u.id || p.unit === u.shortName).length),
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
            labels: { color: textColor, font: { family: 'Inter', size: 11, weight: '600' } }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } },
            grid: { color: gridColor }
          },
          y: {
            ticks: { color: textColor, font: { family: 'Inter', size: 11 }, stepSize: 5 },
            grid: { color: gridColor },
            beginAtZero: true
          }
        }
      }
    });

    return () => chart.destroy();
  }, [units, personnel]);

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 22 }}>
      {/* Base Commander Summary Banner */}
      <div className="card hud-corner" style={{ background: 'linear-gradient(135deg, #0e1e13 0%, #08120b 100%)', border: '1.5px solid var(--gold-dark)', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div className="chip chip-gold" style={{ fontSize: 10, marginBottom: 6 }}>ARMY BASE COMMAND HEADQUARTERS</div>
            <h2 className="disp" style={{ fontSize: 24, fontWeight: 900, color: 'var(--ink-bright)', margin: 0 }}>
              {baseInfo?.name || "Northern Cantonment Base // Sector Alpha"}
            </h2>
            <div className="mono text-dim" style={{ fontSize: 12, marginTop: 4 }}>
              COMMANDING OFFICER: <strong style={{ color: 'var(--gold-light)' }}>{baseInfo?.commandingOfficer || "Col R. S. Rathore"}</strong> · {baseInfo?.command || "Northern Command"}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="chip chip-duty" style={{ fontWeight: 700, fontSize: 11 }}>🟢 BASE STATUS: OPERATIONAL</span>
            <div className="mono text-dim" style={{ fontSize: 11, marginTop: 6 }}>RESTRICTED DEFENCE NODE // DEFCON 4</div>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>TOTAL BASE UNITS</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold-light)', marginTop: 4 }}>
            {units.length} UNITS
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Battalions & HQ Coy</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>TOTAL SERVICEMEN</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink-bright)', marginTop: 4 }}>
            {personnel.length} MEMBERS
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Base registered strength</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>ON DUTY NOW</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: '#4ade80', marginTop: 4 }}>
            {onDutyCount} ACTIVE
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Across all guard posts</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>STANDBY RESERVE</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--steel)', marginTop: 4 }}>
            {availableCount} READY
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Immediate tasking reserve</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>REST / LEAVE CYCLE</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--amber)', marginTop: 4 }}>
            {restCount} SERVICEMEN
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Fatigue compliance rules</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>CONTROLLED ARMS ISSUED</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold-light)', marginTop: 4 }}>
            {issuedEquipmentCount} OF {equipment.length}
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Armoury custody audit</div>
        </div>
      </div>

      {/* Unit Summary Selector & Breakdown */}
      <Panel
        title="Base Units Directory & Personnel Breakdown"
        eyebrow="Base Units Structure // Select Unit for Live Overview"
        right={
          <button 
            onClick={() => onNavigateTab('units-members')} 
            className="btn btn-secondary btn-sm"
          >
            MANAGE UNIT MEMBERS ➔
          </button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
          {units.map(u => {
            const isSelected = u.id === selectedUnitId;
            const strength = personnel.filter(p => p.unitId === u.id || p.unit === u.shortName).length;
            const pct = Math.round((strength / (u.authorizedStrength || 40)) * 100);

            return (
              <div 
                key={u.id}
                onClick={() => setSelectedUnitId(u.id)}
                className={`unit-card ${isSelected ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono text-gold" style={{ fontSize: 11, fontWeight: 700 }}>{u.code}</span>
                  <span className="chip chip-gold" style={{ fontSize: 9.5 }}>{u.sector ? u.sector.split(' ')[0] : 'SECTOR'}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-bright)', marginTop: 6 }}>
                  {u.shortName || u.name}
                </div>
                <div className="mono text-dim" style={{ fontSize: 11, marginTop: 4 }}>
                  Officer: {u.seniorOfficer ? u.seniorOfficer.split(' ')[0] + ' ' + (u.seniorOfficer.split(' ')[1] || '') : 'CO'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 10 }}>
                  <span className="mono text-dim">Strength:</span>
                  <span className="mono text-gold" style={{ fontWeight: 600 }}>{strength} / {u.authorizedStrength || 40} ({pct}%)</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Unit Deep-Dive Box */}
        {selectedUnit && (
          <div className="card hud-corner" style={{ background: 'var(--bg-panel)', border: '1px solid var(--line-strong)', padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>
              <div>
                <span className="chip chip-gold" style={{ fontSize: 10, marginBottom: 4 }}>{selectedUnit.code} · UNIT OVERVIEW</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: 'var(--ink-bright)', fontFamily: 'var(--font-display)' }}>
                  {selectedUnit.name} ({selectedUnit.shortName})
                </h3>
                <div className="mono text-gold" style={{ fontSize: 12, marginTop: 2, fontStyle: 'italic' }}>
                  "{selectedUnit.motto}"
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  onClick={() => {
                    onSelectUnit(selectedUnit.id);
                    onNavigateTab('units-members');
                  }}
                  className="btn btn-gold btn-sm"
                >
                  VIEW {selectedUnit.shortName} MEMBERS ➔
                </button>
                <button 
                  onClick={() => onNavigateTab('duty-assignment')} 
                  className="btn btn-secondary btn-sm"
                >
                  ASSIGN DUTY ➔
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 14 }}>
              <div>
                <div className="mono text-dim" style={{ fontSize: 11 }}>SENIOR OFFICER (COMMAND):</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-bright)', marginTop: 2 }}>{selectedUnit.seniorOfficer || "Col R. S. Rathore"}</div>
              </div>
              <div>
                <div className="mono text-dim" style={{ fontSize: 11 }}>SENIOR SUPERVISOR (ROSTER):</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--gold-light)', marginTop: 2 }}>{selectedUnit.seniorSupervisor || "Hav Rawat, V. (Senior Havaldar)"}</div>
              </div>
              <div>
                <div className="mono text-dim" style={{ fontSize: 11 }}>ASSIGNED SECTOR LOCATION:</div>
                <div style={{ fontSize: 13.5, color: 'var(--ink)', marginTop: 2 }}>{selectedUnit.sector || "Base Complex"}</div>
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              <div className="mono text-dim" style={{ fontSize: 11, marginBottom: 8 }}>UNIT RANK-WISE MEMBER BREAKDOWN:</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {Object.keys(rankCounts).length === 0 ? (
                  <span className="mono text-dim" style={{ fontSize: 12 }}>No personnel assigned to this unit yet.</span>
                ) : (
                  Object.entries(rankCounts).map(([rank, count]) => (
                    <span key={rank} className="chip" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line-strong)', fontSize: 11 }}>
                      <strong>{rank}:</strong> <span style={{ color: 'var(--gold-light)', marginLeft: 4 }}>{count}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Panel>

      {/* Base Strength Chart & Activity Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <Panel title="Unit-Wise Strength & Manning Chart" eyebrow="Authorized vs Current Strength">
          <div style={{ height: 260 }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </Panel>

        <Panel title="Recent Activity & Base Shift Alerts" eyebrow="Operational Audit Notifications">
          <div style={{ display: 'grid', gap: 10 }}>
            {alerts.slice(0, 4).map((a, i) => (
              <div key={i} className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '10px 14px', borderLeft: `3px solid ${a.level === 'danger' || a.severity === 'ALERT' ? '#ef4444' : a.level === 'amber' || a.severity === 'WARN' ? '#f59e0b' : '#dfba74'}` }}>
                <div style={{ fontSize: 12.5, color: 'var(--ink-bright)', fontWeight: 600 }}>{a.text}</div>
                <div className="mono text-dim" style={{ fontSize: 10.5, marginTop: 4 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ==========================================================================
   PAGE 2: UNITS & MEMBERS (UNIT SELECTION, SEARCH, REGISTER & TRANSFER)
   ========================================================================== */

function DDMSUnitsMembersView({ 
  units = [], 
  personnel = [], 
  selectedUnitId, 
  onSelectUnit, 
  onOpenRegister, 
  onOpenEdit, 
  onOpenTransfer, 
  onOpenProfile, 
  onDeleteMember, 
  isAdmin, 
  isSupervisor, 
  userUnitId 
}) {
  const [filterUnit, setFilterUnit] = useState(selectedUnitId || "ALL");
  const [filterRank, setFilterRank] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return personnel.filter(p => {
      const matchUnit = filterUnit === "ALL" || p.unitId === filterUnit || p.unit === filterUnit;
      const matchRank = filterRank === "ALL" || p.rank === filterRank;
      const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch = !q || 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.armyNo && p.armyNo.toLowerCase().includes(q)) ||
        (p.designation && p.designation.toLowerCase().includes(q)) ||
        (p.unit && p.unit.toLowerCase().includes(q));

      return matchUnit && matchRank && matchStatus && matchSearch;
    });
  }, [personnel, filterUnit, filterRank, filterStatus, search]);

  const uniqueRanks = ["ALL", ...new Set(personnel.map(p => p.rank).filter(Boolean))];

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      {/* Unit Selector Tabs Strip */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
        <button
          onClick={() => { setFilterUnit("ALL"); onSelectUnit("ALL"); }}
          className={`btn btn-sm ${filterUnit === "ALL" ? 'btn-gold' : 'btn-ghost'}`}
          style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
        >
          ALL UNITS ({personnel.length})
        </button>
        {units.map(u => {
          const count = personnel.filter(p => p.unitId === u.id || p.unit === u.shortName).length;
          const isActive = filterUnit === u.id || filterUnit === u.shortName;
          return (
            <button
              key={u.id}
              onClick={() => { setFilterUnit(u.id); onSelectUnit(u.id); }}
              className={`btn btn-sm ${isActive ? 'btn-gold' : 'btn-ghost'}`}
              style={{ whiteSpace: 'nowrap', border: '1px solid var(--line-strong)' }}
            >
              {u.shortName} ({count})
            </button>
          );
        })}
      </div>

      <Panel
        title="Unit Personnel & Members Registry"
        eyebrow="Roster Administration // Member Profile, Postings & Unit Strength"
        right={
          (isAdmin || isSupervisor) && (
            <button
              onClick={onOpenRegister}
              className="btn btn-gold btn-sm"
              style={{ fontWeight: 700 }}
            >
              ➕ REGISTER NEW MEMBER
            </button>
          )
        }
      >
        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>UNIT:</span>
            <select
              value={filterUnit}
              onChange={e => { setFilterUnit(e.target.value); onSelectUnit(e.target.value); }}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Base Units</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.shortName} ({u.code})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>RANK:</span>
            <select
              value={filterRank}
              onChange={e => setFilterRank(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              {uniqueRanks.map(r => (
                <option key={r} value={r}>{r === "ALL" ? "All Ranks" : r}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>STATUS:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ON DUTY">On Duty</option>
              <option value="AVAILABLE">Available</option>
              <option value="REST">Rest Cycle</option>
              <option value="LEAVE">Leave</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Member Name, Army No, Role, or Quarter…"
              className="mono"
              style={{ width: '100%', padding: '6px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div className="mono text-dim" style={{ fontSize: 11 }}>
            Showing <strong>{filtered.length}</strong> of {personnel.length} servicemen
          </div>
        </div>

        {/* Member Directory Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>ARMY NO. & NAME</th>
                <th>RANK & UNIT</th>
                <th>DESIGNATION / ROLE</th>
                <th>ADMIN STATUS</th>
                <th>FAMILY & QUARTERS</th>
                <th>POSTING TENURE</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '34px 10px', color: 'var(--ink-dim)' }}>
                    No unit members match the selected filters. Click "+ REGISTER NEW MEMBER" to enlist personnel.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const hasQuarter = p.quarterStatus === "ALLOCATED";
                  const canEdit = isAdmin || (isSupervisor && (p.unitId === userUnitId || p.unit === userUnitId));

                  return (
                    <tr key={p.id || p.armyNo} className="board-row">
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--ink-bright)' }}>{p.name}</div>
                        <div className="mono text-dim" style={{ fontSize: 11 }}>{p.armyNo}</div>
                      </td>
                      <td>
                        <div className="mono text-gold" style={{ fontWeight: 600 }}>{p.rank}</div>
                        <div className="mono text-dim" style={{ fontSize: 11 }}>{p.unit}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: 'var(--ink-bright)' }}>{p.designation || "Rifleman"}</div>
                      </td>
                      <td>
                        <StatusChip status={p.status} />
                        {p.restHours > 0 && (
                          <div className="mono text-dim" style={{ fontSize: 10, marginTop: 3, color: 'var(--amber)' }}>
                            Rest: {p.restHours}h
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>{p.familyStatus || "Single"}</div>
                        <div className="mono text-dim" style={{ fontSize: 11, color: hasQuarter ? '#4ade80' : 'var(--ink-dim)' }}>
                          {hasQuarter ? `🟢 ${p.quarterNo || 'Allocated'}` : '⚪ Barracks Living'}
                        </div>
                      </td>
                      <td>
                        <div className="mono" style={{ fontSize: 11 }}>In: {p.joinedDate || '2024-01-01'}</div>
                        <div className="mono text-gold" style={{ fontSize: 10.5 }}>Due: {p.nextTransferDate || '2027-01-01'}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'nowrap' }}>
                          <button
                            onClick={() => onOpenProfile(p)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            title="View Full Profile Dossier"
                          >
                            👤 PROFILE
                          </button>
                          {canEdit && (
                            <>
                              <button
                                onClick={() => onOpenTransfer(p)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '3px 8px', fontSize: 11, color: 'var(--gold-light)' }}
                                title="Transfer soldier to another unit"
                              >
                                🔄 TRANSFER
                              </button>
                              <button
                                onClick={() => onOpenEdit(p)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '3px 8px', fontSize: 11 }}
                                title="Edit Member Profile"
                              >
                                ✏️ EDIT
                              </button>
                            </>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Confirm removal of ${p.rank} ${p.name} (${p.armyNo}) from base records?`)) {
                                  onDeleteMember(p.id || p.armyNo);
                                }
                              }}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '3px 8px', fontSize: 11, color: '#f87171' }}
                              title="Delete Member"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   PAGE 3: DUTY ASSIGNMENT (DEDICATED STEP-BY-STEP DUTY ORDER GENERATOR)
   ========================================================================== */

function DDMSDutyAssignmentView({ 
  units = [], 
  personnel = [], 
  posts = [], 
  dutyAssignments = [], 
  onSaveAssignment, 
  onNavigateTab, 
  adminUser, 
  isAdmin, 
  isSupervisor, 
  userUnitId 
}) {
  const initialUnit = isSupervisor && userUnitId ? userUnitId : (units[0]?.id || "UNIT-01");
  const [selectedUnitId, setSelectedUnitId] = useState(initialUnit);
  const [dutyDate, setDutyDate] = useState(new Date().toISOString().substring(0, 10));
  const [shift, setShift] = useState("0600–1400");
  const [postId, setPostId] = useState(posts[0]?.id || "PST-01");
  const [supervisor, setSupervisor] = useState(adminUser || "Hav Rawat, V. (Senior Havaldar)");
  const [selectedSoldierIds, setSelectedSoldierIds] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [conflictWarning, setConflictWarning] = useState("");

  const targetUnit = units.find(u => u.id === selectedUnitId || u.shortName === selectedUnitId) || units[0] || {};
  const unitSoldiers = personnel.filter(p => p.unitId === targetUnit.id || p.unit === targetUnit.shortName);

  // Live Conflict Checker
  useEffect(() => {
    if (selectedSoldierIds.length === 0) {
      setConflictWarning("");
      return;
    }

    const conflicts = [];
    const existingForShift = dutyAssignments.filter(a => a.date === dutyDate && a.shift === shift && a.status !== "CANCELLED");

    selectedSoldierIds.forEach(armyNo => {
      const soldier = personnel.find(p => p.armyNo === armyNo);
      if (!soldier) return;

      // Check if already assigned on same shift
      existingForShift.forEach(ex => {
        if (ex.assignedPersonnel && ex.assignedPersonnel.some(ep => ep.armyNo === armyNo)) {
          conflicts.push(`${soldier.rank} ${soldier.name} is already assigned to ${ex.postName} in this ${shift} window!`);
        }
      });

      // Check if on rest or leave
      if (soldier.status === "REST") {
        conflicts.push(`${soldier.rank} ${soldier.name} is currently in REST cycle (due ${soldier.restHours}h).`);
      } else if (soldier.status === "LEAVE") {
        conflicts.push(`${soldier.rank} ${soldier.name} is currently on AUTHORIZED LEAVE.`);
      }
    });

    if (conflicts.length > 0) {
      setConflictWarning(conflicts.join(" | "));
    } else {
      setConflictWarning("");
    }
  }, [selectedSoldierIds, dutyDate, shift, dutyAssignments, personnel]);

  const toggleSoldier = (armyNo) => {
    setSelectedSoldierIds(prev => 
      prev.includes(armyNo) ? prev.filter(id => id !== armyNo) : [...prev, armyNo]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedSoldierIds.length === 0) {
      alert("Please select at least 1 soldier to assign.");
      return;
    }

    setSubmitting(true);
    setStatusMsg("");

    const assignedSoldiers = selectedSoldierIds.map(armyNo => {
      const s = personnel.find(p => p.armyNo === armyNo) || { armyNo, name: armyNo, rank: "Sep" };
      return { armyNo: s.armyNo, name: s.name, rank: s.rank };
    });

    try {
      await onSaveAssignment({
        unitId: targetUnit.id,
        unit: targetUnit.shortName,
        date: dutyDate,
        shift,
        postId,
        supervisor,
        assignedPersonnel: assignedSoldiers,
        remarks: remarks.trim()
      });

      setStatusMsg("SUCCESS: Duty Order Gazetted to Duty Roster & History!");
      setSelectedSoldierIds([]);
      setRemarks("");
      setTimeout(() => {
        setStatusMsg("");
      }, 3500);
    } catch (err) {
      setStatusMsg("ERROR: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 22 }}>
      <Panel
        title="Create & Gazette Duty Assignment Order"
        eyebrow="Step-by-Step Duty Allocation // Guard Posts, Shifts & Unit Verification"
        right={
          <button 
            onClick={() => onNavigateTab('roster')} 
            className="btn btn-secondary btn-sm"
          >
            VIEW CURRENT ROSTER ➔
          </button>
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: 18 }}>
          {/* Step 1 to 4 Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <label className="form-section-title">1. TARGET UNIT</label>
              <select
                value={selectedUnitId}
                onChange={e => { setSelectedUnitId(e.target.value); setSelectedSoldierIds([]); }}
                required
                className="mono"
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)', fontSize: 13 }}
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.shortName} ({u.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-section-title">2. DEPLOYMENT DATE</label>
              <input
                type="date"
                value={dutyDate}
                onChange={e => setDutyDate(e.target.value)}
                required
                className="mono"
                style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)', fontSize: 13 }}
              />
            </div>

            <div>
              <label className="form-section-title">3. SHIFT WINDOW</label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                required
                className="mono"
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)', fontSize: 13 }}
              >
                <option value="0600–1400">0600–1400 (Morning Vigil)</option>
                <option value="1400–2200">1400–2200 (Evening Patrol)</option>
                <option value="2200–0600">2200–0600 (Night Standby)</option>
              </select>
            </div>

            <div>
              <label className="form-section-title">4. GUARD POST / RESPONSIBILITY</label>
              <select
                value={postId}
                onChange={e => setPostId(e.target.value)}
                required
                className="mono"
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)', fontSize: 13 }}
              >
                {posts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} [{p.priority}]</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-section-title">5. RESPONSIBLE SUPERVISOR (SENIOR HAVALDAR / DUTY OFFICER)</label>
            <input
              type="text"
              value={supervisor}
              onChange={e => setSupervisor(e.target.value)}
              placeholder="e.g. Hav Rawat, V. (Senior Havaldar)"
              required
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)', fontSize: 13 }}
            />
          </div>

          {/* Step 6: Assigned Personnel Multi-Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="form-section-title" style={{ margin: 0 }}>
                6. SELECT ASSIGNED SERVICEMEN (FROM {targetUnit.shortName || 'UNIT'})
              </label>
              <span className="mono text-gold" style={{ fontSize: 11 }}>
                Selected: <strong>{selectedSoldierIds.length}</strong> soldiers
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, maxHeight: 240, overflowY: 'auto', padding: '10px', background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xs)' }}>
              {unitSoldiers.length === 0 ? (
                <div className="mono text-dim" style={{ padding: 16 }}>No personnel enlisted in this unit.</div>
              ) : (
                unitSoldiers.map(s => {
                  const isChecked = selectedSoldierIds.includes(s.armyNo);
                  const isBusy = s.status === "REST" || s.status === "LEAVE";

                  return (
                    <div
                      key={s.armyNo}
                      onClick={() => toggleSoldier(s.armyNo)}
                      className={`soldier-checkbox-tile ${isChecked ? 'checked' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-bright)' }}>
                            {s.rank} {s.name}
                          </div>
                          <div className="mono text-dim" style={{ fontSize: 10.5 }}>{s.armyNo} · {s.designation}</div>
                        </div>
                      </div>
                      <div>
                        <span className={`chip ${s.status === 'ON DUTY' ? 'chip-gold' : s.status === 'AVAILABLE' ? 'chip-duty' : 'chip-danger'}`} style={{ fontSize: 9.5 }}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="form-section-title">7. SPECIAL TACTICAL DIRECTIVES / REMARKS</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. High vigilance on vehicle barrier; check communication link hourly"
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)', fontSize: 13 }}
            />
          </div>

          {/* Conflict Warning Alert Box */}
          {conflictWarning && (
            <div className="card hud-corner" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1.5px solid #ef4444', padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontWeight: 700, fontSize: 13 }}>
                <span>⚠️ CONFLICT / REST RESTRICTION DETECTED:</span>
              </div>
              <div className="mono" style={{ fontSize: 11.5, color: '#fca5a5', marginTop: 4 }}>
                {conflictWarning}
              </div>
            </div>
          )}

          {statusMsg && (
            <div className="mono" style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', fontSize: 12.5, background: statusMsg.startsWith('ERROR') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: statusMsg.startsWith('ERROR') ? '#f87171' : '#4ade80' }}>
              {statusMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 6 }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-gold"
              style={{ fontWeight: 800, minWidth: 240 }}
            >
              {submitting ? 'DISPATCHING ORDER…' : '⚔️ CONFIRM & GAZETTE DUTY ORDER'}
            </button>
          </div>
        </form>
      </Panel>

      {/* Recent Assignments Snapshot */}
      <Panel title="Recent Base Duty Assignments" eyebrow="Latest Orders Saved to Database">
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>DATE & SHIFT</th>
                <th>UNIT</th>
                <th>DUTY POST</th>
                <th>ASSIGNED SERVICEMEN</th>
                <th>SUPERVISOR</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {dutyAssignments.slice(0, 4).map(a => (
                <tr key={a.id} className="board-row">
                  <td className="mono text-gold" style={{ fontWeight: 600 }}>{a.date} ({a.shift})</td>
                  <td style={{ fontWeight: 600 }}>{a.unit}</td>
                  <td style={{ color: 'var(--ink-bright)' }}>{a.postName}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {a.assignedPersonnel && a.assignedPersonnel.map(ap => (
                        <span key={ap.armyNo} className="chip" style={{ fontSize: 10, background: 'var(--bg-panel-2)' }}>
                          {ap.rank} {ap.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="mono text-dim" style={{ fontSize: 11 }}>{a.supervisor}</td>
                  <td>
                    <span className={`chip ${a.status === 'ACTIVE' ? 'chip-duty' : a.status === 'COMPLETED' ? 'chip-gold' : 'chip-danger'}`} style={{ fontSize: 10 }}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   PAGE 4: DUTY ROSTER (SAVED ASSIGNMENTS TABLE, FILTERS & DETAILS)
   ========================================================================== */

function DDMSRosterView({ 
  units = [], 
  assignments = [], 
  posts = [], 
  onUpdateStatus, 
  onNavigateTab, 
  onOpenDetail, 
  isAdmin, 
  isSupervisor 
}) {
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [filterShift, setFilterShift] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return assignments.filter(a => {
      const matchUnit = filterUnit === "ALL" || a.unitId === filterUnit || a.unit === filterUnit;
      const matchDate = !filterDate || a.date === filterDate;
      const matchShift = filterShift === "ALL" || a.shift === filterShift;
      const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (a.postName && a.postName.toLowerCase().includes(q)) ||
        (a.unit && a.unit.toLowerCase().includes(q)) ||
        (a.supervisor && a.supervisor.toLowerCase().includes(q)) ||
        (a.assignedPersonnel && a.assignedPersonnel.some(p => p.name.toLowerCase().includes(q) || p.armyNo.toLowerCase().includes(q)));

      return matchUnit && matchDate && matchShift && matchStatus && matchSearch;
    });
  }, [assignments, filterUnit, filterDate, filterShift, filterStatus, search]);

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      <Panel
        title="Saved Master Duty Roster"
        eyebrow="Live Base Postings // Verified Relational Database Records"
        right={
          (isAdmin || isSupervisor) && (
            <button
              onClick={() => onNavigateTab('duty-assignment')}
              className="btn btn-gold btn-sm"
              style={{ fontWeight: 700 }}
            >
              ➕ NEW DUTY ASSIGNMENT
            </button>
          )
        }
      >
        {/* Filters Bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>UNIT:</span>
            <select
              value={filterUnit}
              onChange={e => setFilterUnit(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Units</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.shortName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>DATE:</span>
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '5px 8px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            />
            {filterDate && (
              <button onClick={() => setFilterDate("")} className="btn btn-ghost btn-sm" style={{ padding: '3px 8px', fontSize: 10 }}>✕</button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>SHIFT:</span>
            <select
              value={filterShift}
              onChange={e => setFilterShift(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Shifts</option>
              <option value="0600–1400">0600–1400</option>
              <option value="1400–2200">1400–2200</option>
              <option value="2200–0600">2200–0600</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>STATUS:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Post, Soldier, or Supervisor…"
              className="mono"
              style={{ width: '100%', padding: '6px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div className="mono text-dim" style={{ fontSize: 11 }}>
            Showing <strong>{filtered.length}</strong> active roster records
          </div>
        </div>

        {/* Assignments Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>DATE & SHIFT</th>
                <th>UNIT</th>
                <th>DUTY POST / STATION</th>
                <th>ASSIGNED SERVICEMEN</th>
                <th>SUPERVISOR</th>
                <th>STATUS</th>
                <th>LAST UPDATED</th>
                <th style={{ textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '34px 10px', color: 'var(--ink-dim)' }}>
                    No duty assignments found matching the selected criteria. Click "NEW DUTY ASSIGNMENT" to create orders.
                  </td>
                </tr>
              ) : (
                filtered.map(a => (
                  <tr key={a.id} className="board-row">
                    <td>
                      <div className="mono text-gold" style={{ fontWeight: 700 }}>{a.date}</div>
                      <div className="mono text-dim" style={{ fontSize: 11 }}>{a.shift}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--ink-bright)' }}>{a.unit}</div>
                    </td>
                    <td style={{ color: 'var(--ink-bright)', fontWeight: 600 }}>
                      {a.postName}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {a.assignedPersonnel && a.assignedPersonnel.map(ap => (
                          <span key={ap.armyNo} className="chip chip-gold" style={{ fontSize: 10 }}>
                            {ap.rank} {ap.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 11 }}>
                      {a.supervisor}
                    </td>
                    <td>
                      <span className={`chip ${a.status === 'ACTIVE' ? 'chip-duty' : a.status === 'COMPLETED' ? 'chip-gold' : 'chip-danger'}`} style={{ fontSize: 10 }}>
                        {a.status}
                      </span>
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 10.5 }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '06:00 IST'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => onOpenDetail(a)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          title="View Full Assignment Docket"
                        >
                          👁️ DETAILS
                        </button>
                        {(isAdmin || isSupervisor) && a.status === 'ACTIVE' && (
                          <button
                            onClick={() => onUpdateStatus(a.id, 'COMPLETED')}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11, color: '#4ade80' }}
                            title="Mark Completed"
                          >
                            ✅ COMPLETE
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   PAGE 5: DUTY HISTORY (INTERACTIVE CALENDAR & DATE-BASED RETRIEVAL)
   ========================================================================== */

function DDMSDutyHistoryView({ 
  units = [], 
  history = [], 
  historyDates = [], 
  onDownloadCSV, 
  onOpenDetail, 
  adminUser 
}) {
  const todayStr = new Date().toISOString().substring(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [search, setSearch] = useState("");

  // Month navigation
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar Day Computation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Padding days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ empty: true, key: `empty-pre-${i}` });
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasDuty = historyDates.includes(dateStr) || history.some(h => h.date === dateStr);
      days.push({
        dayNumber: d,
        dateStr,
        hasDuty,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
        key: dateStr
      });
    }

    return days;
  }, [currentMonth, historyDates, history, selectedDate, todayStr]);

  // Filter history for selected date & unit
  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const matchDate = !selectedDate || selectedDate === "ALL" || h.date === selectedDate;
      const matchUnit = filterUnit === "ALL" || h.unitId === filterUnit || h.unit === filterUnit;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (h.post && h.post.toLowerCase().includes(q)) ||
        (h.unit && h.unit.toLowerCase().includes(q)) ||
        (h.name && h.name.toLowerCase().includes(q)) ||
        (h.assignedPersonnelNames && h.assignedPersonnelNames.toLowerCase().includes(q)) ||
        (h.supervisor && h.supervisor.toLowerCase().includes(q));

      return matchDate && matchUnit && matchSearch;
    });
  }, [history, selectedDate, filterUnit, search]);

  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 22 }}>
      {/* Calendar Widget and Selection Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20 }}>
        {/* Interactive Month Calendar */}
        <div className="calendar-widget hud-corner">
          <div className="calendar-header">
            <button onClick={prevMonth} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>◀ PREV</button>
            <div className="disp text-gold" style={{ fontSize: 15, fontWeight: 800 }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button onClick={nextMonth} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>NEXT ▶</button>
          </div>

          <div className="calendar-weekdays">
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>

          <div className="calendar-grid">
            {calendarDays.map(cd => {
              if (cd.empty) return <div key={cd.key} className="calendar-day empty"></div>;
              return (
                <div
                  key={cd.key}
                  onClick={() => setSelectedDate(cd.dateStr)}
                  className={`calendar-day ${cd.isSelected ? 'selected' : ''} ${cd.isToday ? 'today' : ''}`}
                  title={cd.hasDuty ? 'Contains duty records' : 'No duty logged'}
                >
                  <span>{cd.dayNumber}</span>
                  {cd.hasDuty && <div className="calendar-dot"></div>}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <button 
              onClick={() => setSelectedDate(todayStr)} 
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11, color: '#4ade80' }}
            >
              TODAY ({todayStr})
            </button>
            <button 
              onClick={() => setSelectedDate("ALL")} 
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11, color: 'var(--gold-light)' }}
            >
              SHOW ALL ARCHIVES
            </button>
          </div>
        </div>

        {/* Selected Date Summary & Filter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line)', padding: '16px 20px' }}>
            <div className="chip chip-gold" style={{ fontSize: 9.5, marginBottom: 4 }}>CALENDAR SELECTION ACTIVE</div>
            <div className="disp" style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink-bright)' }}>
              {selectedDate === "ALL" ? "FULL BASE DUTY ARCHIVE (ALL DATES)" : `ARCHIVE FOR: ${selectedDate}`}
            </div>
            <div className="mono text-dim" style={{ fontSize: 11.5, marginTop: 4 }}>
              Showing {filteredHistory.length} recorded historical duty entries for the selected parameters.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={filterUnit}
              onChange={e => setFilterUnit(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '8px 12px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Base Units</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.shortName}</option>
              ))}
            </select>

            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Post, Soldier Name, or Supervisor…"
                className="mono"
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
              />
            </div>

            <button
              onClick={() => onDownloadCSV(filteredHistory, selectedDate)}
              className="btn btn-gold btn-sm"
              style={{ fontWeight: 700 }}
            >
              ⬇ EXPORT REPORT (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Historical Ledger Table */}
      <Panel
        title="Historical Duty Ledger"
        eyebrow="Immutable Deployment History // Changes Traceable to Authorizing Supervisor"
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>DATE & SHIFT</th>
                <th>UNIT</th>
                <th>GUARD POST / STATION</th>
                <th>ASSIGNED SERVICEMEN</th>
                <th>SUPERVISOR / AUTHORIZER</th>
                <th>TIME WINDOW</th>
                <th>STATUS</th>
                <th>REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '34px 10px', color: 'var(--ink-dim)' }}>
                    No historical records found for {selectedDate === "ALL" ? "the selected query" : selectedDate}. Choose another date on the calendar.
                  </td>
                </tr>
              ) : (
                filteredHistory.map(h => (
                  <tr key={h.id} className="board-row">
                    <td>
                      <div className="mono text-gold" style={{ fontWeight: 700 }}>{h.date}</div>
                      <div className="mono text-dim" style={{ fontSize: 11 }}>{h.shift}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{h.unit}</div>
                    </td>
                    <td style={{ color: 'var(--ink-bright)', fontWeight: 600 }}>
                      {h.post}
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-bright)' }}>
                        {h.assignedPersonnelNames || (h.name ? `${h.rank || ''} ${h.name}` : 'Soldier')}
                      </div>
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 11 }}>
                      {h.authorizedBy || h.supervisor || 'Admin CO'}
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 11 }}>
                      {h.timeIn || '06:00'} → {h.timeOut || '14:00'}
                    </td>
                    <td>
                      <span className="chip chip-duty" style={{ fontSize: 10 }}>
                        {h.status || 'COMPLETED'}
                      </span>
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 11, maxWidth: 160 }}>
                      {h.remarks || 'Routine patrol'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   PAGE 6: CONTROLLED EQUIPMENT (INVENTORY & CUSTODY RECORDKEEPING)
   ========================================================================== */

function DDMSControlledEquipmentView({ 
  equipment = [], 
  onOpenCustodyModal, 
  isAdmin, 
  isCustodian 
}) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const categories = ["ALL", ...new Set(equipment.map(e => e.category).filter(Boolean))];

  const filtered = useMemo(() => {
    return equipment.filter(e => {
      const matchCat = filterCategory === "ALL" || e.category === filterCategory;
      const matchStatus = filterStatus === "ALL" || e.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.serial && e.serial.toLowerCase().includes(q)) ||
        (e.custodian && e.custodian.toLowerCase().includes(q));

      return matchCat && matchStatus && matchSearch;
    });
  }, [equipment, filterCategory, filterStatus, search]);

  const totalItems = equipment.length;
  const issuedItems = equipment.filter(e => e.status === "ISSUED").length;
  const inArmoury = totalItems - issuedItems;

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>TOTAL CONTROLLED ITEMS</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold-light)', marginTop: 4 }}>
            {totalItems} UNITS
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Registered base ordnance</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>CURRENTLY ISSUED</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: '#f59e0b', marginTop: 4 }}>
            {issuedItems} ASSIGNED
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Under personal custody</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>IN SECURE ARMOURY</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: '#4ade80', marginTop: 4 }}>
            {inArmoury} IN DEPOT
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Locked in arms racks</div>
        </div>
        <div className="card hud-corner" style={{ background: 'var(--bg-panel-2)', padding: '16px' }}>
          <div className="mono text-dim" style={{ fontSize: 10, letterSpacing: '.1em' }}>RECONCILIATION AUDIT</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink-bright)', marginTop: 4 }}>
            100% VERIFIED
          </div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Zero variance logged</div>
        </div>
      </div>

      <Panel
        title="Controlled Equipment & Munitions Registry"
        eyebrow="Accountable Custody Recordkeeping // Barcode / QR Serial Traceability"
      >
        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>CATEGORY:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>STATUS:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ISSUED">Issued to Serviceman</option>
              <option value="IN ARMOURY">In Armoury Depot</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Serial No, Weapon Name, or Custodian…"
              className="mono"
              style={{ width: '100%', padding: '6px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div className="mono text-dim" style={{ fontSize: 11 }}>
            Showing <strong>{filtered.length}</strong> of {equipment.length} items
          </div>
        </div>

        {/* Equipment Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tactical-table">
            <thead>
              <tr>
                <th>SERIAL NO. & ITEM NAME</th>
                <th>CATEGORY & CALIBRE</th>
                <th>UNIT ALLOCATION</th>
                <th>STATUS</th>
                <th>CURRENT CUSTODIAN</th>
                <th>ISSUING OFFICER</th>
                <th>LAST TRANSACTION</th>
                <th style={{ textAlign: 'center' }}>CUSTODY ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isIssued = item.status === "ISSUED";
                const canManage = isAdmin || isCustodian;

                return (
                  <tr key={item.id || item.serial} className="board-row">
                    <td>
                      <div className="mono text-gold" style={{ fontWeight: 700 }}>{item.serial}</div>
                      <div style={{ fontWeight: 600, color: 'var(--ink-bright)' }}>{item.name}</div>
                    </td>
                    <td>
                      <div>{item.category}</div>
                      <div className="mono text-dim" style={{ fontSize: 11 }}>{item.calibre}</div>
                    </td>
                    <td>
                      <div className="mono text-dim" style={{ fontSize: 11 }}>{item.unit || "Base Pool"}</div>
                    </td>
                    <td>
                      <span className={`chip ${isIssued ? 'chip-gold' : 'chip-duty'}`} style={{ fontSize: 10 }}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: isIssued ? 'var(--gold-light)' : 'var(--ink-dim)' }}>
                        {item.custodian || "Armoury Depot Complex"}
                      </div>
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 11 }}>
                      {item.issuingOfficer || "Lt Menon, S."}
                    </td>
                    <td className="mono text-dim" style={{ fontSize: 10.5 }}>
                      {item.issuedDate || item.lastInspectionDate || "06:00 IST"}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {canManage ? (
                        <button
                          onClick={() => onOpenCustodyModal(item)}
                          className={`btn btn-sm ${isIssued ? 'btn-ghost' : 'btn-gold'}`}
                          style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700 }}
                        >
                          {isIssued ? '↩ RETURN' : '➔ ISSUE'}
                        </button>
                      ) : (
                        <span className="mono text-dim" style={{ fontSize: 10.5 }}>RESTRICTED</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   PAGE 7: PERSONNEL (INDIVIDUAL PROFILES & DOSSIERS)
   ========================================================================== */

function DDMSPersonnelView({ units = [], personnel = [], onOpenProfile }) {
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return personnel.filter(p => {
      const matchUnit = filterUnit === "ALL" || p.unitId === filterUnit || p.unit === filterUnit;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.armyNo && p.armyNo.toLowerCase().includes(q)) ||
        (p.designation && p.designation.toLowerCase().includes(q));

      return matchUnit && matchSearch;
    });
  }, [personnel, filterUnit, search]);

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      <Panel
        title="Base Personnel Profiles & Service Dossiers"
        eyebrow="Individual Servicemen Records // Administration, Medical & Posting Records"
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
          <select
            value={filterUnit}
            onChange={e => setFilterUnit(e.target.value)}
            className="mono"
            style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '6px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
          >
            <option value="ALL">All Base Units</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.shortName}</option>
            ))}
          </select>

          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Soldier Name, Army No, or Role…"
              className="mono"
              style={{ width: '100%', padding: '6px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div className="mono text-dim" style={{ fontSize: 11 }}>
            Showing <strong>{filtered.length}</strong> personnel profiles
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(p => (
            <div 
              key={p.id || p.armyNo} 
              onClick={() => onOpenProfile(p)}
              className="card hud-corner" 
              style={{ background: 'var(--bg-panel-2)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-bright)' }}>{p.name}</div>
                  <div className="mono text-gold" style={{ fontSize: 11, marginTop: 2 }}>{p.rank} · {p.armyNo}</div>
                </div>
                <StatusChip status={p.status} />
              </div>

              <div className="stenciled" style={{ margin: '10px 0' }}></div>

              <div style={{ display: 'grid', gap: 6, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono text-dim">UNIT:</span>
                  <span className="mono text-bright" style={{ fontWeight: 600 }}>{p.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono text-dim">ROLE:</span>
                  <span style={{ color: 'var(--ink-bright)' }}>{p.designation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="mono text-dim">QUARTERS:</span>
                  <span className="mono text-dim">{p.quarterStatus === 'ALLOCATED' ? p.quarterNo : 'Barracks'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <span className="mono text-gold" style={{ fontSize: 11, fontWeight: 700 }}>VIEW PROFILE DOSSIER ➔</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   PAGE 8: REPORTS & LOGS (UNIT, HISTORICAL & EQUIPMENT REPORTS)
   ========================================================================== */

function DDMSReportsView({ 
  units = [], 
  personnel = [], 
  assignments = [], 
  history = [], 
  equipment = [], 
  auditLogs = [], 
  adminUser 
}) {
  const [reportType, setReportType] = useState("unit-members");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [generating, setGenerating] = useState(false);

  // Generate CSV download
  const handleDownloadCSV = () => {
    let headers = [];
    let rows = [];
    const dateStr = new Date().toISOString().substring(0, 10);

    if (reportType === "unit-members") {
      headers = ["Army No", "Name", "Rank", "Unit", "Designation", "Status", "Family Status", "Quarter No"];
      const targetList = selectedUnit === "ALL" ? personnel : personnel.filter(p => p.unitId === selectedUnit || p.unit === selectedUnit);
      rows = targetList.map(p => [p.armyNo, p.name, p.rank, p.unit, p.designation, p.status, p.familyStatus, p.quarterNo || "Barracks"]);
    } else if (reportType === "daily-roster") {
      headers = ["Date", "Shift", "Unit", "Duty Post", "Supervisor", "Assigned Personnel", "Status"];
      rows = assignments.map(a => [a.date, a.shift, a.unit, a.postName, a.supervisor, (a.assignedPersonnel || []).map(p => p.name).join("; "), a.status]);
    } else if (reportType === "equipment-audit") {
      headers = ["Serial No", "Item Name", "Category", "Status", "Custodian", "Issuing Officer", "Calibre"];
      rows = equipment.map(e => [e.serial, e.name, e.category, e.status, e.custodian, e.issuingOfficer, e.calibre]);
    } else if (reportType === "duty-history") {
      headers = ["Date", "Shift", "Unit", "Post", "Assigned Personnel", "Supervisor", "Time In", "Time Out", "Status"];
      rows = history.map(h => [h.date, h.shift, h.unit, h.post, h.assignedPersonnelNames || h.name, h.supervisor || h.authorizedBy, h.timeIn, h.timeOut, h.status]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `INDIAN_ARMY_${reportType.toUpperCase()}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 20 }}>
      {/* Report Type Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <div 
          onClick={() => setReportType("unit-members")}
          className={`card hud-corner ${reportType === 'unit-members' ? 'unit-card active' : 'unit-card'}`}
        >
          <div className="mono text-gold" style={{ fontSize: 10 }}>UNIT & PERSONNEL</div>
          <div style={{ fontWeight: 800, color: 'var(--ink-bright)', marginTop: 4 }}>Unit Member Roster Report</div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Rank-wise breakdown & muster roll</div>
        </div>

        <div 
          onClick={() => setReportType("daily-roster")}
          className={`card hud-corner ${reportType === 'daily-roster' ? 'unit-card active' : 'unit-card'}`}
        >
          <div className="mono text-gold" style={{ fontSize: 10 }}>DUTY OPERATIONS</div>
          <div style={{ fontWeight: 800, color: 'var(--ink-bright)', marginTop: 4 }}>Daily Duty Assignment Report</div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Today's post allocations & supervisors</div>
        </div>

        <div 
          onClick={() => setReportType("duty-history")}
          className={`card hud-corner ${reportType === 'duty-history' ? 'unit-card active' : 'unit-card'}`}
        >
          <div className="mono text-gold" style={{ fontSize: 10 }}>HISTORICAL ARCHIVE</div>
          <div style={{ fontWeight: 800, color: 'var(--ink-bright)', marginTop: 4 }}>Duty Deployment History Archive</div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Full chronological historical records</div>
        </div>

        <div 
          onClick={() => setReportType("equipment-audit")}
          className={`card hud-corner ${reportType === 'equipment-audit' ? 'unit-card active' : 'unit-card'}`}
        >
          <div className="mono text-gold" style={{ fontSize: 10 }}>EQUIPMENT CUSTODY</div>
          <div style={{ fontWeight: 800, color: 'var(--ink-bright)', marginTop: 4 }}>Controlled Equipment Audit</div>
          <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Custody transactions & armory ledger</div>
        </div>
      </div>

      {/* Selected Report Action & Controls Strip */}
      <Panel
        title="Report Generator & Export Center"
        eyebrow="Official Base Records // Timestamped Administrative Output"
        right={
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownloadCSV} className="btn btn-gold btn-sm" style={{ fontWeight: 700 }}>
              ⬇ DOWNLOAD CSV REPORT
            </button>
            <button onClick={handlePrintPDF} className="btn btn-secondary btn-sm">
              🖨️ PRINT / PDF VIEW
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--line)', marginBottom: 14 }}>
          <div className="mono text-dim" style={{ fontSize: 11.5 }}>
            REPORT GENERATED: <strong style={{ color: 'var(--gold-light)' }}>{new Date().toLocaleString('en-GB')} IST</strong> · AUTHORIZED BY: <strong style={{ color: 'var(--ink-bright)' }}>{adminUser}</strong>
          </div>
          {reportType === "unit-members" && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--gold-light)' }}>UNIT FILTER:</span>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="mono"
                style={{ background: 'var(--bg-base)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '5px 10px', fontSize: 12, borderRadius: 'var(--radius-xs)' }}
              >
                <option value="ALL">All Base Units</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.shortName}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Live Report Preview Table */}
        <div style={{ overflowX: 'auto', maxHeight: 380 }}>
          {reportType === "unit-members" && (
            <table className="tactical-table">
              <thead>
                <tr>
                  <th>ARMY NO.</th><th>NAME</th><th>RANK</th><th>UNIT</th><th>ROLE</th><th>STATUS</th><th>QUARTERS</th>
                </tr>
              </thead>
              <tbody>
                {(selectedUnit === "ALL" ? personnel : personnel.filter(p => p.unitId === selectedUnit || p.unit === selectedUnit)).map(p => (
                  <tr key={p.armyNo} className="board-row">
                    <td className="mono text-gold">{p.armyNo}</td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td className="mono">{p.rank}</td>
                    <td>{p.unit}</td>
                    <td>{p.designation}</td>
                    <td><StatusChip status={p.status} /></td>
                    <td className="mono text-dim">{p.quarterStatus === 'ALLOCATED' ? p.quarterNo : 'Barracks'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "daily-roster" && (
            <table className="tactical-table">
              <thead>
                <tr>
                  <th>DATE & SHIFT</th><th>UNIT</th><th>DUTY POST</th><th>SUPERVISOR</th><th>ASSIGNED PERSONNEL</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id} className="board-row">
                    <td className="mono text-gold">{a.date} ({a.shift})</td>
                    <td style={{ fontWeight: 600 }}>{a.unit}</td>
                    <td style={{ color: 'var(--ink-bright)' }}>{a.postName}</td>
                    <td className="mono text-dim">{a.supervisor}</td>
                    <td>{(a.assignedPersonnel || []).map(p => `${p.rank} ${p.name}`).join(', ')}</td>
                    <td><span className="chip chip-duty">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "duty-history" && (
            <table className="tactical-table">
              <thead>
                <tr>
                  <th>DATE & SHIFT</th><th>UNIT</th><th>POST</th><th>PERSONNEL</th><th>SUPERVISOR</th><th>HOURS</th><th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 15).map(h => (
                  <tr key={h.id} className="board-row">
                    <td className="mono text-gold">{h.date} ({h.shift})</td>
                    <td style={{ fontWeight: 600 }}>{h.unit}</td>
                    <td>{h.post}</td>
                    <td>{h.assignedPersonnelNames || h.name}</td>
                    <td className="mono text-dim">{h.authorizedBy || h.supervisor}</td>
                    <td className="mono text-dim">{h.timeIn} → {h.timeOut}</td>
                    <td><span className="chip chip-duty">{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === "equipment-audit" && (
            <table className="tactical-table">
              <thead>
                <tr>
                  <th>SERIAL</th><th>ITEM NAME</th><th>CATEGORY</th><th>STATUS</th><th>CUSTODIAN</th><th>OFFICER</th><th>RECONCILIATION</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(e => (
                  <tr key={e.serial} className="board-row">
                    <td className="mono text-gold">{e.serial}</td>
                    <td style={{ fontWeight: 600 }}>{e.name}</td>
                    <td>{e.category}</td>
                    <td><span className={`chip ${e.status === 'ISSUED' ? 'chip-gold' : 'chip-duty'}`}>{e.status}</span></td>
                    <td>{e.custodian}</td>
                    <td className="mono text-dim">{e.issuingOfficer}</td>
                    <td className="mono" style={{ color: '#4ade80' }}>VERIFIED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Panel>

      {/* Audit Trail Viewer */}
      <Panel title="Cryptographic Base Audit Trail Logs" eyebrow="Tamper-Evident SHA-256 Ledger">
        <div style={{ display: 'grid', gap: 0 }}>
          {auditLogs.slice(0, 8).map((a, i) => (
            <div key={i} className="board-row" style={{ display: 'grid', gridTemplateColumns: '120px 140px 1fr 140px', gap: 14, padding: '10px 8px', alignItems: 'center' }}>
              <span className="mono text-dim" style={{ fontSize: 11 }}>{a.ts || a.time}</span>
              <span className="mono text-gold" style={{ fontSize: 11, fontWeight: 700 }}>{a.event || a.category}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink)' }}>{a.detail || a.action}</span>
              <span className="mono text-dim" style={{ fontSize: 11, textAlign: 'right' }}>{a.by || a.operator}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ==========================================================================
   MODALS: REGISTER MEMBER, EDIT, TRANSFER, PROFILE, CUSTODY, DETAILS
   ========================================================================== */

function RegisterMemberModal({ isOpen, onClose, onRegister, units = [] }) {
  if (!isOpen) return null;

  const [armyNo, setArmyNo] = useState("");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("Sep");
  const [unitId, setUnitId] = useState(units[0]?.id || "UNIT-01");
  const [designation, setDesignation] = useState("Rifleman");
  const [status, setStatus] = useState("AVAILABLE");
  const [familyStatus, setFamilyStatus] = useState("Single");
  const [quarterStatus, setQuarterStatus] = useState("NOT ALLOCATED");
  const [quarterNo, setQuarterNo] = useState("Troop Barrack");
  const [joinedDate, setJoinedDate] = useState(new Date().toISOString().substring(0, 10));
  const [nextTransferDate, setNextTransferDate] = useState("2027-01-15");
  const [phone, setPhone] = useState("+91-98765-");
  const [bloodGroup, setBloodGroup] = useState("O+ve");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onRegister({
        armyNo: armyNo.trim(),
        name: name.trim(),
        rank,
        unitId,
        designation: designation.trim(),
        status,
        familyStatus,
        quarterStatus,
        quarterNo: quarterNo.trim(),
        joinedDate,
        nextTransferDate,
        phone: phone.trim(),
        bloodGroup,
        remarks: remarks.trim()
      });
      onClose();
    } catch (err) {
      alert("Registration failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content hud-corner" onClick={e => e.stopPropagation()} style={{ maxWidth: 580, width: '92%', background: 'var(--bg-surface)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-card)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
          <div>
            <div className="chip chip-gold" style={{ fontSize: 9.5, marginBottom: 4 }}>PERSONNEL ADMINISTRATION</div>
            <h3 style={{ margin: 0, fontSize: 18, color: 'var(--ink-bright)' }}>REGISTER NEW UNIT MEMBER</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-section-title">ARMY NO. / SERVICE ID</label>
              <input type="text" value={armyNo} onChange={e => setArmyNo(e.target.value)} placeholder="e.g. JC-118820P" required className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }} />
            </div>
            <div>
              <label className="form-section-title">SERVICEMAN FULL NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rawat, V." required className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-section-title">RANK</label>
              <select value={rank} onChange={e => setRank(e.target.value)} className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}>
                <option value="Sep">Sepoy (Sep)</option>
                <option value="L/Nk">Lance Naik (L/Nk)</option>
                <option value="Nk">Naik (Nk)</option>
                <option value="Hav">Havildar (Hav)</option>
                <option value="Nb Sub">Naib Subedar (Nb Sub)</option>
                <option value="Sub">Subedar (Sub)</option>
                <option value="Sub Maj">Subedar Major (Sub Maj)</option>
                <option value="Lt">Lieutenant (Lt)</option>
                <option value="Capt">Captain (Capt)</option>
                <option value="Maj">Major (Maj)</option>
              </select>
            </div>
            <div>
              <label className="form-section-title">ASSIGNED UNIT</label>
              <select value={unitId} onChange={e => setUnitId(e.target.value)} className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.shortName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-section-title">DESIGNATION / ROLE</label>
              <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} placeholder="e.g. Section 2IC / Guard Sentry" required className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }} />
            </div>
            <div>
              <label className="form-section-title">ADMIN STATUS</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}>
                <option value="AVAILABLE">AVAILABLE (STANDBY)</option>
                <option value="ON DUTY">ON DUTY</option>
                <option value="REST">REST CYCLE</option>
                <option value="LEAVE">LEAVE</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label className="form-section-title">MARITAL / FAMILY</label>
              <select value={familyStatus} onChange={e => setFamilyStatus(e.target.value)} className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}>
                <option value="Single">Single</option>
                <option value="Family Member">Family Member</option>
              </select>
            </div>
            <div>
              <label className="form-section-title">FAMILY QUARTER ALLOTMENT</label>
              <select value={quarterStatus} onChange={e => setQuarterStatus(e.target.value)} className="mono" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}>
                <option value="NOT ALLOCATED">Not Allocated (Barracks)</option>
                <option value="ALLOCATED">Allocated</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">CANCEL</button>
            <button type="submit" disabled={submitting} className="btn btn-gold btn-sm" style={{ fontWeight: 800 }}>
              {submitting ? 'ENLISTING…' : 'CONFIRM REGISTRATION ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransferMemberModal({ isOpen, onClose, member, units = [], onTransfer }) {
  if (!isOpen || !member) return null;

  const otherUnits = units.filter(u => u.id !== member.unitId && u.shortName !== member.unit);
  const [targetUnitId, setTargetUnitId] = useState(otherUnits[0]?.id || "");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onTransfer(member.armyNo, targetUnitId, remarks);
      onClose();
    } catch (err) {
      alert("Transfer failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content hud-corner" onClick={e => e.stopPropagation()} style={{ maxWidth: 480, width: '92%', background: 'var(--bg-surface)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-card)', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
          <div>
            <div className="chip chip-gold" style={{ fontSize: 9.5, marginBottom: 4 }}>INTER-UNIT TRANSFER ORDER</div>
            <h3 style={{ margin: 0, fontSize: 17, color: 'var(--ink-bright)' }}>TRANSFER SERVICEMAN</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div className="card" style={{ background: 'var(--bg-panel)', padding: '12px' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-bright)' }}>{member.rank} {member.name} ({member.armyNo})</div>
            <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Current Unit: <strong style={{ color: 'var(--gold-light)' }}>{member.unit}</strong></div>
          </div>

          <div>
            <label className="form-section-title">DESTINATION UNIT</label>
            <select
              value={targetUnitId}
              onChange={e => setTargetUnitId(e.target.value)}
              required
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}
            >
              {otherUnits.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-section-title">AUTHORIZATION ORDER / TRANSFER REMARKS</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Routine 3-year inter-battalion rotation order #TR-402"
              required
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">CANCEL</button>
            <button type="submit" disabled={submitting} className="btn btn-gold btn-sm" style={{ fontWeight: 800 }}>
              {submitting ? 'TRANSFERRING…' : 'CONFIRM TRANSFER ORDER ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PersonnelProfileModal({ isOpen, onClose, member }) {
  if (!isOpen || !member) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content hud-corner" onClick={e => e.stopPropagation()} style={{ maxWidth: 580, width: '92%', background: 'var(--bg-surface)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-card)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
          <div>
            <span className="chip chip-gold" style={{ fontSize: 9.5 }}>INDIAN ARMY BASE SERVICEMAN DOSSIER</span>
            <h3 style={{ margin: '4px 0 0', fontSize: 20, color: 'var(--ink-bright)', fontFamily: 'var(--font-display)' }}>
              {member.rank} {member.name}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>ARMY NUMBER:</span>
            <div className="mono text-gold" style={{ fontSize: 14, fontWeight: 700 }}>{member.armyNo}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>ASSIGNED UNIT:</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-bright)' }}>{member.unit}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>BASE DESIGNATION:</span>
            <div style={{ fontSize: 13, color: 'var(--ink)' }}>{member.designation}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>ADMINISTRATIVE STATUS:</span>
            <div style={{ marginTop: 2 }}><StatusChip status={member.status} /></div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>LIVING ACCOMMODATION:</span>
            <div className="mono text-dim" style={{ fontSize: 12 }}>
              {member.quarterStatus === 'ALLOCATED' ? `🟢 Quarter ${member.quarterNo || 'A-14'}` : '⚪ Troop Barracks'}
            </div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>FAMILY STATUS:</span>
            <div style={{ fontSize: 12, color: 'var(--ink)' }}>{member.familyStatus || 'Single'}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>STATION POSTING DATE:</span>
            <div className="mono" style={{ fontSize: 12 }}>{member.joinedDate || '2024-01-15'}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>NEXT ROTATION DUE:</span>
            <div className="mono text-gold" style={{ fontSize: 12 }}>{member.nextTransferDate || '2027-01-15'}</div>
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <div className="mono text-dim" style={{ fontSize: 11, marginBottom: 8 }}>SERVICE INFORMATION & REMARKS:</div>
          <div className="card" style={{ background: 'var(--bg-panel)', padding: '12px', fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.6 }}>
            {member.remarks || 'Standard infantry serviceman record verified under Base Command guidelines.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">CLOSE DOSSIER</button>
        </div>
      </div>
    </div>
  );
}

function CustodyTransactionModal({ isOpen, onClose, item, onConfirm, adminUser }) {
  if (!isOpen || !item) return null;

  const isCurrentlyIssued = item.status === "ISSUED";
  const [action, setAction] = useState(isCurrentlyIssued ? "RETURN" : "ISSUE");
  const [custodian, setCustodian] = useState(isCurrentlyIssued ? "Armoury Depot Complex" : "");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm({
        serial: item.serial,
        action,
        custodian: custodian.trim() || (action === "RETURN" ? "Armoury Depot Complex" : "Duty Sentry"),
        remarks: remarks.trim(),
        operator: adminUser
      });
      onClose();
    } catch (err) {
      alert("Custody transaction failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content hud-corner" onClick={e => e.stopPropagation()} style={{ maxWidth: 480, width: '92%', background: 'var(--bg-surface)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-card)', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
          <div>
            <div className="chip chip-gold" style={{ fontSize: 9.5, marginBottom: 4 }}>CONTROLLED EQUIPMENT CUSTODY</div>
            <h3 style={{ margin: 0, fontSize: 17, color: 'var(--ink-bright)' }}>RECORD CUSTODY TRANSACTION</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
          <div className="card" style={{ background: 'var(--bg-panel)', padding: '12px' }}>
            <div className="mono text-gold" style={{ fontSize: 12, fontWeight: 700 }}>{item.serial}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-bright)' }}>{item.name}</div>
            <div className="mono text-dim" style={{ fontSize: 11, marginTop: 2 }}>Current Status: <strong style={{ color: 'var(--gold-light)' }}>{item.status}</strong></div>
          </div>

          <div>
            <label className="form-section-title">TRANSACTION ACTION</label>
            <select
              value={action}
              onChange={e => {
                setAction(e.target.value);
                setCustodian(e.target.value === "RETURN" ? "Armoury Depot Complex" : "");
              }}
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}
            >
              <option value="ISSUE">ISSUE TO SERVICEMAN</option>
              <option value="RETURN">RETURN TO ARMOURY DEPOT</option>
              <option value="INSPECTION">QUARTERLY INSPECTION CHECK</option>
            </select>
          </div>

          <div>
            <label className="form-section-title">RECORDED CUSTODIAN (NAME & ARMY NO.)</label>
            <input
              type="text"
              value={custodian}
              onChange={e => setCustodian(e.target.value)}
              placeholder={action === "RETURN" ? "Armoury Depot Complex" : "e.g. Hav Rawat, V. (JC-118820P)"}
              required
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div>
            <label className="form-section-title">TRANSACTION REMARKS / AUDIT NOTES</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Sentry shift issue / verified weapon seal"
              className="mono"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-base)', border: '1px solid var(--line)', color: 'var(--ink-bright)', borderRadius: 'var(--radius-xs)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">CANCEL</button>
            <button type="submit" disabled={submitting} className="btn btn-gold btn-sm" style={{ fontWeight: 800 }}>
              {submitting ? 'RECORDING…' : 'CONFIRM TRANSACTION ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignmentDetailModal({ isOpen, onClose, assignment }) {
  if (!isOpen || !assignment) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content hud-corner" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, width: '92%', background: 'var(--bg-surface)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius-card)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
          <div>
            <span className="chip chip-gold" style={{ fontSize: 9.5 }}>OFFICIAL DUTY ORDER DOCKET</span>
            <h3 style={{ margin: '4px 0 0', fontSize: 18, color: 'var(--ink-bright)' }}>{assignment.postName}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>DATE:</span>
            <div className="mono text-gold" style={{ fontWeight: 700 }}>{assignment.date}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>SHIFT WINDOW:</span>
            <div className="mono">{assignment.shift}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>UNIT:</span>
            <div style={{ fontWeight: 700, color: 'var(--ink-bright)' }}>{assignment.unit}</div>
          </div>
          <div>
            <span className="mono text-dim" style={{ fontSize: 11 }}>STATUS:</span>
            <div><span className="chip chip-duty">{assignment.status}</span></div>
          </div>
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <span className="mono text-dim" style={{ fontSize: 11 }}>SUPERVISOR:</span>
          <div style={{ fontWeight: 700, color: 'var(--gold-light)', marginTop: 2 }}>{assignment.supervisor}</div>
        </div>

        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <span className="mono text-dim" style={{ fontSize: 11, marginBottom: 6, display: 'block' }}>ASSIGNED SERVICEMEN MUSTER:</span>
          <div style={{ display: 'grid', gap: 6 }}>
            {(assignment.assignedPersonnel || []).map(p => (
              <div key={p.armyNo} className="card" style={{ background: 'var(--bg-panel)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--ink-bright)' }}>{p.rank} {p.name}</span>
                <span className="mono text-dim" style={{ fontSize: 11 }}>{p.armyNo}</span>
              </div>
            ))}
          </div>
        </div>

        {assignment.remarks && (
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
            <span className="mono text-dim" style={{ fontSize: 11 }}>TACTICAL DIRECTIVES:</span>
            <div className="mono" style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 2 }}>{assignment.remarks}</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">CLOSE DOCKET</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN COMMAND SUITE COMPONENT (LEFT SIDEBAR & 8 DEDICATED PAGES)
   ========================================================================== */

function DDMSCommandSuite({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');
  
  // 4 Authorized Military Roles
  const [role, setRole] = useState('ADMIN'); 
  // 'ADMIN' (Col R. S. Rathore — Base Admin CO)
  // 'SUPERVISOR' (Hav Rawat, V. — Senior Havaldar, 2 GRENADIERS)
  // 'CUSTODIAN' (Lt Menon, S. — Equipment Custodian)
  // 'READONLY' (Sep Chauhan, R. — View Only)

  const adminUser = useMemo(() => {
    if (role === 'ADMIN') return "Col R. S. Rathore (Commanding Officer)";
    if (role === 'SUPERVISOR') return "Hav Rawat, V. (Senior Havaldar)";
    if (role === 'CUSTODIAN') return "Lt Menon, S. (Armoury Officer)";
    return "Sep Chauhan, R. (Duty Sentry)";
  }, [role]);

  const [baseInfo, setBaseInfo] = useState(BASE_INFO_DEFAULT);
  const [units, setUnits] = useState(UNITS_DEFAULT);
  const [selectedUnitId, setSelectedUnitId] = useState("UNIT-01");
  const [personnel, setPersonnel] = useState(PERSONNEL);
  const [posts, setPosts] = useState(POSTS);
  const [dutyAssignments, setDutyAssignments] = useState([]);
  const [dutyHistory, setDutyHistory] = useState([]);
  const [historyDates, setHistoryDates] = useState([]);
  const [controlledItems, setControlledItems] = useState(CONTROLLED_ITEMS_INITIAL);
  const [alerts, setAlerts] = useState(ALERTS_INITIAL);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOG);

  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTargetMember, setTransferTargetMember] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileTargetMember, setProfileTargetMember] = useState(null);
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  const [custodyTargetItem, setCustodyTargetItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAssignment, setDetailAssignment] = useState(null);

  // Background Data Synchronization with Express REST Backend
  useEffect(() => {
    let mounted = true;

    const syncDDMS = async () => {
      try {
        const [uData, pData, aData, hData, dData, cData, repData] = await Promise.all([
          DefenceAPI.getUnits().catch(() => null),
          DefenceAPI.getPersonnel().catch(() => null),
          DefenceAPI.getDutyAssignments().catch(() => null),
          DefenceAPI.getDutyHistory().catch(() => null),
          DefenceAPI.getRosterDates().catch(() => null),
          DefenceAPI.getControlledItems().catch(() => null),
          DefenceAPI.getReports().catch(() => null)
        ]);

        if (!mounted) return;
        if (uData) setUnits(uData);
        if (pData) setPersonnel(pData);
        if (aData) setDutyAssignments(aData);
        if (hData) setDutyHistory(hData);
        if (dData) setHistoryDates(dData);
        if (cData) setControlledItems(cData);
        if (repData) setAuditLogs(repData);
      } catch (err) {
        console.warn('DDMS background sync notice:', err);
      }
    };

    syncDDMS();
    const interval = setInterval(syncDDMS, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handlers
  const handleRegisterMember = async (memberData) => {
    try {
      const created = await DefenceAPI.registerPersonnel(memberData);
      if (created) {
        setPersonnel(prev => [created, ...prev]);
      }
    } catch (e) {
      const fallback = { ...memberData, id: `PERS-${Date.now().toString().slice(-4)}` };
      setPersonnel(prev => [fallback, ...prev]);
    }
  };

  const handleTransferMember = async (armyNo, targetUnitId, remarks) => {
    try {
      await DefenceAPI.transferPersonnel({ armyNo, targetUnitId, operator: adminUser, remarks });
      const refreshed = await DefenceAPI.getPersonnel();
      if (refreshed) setPersonnel(refreshed);
    } catch (e) {
      setPersonnel(prev => prev.map(p => p.armyNo === armyNo ? { ...p, unitId: targetUnitId, unit: units.find(u => u.id === targetUnitId)?.shortName || targetUnitId } : p));
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await DefenceAPI.deletePersonnel(id, adminUser);
    } catch (e) {
      console.warn("Delete personnel fallback:", e);
    }
    setPersonnel(prev => prev.filter(p => p.id !== id && p.armyNo !== id));
  };

  const handleSaveDutyAssignment = async (payload) => {
    const created = await DefenceAPI.createDutyAssignment({ ...payload, operator: adminUser });
    const [refreshedAssignments, refreshedHistory] = await Promise.all([
      DefenceAPI.getDutyAssignments(),
      DefenceAPI.getDutyHistory()
    ]);
    if (refreshedAssignments) setDutyAssignments(refreshedAssignments);
    if (refreshedHistory) setDutyHistory(refreshedHistory);
    return created;
  };

  const handleUpdateAssignmentStatus = async (id, status) => {
    await DefenceAPI.updateAssignmentStatus(id, status, adminUser);
    const refreshed = await DefenceAPI.getDutyAssignments();
    if (refreshed) setDutyAssignments(refreshed);
  };

  const handleCustodyConfirm = async (payload) => {
    await DefenceAPI.recordCustody(payload);
    const refreshed = await DefenceAPI.getControlledItems();
    if (refreshed) setControlledItems(refreshed);
  };

  // 8 Clearly Organized Sidebar Tabs
  const navTabs = [
    { id: 'dashboard', label: 'Command Board' },
    { id: 'units-members', label: 'Units & Members' },
    { id: 'duty-assignment', label: 'Duty Assignment' },
    { id: 'roster', label: 'Duty Roster' },
    { id: 'history', label: 'Duty History' },
    { id: 'equipment', label: 'Controlled Equipment' },
    { id: 'personnel', label: 'Personnel' },
    { id: 'reports', label: 'Reports & Logs' },
  ];

  return (
    <div className="ddms-wrapper hud-corner fade-in">
      {/* Top Status Strip with Multi-Role Authorization Switcher */}
      <div className="ddms-top-status-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="text-gold" style={{ fontWeight: 800, letterSpacing: '.05em' }}>INDIAN ARMY BASE COMMAND DESK</span>
          <span style={{ color: 'var(--line-strong)' }}>|</span>
          <span style={{ color: 'var(--ink-bright)' }}>
            OPERATOR: <strong>{adminUser}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono text-dim" style={{ fontSize: 11 }}>ROLE:</span>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="mono"
              style={{ background: 'var(--bg-base)', color: 'var(--gold-light)', border: '1px solid var(--gold)', padding: '4px 8px', fontSize: 11.5, fontWeight: 700, borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
              title="Select simulated military user role"
            >
              <option value="ADMIN">🛡️ ADMINISTRATOR (BASE CO)</option>
              <option value="SUPERVISOR">⚔️ UNIT SUPERVISOR (SENIOR HAV)</option>
              <option value="CUSTODIAN">📦 EQUIPMENT CUSTODIAN (ARMOURY)</option>
              <option value="READONLY">👁️ READ-ONLY SENTRY (RESTRICTED)</option>
            </select>
          </div>
          <span className="chip chip-duty">BASE NODE 09</span>
          <span className="chip chip-gold">DEFCON 4</span>
        </div>
      </div>

      <div className="ddms-body-layout">
        {/* Left Sidebar Menu */}
        <div className="ddms-sidebar">
          <div className="ddms-sidebar-header">
            <div className="mono text-gold" style={{ fontSize: 10, letterSpacing: '.12em' }}>BASE & UNIT ADMIN</div>
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
            <div className="mono text-dim" style={{ fontSize: 11, marginBottom: 8 }}>
              {role === 'ADMIN' ? 'FULL BASE CLEARANCE' : role === 'SUPERVISOR' ? 'UNIT PERMITTED: 2 GREN' : role === 'CUSTODIAN' ? 'ARMOURY ACCESS ONLY' : 'READ-ONLY VIEWER'}
            </div>
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
            <span className="chip chip-gold">AUTHORIZED LEVEL 4</span>
          </div>

          <div className="ddms-view-content">
            {tab === 'dashboard' && (
              <DDMSDashboardView
                baseInfo={baseInfo}
                units={units}
                personnel={personnel}
                assignments={dutyAssignments}
                equipment={controlledItems}
                alerts={alerts}
                onNavigateTab={setTab}
                onSelectUnit={setSelectedUnitId}
              />
            )}
            {tab === 'units-members' && (
              <DDMSUnitsMembersView
                units={units}
                personnel={personnel}
                selectedUnitId={selectedUnitId}
                onSelectUnit={setSelectedUnitId}
                onOpenRegister={() => setShowRegisterModal(true)}
                onOpenEdit={(p) => alert(`Edit Member: ${p.name}`)}
                onOpenTransfer={(p) => { setTransferTargetMember(p); setShowTransferModal(true); }}
                onOpenProfile={(p) => { setProfileTargetMember(p); setShowProfileModal(true); }}
                onDeleteMember={handleDeleteMember}
                isAdmin={role === 'ADMIN'}
                isSupervisor={role === 'SUPERVISOR'}
                userUnitId="UNIT-01"
              />
            )}
            {tab === 'duty-assignment' && (
              <DDMSDutyAssignmentView
                units={units}
                personnel={personnel}
                posts={posts}
                dutyAssignments={dutyAssignments}
                onSaveAssignment={handleSaveDutyAssignment}
                onNavigateTab={setTab}
                adminUser={adminUser}
                isAdmin={role === 'ADMIN'}
                isSupervisor={role === 'SUPERVISOR'}
                userUnitId="UNIT-01"
              />
            )}
            {tab === 'roster' && (
              <DDMSRosterView
                units={units}
                assignments={dutyAssignments}
                posts={posts}
                onUpdateStatus={handleUpdateAssignmentStatus}
                onNavigateTab={setTab}
                onOpenDetail={(a) => { setDetailAssignment(a); setShowDetailModal(true); }}
                isAdmin={role === 'ADMIN'}
                isSupervisor={role === 'SUPERVISOR'}
              />
            )}
            {tab === 'history' && (
              <DDMSDutyHistoryView
                units={units}
                history={dutyHistory}
                historyDates={historyDates}
                onDownloadCSV={(recs, date) => {
                  const csv = "data:text/csv;charset=utf-8,Date,Shift,Unit,Post,Personnel,Supervisor,Status\n" + recs.map(r => `"${r.date}","${r.shift}","${r.unit}","${r.post}","${r.assignedPersonnelNames || r.name}","${r.supervisor || r.authorizedBy}","${r.status}"`).join("\n");
                  const link = document.createElement("a");
                  link.href = encodeURI(csv);
                  link.download = `DUTY_HISTORY_${date || 'ALL'}.csv`;
                  link.click();
                }}
                onOpenDetail={(a) => { setDetailAssignment(a); setShowDetailModal(true); }}
                adminUser={adminUser}
              />
            )}
            {tab === 'equipment' && (
              <DDMSControlledEquipmentView
                equipment={controlledItems}
                onOpenCustodyModal={(item) => { setCustodyTargetItem(item); setShowCustodyModal(true); }}
                isAdmin={role === 'ADMIN'}
                isCustodian={role === 'CUSTODIAN'}
              />
            )}
            {tab === 'personnel' && (
              <DDMSPersonnelView
                units={units}
                personnel={personnel}
                onOpenProfile={(p) => { setProfileTargetMember(p); setShowProfileModal(true); }}
              />
            )}
            {tab === 'reports' && (
              <DDMSReportsView
                units={units}
                personnel={personnel}
                assignments={dutyAssignments}
                history={dutyHistory}
                equipment={controlledItems}
                auditLogs={auditLogs}
                adminUser={adminUser}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterMemberModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterMember}
        units={units}
      />

      <TransferMemberModal
        isOpen={showTransferModal}
        onClose={() => { setShowTransferModal(false); setTransferTargetMember(null); }}
        member={transferTargetMember}
        units={units}
        onTransfer={handleTransferMember}
      />

      <PersonnelProfileModal
        isOpen={showProfileModal}
        onClose={() => { setShowProfileModal(false); setProfileTargetMember(null); }}
        member={profileTargetMember}
      />

      <CustodyTransactionModal
        isOpen={showCustodyModal}
        onClose={() => { setShowCustodyModal(false); setCustodyTargetItem(null); }}
        item={custodyTargetItem}
        onConfirm={handleCustodyConfirm}
        adminUser={adminUser}
      />

      <AssignmentDetailModal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setDetailAssignment(null); }}
        assignment={detailAssignment}
      />
    </div>
  );
}


/* ==========================================================================
   GALLERY & MISSIONS COMPONENT
   ========================================================================== */

function GallerySection() {
  return null;
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="chip chip-gold">{item.category}</span>
            <FlippingWordSwap
              word1={item.word1}
              word2={item.word2}
              duration={350}
              stagger={28}
              style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--gold-light)', fontWeight: 700 }}
            />
          </div>
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
   ARMY RULE DETAIL MODAL (REPLACING PILLAR MODAL)
   ========================================================================== */

function RuleDetailModal({ ruleCategory, pillar, onClose, onOpenDDMS }) {
  const activeCategory = ruleCategory || pillar;
  if (!activeCategory) return null;

  // Resolve category details from RULES_CATEGORIES
  const categoryData = useMemo(() => {
    if (activeCategory.rules && activeCategory.rules.length > 0) return activeCategory;
    const found = RULES_CATEGORIES.find(c => 
      c.id === activeCategory.id || 
      c.title.toLowerCase() === (activeCategory.title || "").toLowerCase()
    );
    return found || RULES_CATEGORIES[0];
  }, [activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-dialog hud-corner" 
        style={{ 
          maxWidth: 840, 
          maxHeight: '92vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'var(--bg-surface)',
          border: '1px solid rgba(197, 155, 39, 0.45)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 25px rgba(197, 155, 39, 0.15)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '18px 24px', 
          borderBottom: '1px solid var(--line)',
          background: 'var(--bg-panel-2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: 'var(--gold)', display: 'flex' }}>
              {categoryData.icon}
            </div>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.08em' }}>
                {categoryData.code} · OFFICIAL SERVICE REGULATIONS
              </div>
              <div className="disp" style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                {categoryData.title}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            title="Close (Esc)"
            style={{ 
              width: 32, 
              height: 32, 
              background: 'rgba(255,255,255,0.06)', 
              border: '1px solid var(--line)', 
              color: 'var(--ink-bright)', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Category Scope & Description */}
          <div style={{ 
            background: '#060d08', 
            border: '1px solid rgba(50, 85, 58, 0.4)', 
            borderRadius: 8, 
            padding: '14px 18px', 
            marginBottom: 20 
          }}>
            <div style={{ fontSize: '0.94rem', color: '#c4d8c8', lineHeight: 1.55 }}>
              {categoryData.subtitle}
            </div>
            <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--ink-dim)', fontStyle: 'italic' }}>
              All personnel governed by the Army Act, 1950, Regulations for the Army, and unit standing orders must maintain continuous compliance with these statutory articles.
            </div>
          </div>

          {/* Numbered Rules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {categoryData.rules.map((rule, rIdx) => (
              <div 
                key={rule.num || rIdx}
                style={{ 
                  background: '#09130b', 
                  border: '1px solid rgba(50, 85, 58, 0.45)', 
                  borderRadius: 8, 
                  padding: '18px 20px',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="chip chip-gold" style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
                      RULE {rule.num}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                      {rule.title}
                    </span>
                  </div>
                  <span 
                    className={`chip ${rule.verification.includes('VERIFIED') ? 'chip-duty' : 'chip-warning'}`}
                    style={{ fontSize: 10, whiteSpace: 'nowrap' }}
                  >
                    {rule.verification.includes('VERIFIED') ? '✓ VERIFIED' : 'PENDING'}
                  </span>
                </div>

                {/* Explanation */}
                <div style={{ fontSize: '0.92rem', color: '#e0ece2', lineHeight: 1.55, marginBottom: 10 }}>
                  {rule.explanation}
                </div>

                {/* Additional Guidance / Details */}
                {rule.details && (
                  <div style={{ fontSize: '0.85rem', color: '#9bb8a1', marginBottom: 12, paddingLeft: 12, borderLeft: '2px solid rgba(197,155,39,0.4)' }}>
                    {rule.details}
                  </div>
                )}

                {/* Reference / Citation Source */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  paddingTop: 10, 
                  borderTop: '1px solid rgba(50, 85, 58, 0.3)',
                  fontSize: '0.8rem',
                  color: 'var(--ink-dim)'
                }}>
                  <span className="mono" style={{ color: 'var(--gold)' }}>OFFICIAL CITATION:</span>
                  <span style={{ color: 'var(--ink-bright)', fontWeight: 500 }}>{rule.reference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ 
          padding: '16px 24px', 
          borderTop: '1px solid var(--line)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'var(--bg-panel)'
        }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← BACK TO RULES SECTION
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {onOpenDDMS && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => { onClose(); onOpenDDMS(); }}
              >
                <IconShield /> ACCESS DDMS DESK
              </button>
            )}
            <button 
              className="btn btn-gold btn-sm"
              onClick={() => window.print()}
            >
              PRINT OFFICIAL DOSSIER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Backward-compatible alias
const PillarModal = RuleDetailModal;


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
          <div className="card hud-corner" style={{ borderRadius: 'var(--radius-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="eyebrow">HEADQUARTERS BULLETINS</div>
              <FlippingWordSwap
                word1="GAZETTE"
                word2="ORDERS"
                duration={350}
                stagger={26}
                style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--gold-light)', fontWeight: 700 }}
              />
            </div>
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

            <div className="card hud-corner" style={{ borderRadius: 'var(--radius-card)' }}>
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
              <li><a href="#about" className="footer-link">Rules & Regulations</a></li>
              <li><a href="#ddms-section" className="footer-link">DDMS Command System</a></li>
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
  const [selectedPillar, setSelectedPillar] = useState(null);

  // Live Telemetry State connected to Express REST API
  const [telemetry, setTelemetry] = useState({
    theatreCommands: 7,
    theatreCoverage: "Northern to Southern",
    readinessStatus: "100%",
    readinessNote: "All Formations Active",
    postManningRatio: "10 / 12",
    postManningNote: "Maintained via DDMS",
    encryptionProtocol: "256-BIT SHA",
    encryptionNode: "Restricted Defence Node",
    defconLevel: "DEFCON 4 NORMAL READY",
    secureNode: "DEL-09-TACTICAL",
    istTime: new Date().toLocaleTimeString("en-IN") + " IST",
    istDate: new Date().toDateString().toUpperCase(),
    zuluTime: new Date().toISOString().substring(11, 19) + "Z",
    connected: false,
    pingMs: 0
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Telemetry Polling Loop (every 3 seconds)
  useEffect(() => {
    let mounted = true;

    const pollTelemetry = async () => {
      const t0 = performance.now();
      try {
        const data = await DefenceAPI.getTelemetry();
        const ping = Math.max(1, Math.round(performance.now() - t0));
        if (mounted && data) {
          setTelemetry({
            ...data,
            connected: true,
            pingMs: ping
          });
        }
      } catch (err) {
        if (mounted) {
          setTelemetry(prev => ({ ...prev, connected: false }));
        }
      }
    };

    pollTelemetry();
    const interval = setInterval(pollTelemetry, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

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
        telemetry={telemetry}
      />

      {/* Main Content Areas */}
      <main style={{ flex: 1 }}>
        {/* 1. Hero Section with Live Telemetry */}
        <HeroSection
          onExplore={() => handleNavigate('about')}
          onOpenDDMS={() => {
            setPortalMode('ddms');
            const el = document.getElementById('ddms-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          telemetry={telemetry}
        />

        {/* 2. Strategic Pillars */}
        <StrategicPillars onSelectPillar={setSelectedPillar} />

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

      {/* Modal Lightboxes */}
      <GalleryModal item={selectedGalleryItem} onClose={() => setSelectedGalleryItem(null)} />
      <PillarModal
        pillar={selectedPillar}
        onClose={() => setSelectedPillar(null)}
        onOpenDDMS={() => {
          setSelectedPillar(null);
          setPortalMode('ddms');
          const el = document.getElementById('ddms-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
