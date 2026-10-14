/**
 * Indian Army DDMS Tactical Data Store
 * In-memory tactical state store with live simulated telemetry
 */

const crypto = require('crypto');

// Initial Personnel Repository
let personnel = [
  { armyNo: "JC-118820P", name: "Rawat, V.", rank: "Hav", unit: "2 GRENADIERS", status: "ON DUTY", rest: 0, role: "Guard Commander" },
  { armyNo: "IC-56231X", name: "Menon, S.", rank: "Lt", unit: "2 GRENADIERS", status: "ON DUTY", rest: 0, role: "Duty Officer" },
  { armyNo: "JC-224871K", name: "Bhatt, A.", rank: "Nb Sub", unit: "HQ COY", rest: 6, status: "REST", role: "Section Leader" },
  { armyNo: "NK-994102", name: "Chauhan, R.", rank: "Sep", unit: "HQ COY", rest: 0, status: "AVAILABLE", role: "Rifleman" },
  { armyNo: "JC-330019L", name: "Yadav, D.", rank: "Nk", unit: "3 PARA", status: "ON DUTY", rest: 0, role: "Specialist" },
  { armyNo: "NK-771145", name: "Singh, P.", rank: "Sep", unit: "3 PARA", status: "LEAVE", rest: 0, role: "Scout" },
  { armyNo: "IC-70234R", name: "Kulkarni, N.", rank: "Capt", unit: "HQ COY", status: "AVAILABLE", rest: 0, role: "Adjutant" },
  { armyNo: "JC-441982", name: "Thapa, B.", rank: "Hav", unit: "2 GRENADIERS", status: "AVAILABLE", rest: 0, role: "Armourer" },
];

// Initial Guard Posts
let posts = [
  { id: "PST-01", name: "Main Gate", priority: "HIGH", manpower: 2, filled: 2, location: "Sector Alpha Perimeter" },
  { id: "PST-02", name: "Armoury", priority: "HIGH", manpower: 2, filled: 1, location: "Secure Depot Complex" },
  { id: "PST-03", name: "Perimeter — North", priority: "MED", manpower: 3, filled: 3, location: "Outer Watchtower Grid" },
  { id: "PST-04", name: "QRT Standby", priority: "HIGH", manpower: 4, filled: 3, location: "Rapid Response Bay" },
  { id: "PST-05", name: "Officers' Mess", priority: "LOW", manpower: 1, filled: 1, location: "Administrative Enclave" },
];

// Master Duty Shifts
let dutyRoster = [
  { shift: "0600–1400", post: "Main Gate", personnel: ["JC-118820P Rawat", "NK-994102 Chauhan"], sector: "Sector A" },
  { shift: "0600–1400", post: "Armoury", personnel: ["IC-56231X Menon"], sector: "Depot B" },
  { shift: "1400–2200", post: "Perimeter — North", personnel: ["JC-330019L Yadav", "JC-441982 Thapa", "IC-70234R Kulkarni"], sector: "Perimeter N" },
  { shift: "2200–0600", post: "QRT Standby", personnel: ["JC-118820P Rawat", "JC-330019L Yadav", "JC-441982 Thapa"], sector: "QRT Bay" },
];

// Weapons Registry
let weapons = [
  { serial: "WPN-7021", type: "INSAS 1B1 5.56mm", calibre: "5.56x45mm", issuedTo: "JC-118820P Hav Rawat", status: "ISSUED", lastCheck: "06:00 IST" },
  { serial: "WPN-7022", type: "INSAS 1B1 5.56mm", calibre: "5.56x45mm", issuedTo: "None", status: "IN DEPOT", lastCheck: "04:30 IST" },
  { serial: "WPN-8401", type: "AK-203 7.62mm", calibre: "7.62x39mm", issuedTo: "JC-330019L Nk Yadav", status: "ISSUED", lastCheck: "06:15 IST" },
  { serial: "WPN-8402", type: "AK-203 7.62mm", calibre: "7.62x39mm", issuedTo: "None", status: "IN DEPOT", lastCheck: "05:00 IST" },
  { serial: "WPN-9110", type: "Glock 17 9mm", calibre: "9x19mm Parabellum", issuedTo: "IC-56231X Lt Menon", status: "ISSUED", lastCheck: "05:45 IST" },
  { serial: "WPN-5503", type: "Carl Gustaf M4", calibre: "84mm Rocket", issuedTo: "None", status: "IN DEPOT", lastCheck: "02:00 IST" },
];

// Live Shift Alerts
let alerts = [
  { id: "ALT-01", text: "Nb Sub Bhatt, A. rest period ends in 40 min — prepare reassignment to PST-02 relief", time: "16m ago", severity: "WARN" },
  { id: "ALT-02", text: "Armoury PST-02 understaffed: 1 of 2 filled — immediate assignment required", time: "24m ago", severity: "ALERT" },
  { id: "ALT-03", text: "6 weapons due for quarterly ordnance & maintenance check", time: "1h ago", severity: "INFO" },
  { id: "ALT-04", text: "Sector Bravo perimeter communications link verified operational", time: "2h ago", severity: "SUCCESS" },
];

// Cryptographic Audit Trail
let auditLogs = [
  { time: "06:00:12 IST", action: "Morning shift deployed to Main Gate (PST-01)", operator: "Hav Rawat, V.", category: "SHIFT", hash: "8f2a...9c10" },
  { time: "06:15:45 IST", action: "WPN-8401 issued via tactical QR scan to Nk Yadav, D.", operator: "Lt Menon, S.", category: "WEAPONS", hash: "3e1b...aa41" },
  { time: "06:30:00 IST", action: "Routine rest rotation started for Section Leader Bhatt, A.", operator: "Capt Kulkarni, N.", category: "PERSONNEL", hash: "7c9d...2201" },
  { time: "07:00:00 IST", action: "Cryptographic telemetry heartbeat broadcast to HQ Delhi", operator: "SYS-AUTO", category: "TELEMETRY", hash: "11de...04b4" },
];

// Historical Duty Roster Ledger ('Who worked on this day and in which post')
let dutyHistory = [
  { id: "DH-20260903-01", date: "2026-09-03", shift: "0600–1400", post: "Main Gate (PST-01)", armyNo: "JC-118820P", name: "Rawat, V.", rank: "Hav", unit: "2 GRENADIERS", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "06:00 IST", timeOut: "14:00 IST" },
  { id: "DH-20260903-02", date: "2026-09-03", shift: "0600–1400", post: "Main Gate (PST-01)", armyNo: "NK-994102", name: "Chauhan, R.", rank: "Sep", unit: "HQ COY", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "06:00 IST", timeOut: "14:00 IST" },
  { id: "DH-20260903-03", date: "2026-09-03", shift: "0600–1400", post: "Armoury (PST-02)", armyNo: "IC-56231X", name: "Menon, S.", rank: "Lt", unit: "2 GRENADIERS", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "06:00 IST", timeOut: "14:00 IST" },
  { id: "DH-20260903-04", date: "2026-09-03", shift: "1400–2200", post: "Perimeter — North (PST-03)", armyNo: "JC-330019L", name: "Yadav, D.", rank: "Nk", unit: "3 PARA", status: "ONGOING", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "14:00 IST", timeOut: "Active" },
  { id: "DH-20260903-05", date: "2026-09-03", shift: "1400–2200", post: "Perimeter — North (PST-03)", armyNo: "JC-441982", name: "Thapa, B.", rank: "Hav", unit: "2 GRENADIERS", status: "ONGOING", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "14:00 IST", timeOut: "Active" },
  { id: "DH-20260903-06", date: "2026-09-03", shift: "1400–2200", post: "Perimeter — North (PST-03)", armyNo: "IC-70234R", name: "Kulkarni, N.", rank: "Capt", unit: "HQ COY", status: "ONGOING", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "14:00 IST", timeOut: "Active" },
  { id: "DH-20260902-01", date: "2026-09-02", shift: "0600–1400", post: "QRT Standby (PST-04)", armyNo: "JC-330019L", name: "Yadav, D.", rank: "Nk", unit: "3 PARA", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "06:00 IST", timeOut: "14:00 IST" },
  { id: "DH-20260902-02", date: "2026-09-02", shift: "0600–1400", post: "Main Gate (PST-01)", armyNo: "NK-771145", name: "Singh, P.", rank: "Sep", unit: "3 PARA", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "06:00 IST", timeOut: "14:00 IST" },
  { id: "DH-20260902-03", date: "2026-09-02", shift: "1400–2200", post: "Armoury (PST-02)", armyNo: "JC-118820P", name: "Rawat, V.", rank: "Hav", unit: "2 GRENADIERS", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "14:00 IST", timeOut: "22:00 IST" },
  { id: "DH-20260901-01", date: "2026-09-01", shift: "2200–0600", post: "Perimeter — North (PST-03)", armyNo: "JC-118820P", name: "Rawat, V.", rank: "Hav", unit: "2 GRENADIERS", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "22:00 IST", timeOut: "06:00 IST" },
  { id: "DH-20260901-02", date: "2026-09-01", shift: "0600–1400", post: "Officers' Mess (PST-05)", armyNo: "NK-994102", name: "Chauhan, R.", rank: "Sep", unit: "HQ COY", status: "COMPLETED", authorizedBy: "Col R. S. Rathore (Admin CO)", timeIn: "06:00 IST", timeOut: "14:00 IST" },
];

// Live telemetry metrics generator
function getTelemetry() {
  const now = new Date();
  
  // IST Time Formatter
  const istFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const istDateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short', month: 'short', day: '2-digit', year: 'numeric'
  });

  const istTimeStr = istFormatter.format(now);
  const istDateStr = istDateFormatter.format(now).toUpperCase();

  // UTC Zulu Formatter
  const zuluTimeStr = now.toISOString().substring(11, 19) + 'Z';

  // Compute live duty post counts
  const totalRequired = posts.reduce((sum, p) => sum + p.manpower, 0);
  const totalFilled = posts.reduce((sum, p) => sum + p.filled, 0);

  // Compute live system pulse
  const onDutyCount = personnel.filter(p => p.status === 'ON DUTY').length;

  return {
    theatreCommands: 7,
    theatreCoverage: "Northern to Southern",
    readinessStatus: "100%",
    readinessNote: "All Formations Active",
    postManningRatio: `${totalFilled} / ${totalRequired}`,
    postManningPercent: Math.round((totalFilled / totalRequired) * 100),
    postManningNote: "Maintained via DDMS",
    encryptionProtocol: "256-BIT SHA",
    encryptionNode: "Restricted Defence Node",
    defconLevel: "DEFCON 4 NORMAL READY",
    secureNode: "DEL-09-TACTICAL",
    istTime: `${istTimeStr} IST`,
    istDate: istDateStr,
    zuluTime: zuluTimeStr,
    activeOnDuty: onDutyCount,
    serverUptimeSeconds: Math.floor(process.uptime()),
    status: "OPERATIONAL",
    timestamp: now.toISOString()
  };
}

// Dashboard statistics
function getDashboardStats() {
  const onDutyCount = personnel.filter(p => p.status === 'ON DUTY').length;
  const standbyCount = personnel.filter(p => p.status === 'AVAILABLE').length;
  const weaponsIssuedCount = weapons.filter(w => w.status === 'ISSUED').length;

  return {
    onDuty: {
      count: onDutyCount,
      total: personnel.length,
      label: "ON DUTY NOW",
      sub: `of ${personnel.length} soldiers assigned`
    },
    standby: {
      count: standbyCount,
      label: "STANDBY RESERVE",
      sub: "Immediate tasking reserve"
    },
    weaponsIssued: {
      count: weaponsIssuedCount,
      total: weapons.length,
      label: "WEAPONS ISSUED",
      sub: `of ${weapons.length} registered weapons`
    },
    activeAlerts: {
      count: alerts.length,
      label: "ACTIVE ALERTS",
      sub: "Requires guard officer review"
    }
  };
}

// Manning chart dataset
function getManningChartData() {
  return {
    labels: posts.map(p => p.name),
    required: posts.map(p => p.manpower),
    filled: posts.map(p => p.filled),
    postsDetail: posts
  };
}

// Roster operations
function assignRoster({ shift, post, personnelName, operator = "Col R. S. Rathore (Admin CO)", date, priority = "HIGH" }) {
  const effectiveDate = date || new Date().toISOString().substring(0, 10);
  const target = dutyRoster.find(r => r.shift === shift && r.post === post);
  if (target) {
    if (!target.personnel.includes(personnelName)) {
      target.personnel.push(personnelName);
    }
  } else {
    dutyRoster.push({
      shift,
      post,
      personnel: [personnelName],
      sector: "Sector A"
    });
  }

  // Update corresponding post filled count
  const pObj = posts.find(p => p.name.toLowerCase().includes(post.toLowerCase()) || post.toLowerCase().includes(p.name.toLowerCase()));
  if (pObj && pObj.filled < pObj.manpower) {
    pObj.filled += 1;
  }

  // Find soldier details
  const soldier = personnel.find(p => personnelName.includes(p.name) || personnelName.includes(p.armyNo));
  const armyNo = soldier?.armyNo || personnelName.split(' ')[0] || "JC-TACTICAL";
  const name = soldier?.name || personnelName;
  const rank = soldier?.rank || "Hav";
  const unit = soldier?.unit || "2 GRENADIERS";

  // Add entry to Duty History ledger
  const historyEntry = {
    id: `DH-${effectiveDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: effectiveDate,
    shift,
    post,
    armyNo,
    name,
    rank,
    unit,
    status: "DEPLOYED",
    timeIn: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    timeOut: "Active",
    authorizedBy: operator
  };
  dutyHistory.unshift(historyEntry);

  // Log in audit trail
  const hash = crypto.randomBytes(4).toString('hex') + '...' + crypto.randomBytes(4).toString('hex');
  auditLogs.unshift({
    time: new Date().toLocaleTimeString('en-GB') + ' IST',
    action: `[ADMIN ORDER] Assigned ${rank} ${name} (${armyNo}) to ${post} [Shift: ${shift}, Date: ${effectiveDate}]`,
    operator,
    category: "ROSTER",
    hash
  });

  return {
    roster: dutyRoster,
    historyEntry,
    posts
  };
}

function getDutyHistory({ date, post, soldier } = {}) {
  let list = [...dutyHistory];
  if (date) {
    list = list.filter(item => item.date === date);
  }
  if (post && post !== "ALL") {
    list = list.filter(item => item.post.toLowerCase().includes(post.toLowerCase()));
  }
  if (soldier) {
    const s = soldier.toLowerCase();
    list = list.filter(item => item.name.toLowerCase().includes(s) || item.armyNo.toLowerCase().includes(s));
  }
  return list;
}

// Weapons operations (Check-in/Check-out via QR)
function toggleWeaponIssue(serial, soldierName = "Duty Soldier", operator = "Armoury Guard") {
  const wpn = weapons.find(w => w.serial.toUpperCase() === serial.toUpperCase());
  if (!wpn) return null;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const isCurrentlyIssued = wpn.status === 'ISSUED';

  if (isCurrentlyIssued) {
    wpn.status = 'IN DEPOT';
    wpn.issuedTo = 'None';
  } else {
    wpn.status = 'ISSUED';
    wpn.issuedTo = soldierName;
  }
  wpn.lastCheck = timeStr;

  // Add audit log
  const hash = crypto.randomBytes(4).toString('hex') + '...' + crypto.randomBytes(4).toString('hex');
  auditLogs.unshift({
    time: timeStr,
    action: isCurrentlyIssued ? `WPN ${serial} returned to depot by ${soldierName}` : `WPN ${serial} issued via QR to ${soldierName}`,
    operator,
    category: "WEAPONS",
    hash
  });

  return wpn;
}

// Personnel operations
function updatePersonnelStatus(armyNo, newStatus, restHours = 0) {
  const p = personnel.find(item => item.armyNo === armyNo);
  if (!p) return null;

  p.status = newStatus;
  p.rest = restHours;

  const hash = crypto.randomBytes(4).toString('hex') + '...' + crypto.randomBytes(4).toString('hex');
  auditLogs.unshift({
    time: new Date().toLocaleTimeString('en-GB') + ' IST',
    action: `Personnel ${p.rank} ${p.name} status updated to ${newStatus}`,
    operator: "Hav Rawat, V.",
    category: "PERSONNEL",
    hash
  });

  return p;
}

// Add new operational alert
function addAlert(text, severity = "WARN") {
  const newAlt = {
    id: `ALT-0${alerts.length + 1}`,
    text,
    time: "Just now",
    severity
  };
  alerts.unshift(newAlt);
  return alerts;
}

// Dismiss alert
function dismissAlert(id) {
  alerts = alerts.filter(a => a.id !== id);
  return alerts;
}

// Strategic Pillars Doctrine Repository & Intelligence Records
const strategicPillars = [
  {
    id: "mission-security",
    category: "Territorial Defence",
    badge: "Doctrine",
    word1: "MISSION",
    word2: "SECURITY",
    title: "Mission & Security",
    desc: "Safeguarding territorial integrity across 15,000+ km of land borders through proactive mountain warfare posture and rapid deterrence.",
    motto: "सेवा परमो धर्मः — Service Before Self",
    classification: "RESTRICTED DEFENCE DOCTRINE // SECTION 01",
    overview: "The primary doctrine of the Indian Army is the unwavering preservation of national sovereignty, territorial integrity, and unity of India against external aggression and internal threats. Operating across the world's most treacherous border terrains—from the icy heights of Siachen to the searing sands of the Thar Desert—the force maintains constant vigilance through forward-deployed formations and active mountain warfare capabilities.",
    operationalZones: [
      { name: "Northern Frontier (LOC & LAC)", desc: "High-altitude vigil, extreme sub-zero mountain defence, and glacier command." },
      { name: "Western Sector (Plains & Deserts)", desc: "Mechanized armoured strike deterrence, radar tracking, and rapid counter-offensive corridors." },
      { name: "Eastern Sector (Himalayan Ridges)", desc: "Dense jungle warfare, mountain passes, and tri-junction strategic chokepoint security." },
      { name: "Southern & Island Enclaves", desc: "Peninsular coastal defense, amphibious rapid response, and strategic maritime approaches." }
    ],
    doctrineParameters: [
      { label: "Land Frontier Perimeter", value: "15,106.7 km", sub: "Active border patrolling grid" },
      { label: "Operational Commands", value: "7 Theatres", sub: "Integrated tactical commands" },
      { label: "Extreme Altitude Ops", value: "Up to 22,000 ft", sub: "Siachen & Himalayan heights" },
      { label: "Deterrence Posture", value: "Proactive Defense", sub: "Rapid mobilization response" }
    ],
    strategicDirectives: [
      "Maintain 24/7 uninterrupted visual, thermal, and radar surveillance across all border posts.",
      "Ensure forward ammunition and logistical depots are sustained with high-altitude reserves.",
      "Execute synchronized multi-arm border domination patrols with integrated air and artillery support.",
      "Rapidly neutralize infiltration vectors through proactive counter-intrusion grids."
    ]
  },
  {
    id: "discipline-valour",
    category: "Military Ethos",
    badge: "Tradition",
    word1: "DISCIPLINE",
    word2: "VALOUR",
    title: "Discipline & Valour",
    desc: "Forged in over a century of unparalleled valor, sacrifice, and supreme devotion. Upholding ethical chain-of-command integrity.",
    motto: "कर्तव्यं अन्वास्ते — Bound by Unflinching Duty & Honour",
    classification: "MILITARY HERITAGE & ETHOS // SECTION 02",
    overview: "The ethos of the Indian Army is rooted in unbreakable camaraderie, supreme courage under fire, and ironclad discipline. Over decades of gallantry—from the snow-capped cliffs of Tiger Hill to United Nations peace corridors—officers and soldiers live by the creed of leading from the front ('Follow Me'). The moral foundation guarantees unbending integrity, secular harmony, and adherence to the Chetwode motto.",
    operationalZones: [
      { name: "Infantry Regiments", desc: "The bedrock of combat valour: Gorkhas, Sikhs, Grenadiers, Paras, Rajputs, Kumaon, and Garhwal." },
      { name: "Armoured & Mechanized Columns", desc: "Iron fists on the battleground executing synchronized high-tempo combat maneuvers." },
      { name: "Special Forces (PARA SF)", desc: "Elite airborne operatives trained for asymmetric warfare, deep raids, and covert hostage rescue." },
      { name: "Combat Engineers (Sappers)", desc: "Bridging insurmountable chasms, minefield clearance, and building strategic lifeline roads." }
    ],
    doctrineParameters: [
      { label: "Heritage of Valour", value: "125+ Years", sub: "Unbroken martial lineage" },
      { label: "Param Vir Chakra Citations", value: "21 Heroes", sub: "Highest wartime gallantry honour" },
      { label: "Chetwode Motto", value: "Honour First", sub: "Safety & welfare of men always" },
      { label: "Regimental Diversity", value: "Pan-India", sub: "United by one flag, one nation" }
    ],
    strategicDirectives: [
      "Uphold the Chetwode Creed: The safety, honour, and welfare of your country come first, always and every time.",
      "Foster unit cohesiveness through rigorous physical conditioning and uncompromising regimental pride.",
      "Instill ethical leadership and constitutional devotion across every level of the chain of command.",
      "Honor fallen braves and guarantee comprehensive welfare, pension, and medical care for Veer Naris and veterans."
    ]
  },
  {
    id: "modernization-tech",
    category: "Tactical C4ISR",
    badge: "Next-Gen",
    word1: "TECHNOLOGY",
    word2: "TACTICAL",
    title: "Modernization & Tech",
    desc: "Integrating indigenous drone surveillance networks, AI-assisted telemetry, automated QR logistics, and digital DDMS duty rosters.",
    motto: "प्रौद्योगिकी एवं पराक्रम — Superiority Through Innovation",
    classification: "ADVANCED DEFENCE TECHNOLOGY // SECTION 03",
    overview: "Modern warfare demands information superiority and rapid sensor-to-shooter loops. The Indian Army is aggressively undergoing digital transformation through the induction of indigenous unmanned aerial systems, quantum-resistant tactical mesh networks, AI-enabled border surveillance, and the automated DDMS (Duty Deployment & Management System) for algorithmic roster and arms oversight.",
    operationalZones: [
      { name: "Unmanned Systems & Swarm Drones", desc: "Long-endurance tactical UAVs, tethered aerial sensors, and autonomous loitering munitions." },
      { name: "Digital DDMS Roster Operations", desc: "Automated guard post manning, rest-cycle matrix monitoring, and instant QR ordnance validation." },
      { name: "Tactical Communications Network (TCN)", desc: "Jam-resistant 256-bit encrypted field radio, optical fibre grids, and secure SATCOM downlinks." },
      { name: "Cyber & Electronic Warfare Command", desc: "Protection of sovereign defence clouds, spectrum domination, and offensive cyber countermeasures." }
    ],
    doctrineParameters: [
      { label: "Encryption Security", value: "256-Bit SHA", sub: "Restricted military cryptographic node" },
      { label: "DDMS Duty Management", value: "Automated", sub: "Zero-error fatigue tracking & QR arms" },
      { label: "Atmanirbhar Induction", value: "85%+ Indigenous", sub: "Drones, rifles, sensors & artillery" },
      { label: "Sensor Fusion Loop", value: "Sub-Second", sub: "Unified C4ISR common operational picture" }
    ],
    strategicDirectives: [
      "Accelerate the fielding of indigenous tactical electronics and AI reconnaissance algorithms.",
      "Mandate automated DDMS duty rosters across guard posts to prevent soldier fatigue and assure alert compliance.",
      "Enforce tamper-evident cryptographic QR scans on all weapon issues and ammunition depot transactions.",
      "Harden command-and-control servers against advanced electronic countermeasures and distributed cyber incursions."
    ]
  },
  {
    id: "vigilance-service",
    category: "Nation First",
    badge: "24/7 Vigil",
    word1: "VIGILANCE",
    word2: "SERVICE",
    title: "Vigilance & Service",
    desc: "Providing round-the-clock humanitarian disaster relief (HADR), civil defense support, and leading global peacekeeping deployments.",
    motto: "सर्वदा सन्नद्धाः — Always Prepared Everywhere in Crisis",
    classification: "NATION BUILDING & HADR // SECTION 04",
    overview: "Beyond combat deterrence, the Indian Army is the nation's premier instrument of crisis response. Whether executing immediate Humanitarian Assistance & Disaster Relief (HADR) during floods, earthquakes, and cyclones, or winning hearts and minds through Project Sadbhavana in remote border zones, the soldier stands as the ultimate guardian and protector of civilian lives.",
    operationalZones: [
      { name: "HADR Disaster Task Forces", desc: "Rapid deployment column with amphibious boats, mobile field hospitals, and water purification units." },
      { name: "Operation Sadbhavana", desc: "Army goodwill schools, vocational training, women empowerment centers, and free medical camps." },
      { name: "Border Infrastructure (BRO)", desc: "Construction of world's highest motorable passes, all-weather tunnels, and strategic frontier bridges." },
      { name: "United Nations Peacekeeping", desc: "Blue Helmet contingents defending vulnerable populations across Africa, Middle East, and worldwide." }
    ],
    doctrineParameters: [
      { label: "HADR Response Time", value: "< 60 Minutes", sub: "First responders in civil crises" },
      { label: "UN Missions Served", value: "53+ Deployments", sub: "Over 200,000 Indian peacekeepers deployed" },
      { label: "Sadbhavana Schools", value: "40+ Institutes", sub: "Empowering frontier youth with education" },
      { label: "Civil Defense Readiness", value: "24/7/365 Standby", sub: "Constant pan-India vigilance status" }
    ],
    strategicDirectives: [
      "Maintain standby Humanitarian Assistance & Disaster Relief (HADR) columns at every cantonment.",
      "Deepen civil-military coordination for rapid disaster mitigation, medical rescue, and supply drops.",
      "Expand Project Sadbhavana education and healthcare outposts to strengthen border community resilience.",
      "Uphold India's distinguished international prestige as a compassionate, professional UN peacekeeping pillar."
    ]
  }
];

function getStrategicPillars() {
  const telemetry = getTelemetry();
  return strategicPillars.map(p => ({
    id: p.id,
    category: p.category,
    badge: p.badge,
    word1: p.word1,
    word2: p.word2,
    title: p.title,
    desc: p.desc,
    motto: p.motto,
    classification: p.classification,
    liveStatus: {
      theatreCommands: telemetry.theatreCommands,
      readinessStatus: telemetry.readinessStatus,
      encryptionProtocol: telemetry.encryptionProtocol,
      postManningRatio: telemetry.postManningRatio,
      status: telemetry.status,
      timestamp: telemetry.timestamp
    }
  }));
}

function getStrategicPillarById(id) {
  const pillar = strategicPillars.find(p => p.id === id || p.title.toLowerCase().includes(id.toLowerCase()));
  if (!pillar) return null;
  const telemetry = getTelemetry();
  return {
    ...pillar,
    liveTelemetry: {
      ...telemetry,
      alignedAt: new Date().toISOString()
    }
  };
}

module.exports = {
  personnel,
  posts,
  dutyRoster,
  dutyHistory,
  weapons,
  alerts,
  auditLogs,
  strategicPillars,
  getTelemetry,
  getDashboardStats,
  getManningChartData,
  assignRoster,
  getDutyHistory,
  toggleWeaponIssue,
  updatePersonnelStatus,
  addAlert,
  dismissAlert,
  getStrategicPillars,
  getStrategicPillarById
};
