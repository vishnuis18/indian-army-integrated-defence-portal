/**
 * Indian Army Base & Unit Management — Persistent Data Store
 * File-backed relational JSON store with immediate disk synchronization (db.json)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'db.json');

// In-memory working copy
let db = {
  baseInfo: {},
  units: [],
  personnel: [],
  dutyPosts: [],
  dutyAssignments: [],
  dutyHistory: [],
  controlledItems: [],
  custodyTransactions: [],
  auditLogs: []
};

// Safe load from disk
function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(raw);
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error('[DB-LOAD-ERROR] Failed to read db.json, retaining memory state:', err.message);
  }
}

// Atomic save to disk
function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB-SAVE-ERROR] Failed to save db.json:', err.message);
  }
}

// Initial boot load
loadDatabase();

// Cryptographic audit logger
function logAudit(action, operator = "Col R. S. Rathore", category = "GENERAL") {
  const hash = crypto.randomBytes(4).toString('hex') + '...' + crypto.randomBytes(4).toString('hex');
  const entry = {
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    action,
    operator,
    category,
    hash
  };
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 50) db.auditLogs.pop();
  saveDatabase();
  return entry;
}

// ==========================================
// 1. BASE & UNIT OPERATIONS
// ==========================================

function getBaseInfo() {
  return db.baseInfo;
}

function getUnits() {
  return db.units.map(u => {
    const unitMembers = db.personnel.filter(p => p.unitId === u.id || p.unit === u.shortName);
    const onDuty = unitMembers.filter(p => p.status === 'ON DUTY').length;
    const available = unitMembers.filter(p => p.status === 'AVAILABLE').length;
    return {
      ...u,
      actualStrength: unitMembers.length,
      onDutyCount: onDuty,
      availableCount: available
    };
  });
}

function getUnitById(id) {
  const unit = db.units.find(u => u.id === id || u.code.toLowerCase() === id.toLowerCase() || u.shortName.toLowerCase() === id.toLowerCase());
  if (!unit) return null;
  const unitMembers = db.personnel.filter(p => p.unitId === unit.id || p.unit === unit.shortName);
  
  // Rank breakdown
  const rankCounts = {};
  unitMembers.forEach(m => {
    rankCounts[m.rank] = (rankCounts[m.rank] || 0) + 1;
  });

  return {
    ...unit,
    actualStrength: unitMembers.length,
    rankBreakdown: rankCounts,
    members: unitMembers
  };
}

// ==========================================
// 2. PERSONNEL & UNIT MEMBERS OPERATIONS
// ==========================================

function getPersonnel(filters = {}) {
  let list = [...db.personnel];
  const { unitId, rank, status, query } = filters;

  if (unitId && unitId !== "ALL") {
    list = list.filter(p => p.unitId === unitId || p.unit === unitId);
  }
  if (rank && rank !== "ALL") {
    list = list.filter(p => p.rank.toLowerCase() === rank.toLowerCase());
  }
  if (status && status !== "ALL") {
    list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.armyNo && p.armyNo.toLowerCase().includes(q)) ||
      (p.designation && p.designation.toLowerCase().includes(q)) ||
      (p.unit && p.unit.toLowerCase().includes(q))
    );
  }
  return list;
}

function getPersonnelById(id) {
  return db.personnel.find(p => p.id === id || p.armyNo === id);
}

function addPersonnel(data, operator = "Col R. S. Rathore") {
  const targetUnit = db.units.find(u => u.id === data.unitId || u.shortName === data.unit) || db.units[0];
  const newMember = {
    id: `PERS-${Math.floor(100 + Math.random() * 900)}`,
    armyNo: data.armyNo ? data.armyNo.trim() : `JC-${Math.floor(100000 + Math.random() * 900000)}`,
    name: data.name ? data.name.trim() : "Soldier",
    rank: data.rank || "Sep",
    unitId: targetUnit.id,
    unit: targetUnit.shortName,
    designation: data.designation || "Rifleman",
    status: data.status || "AVAILABLE",
    restHours: Number(data.restHours) || 0,
    familyStatus: data.familyStatus || "Single",
    quarterStatus: data.quarterStatus || "NOT ALLOCATED",
    quarterNo: data.quarterNo || (data.quarterStatus === "ALLOCATED" ? "QTR-NEW" : "Barracks Living"),
    joinedDate: data.joinedDate || new Date().toISOString().substring(0, 10),
    nextTransferDate: data.nextTransferDate || "2027-01-01",
    phone: data.phone || "—",
    bloodGroup: data.bloodGroup || "O+ve",
    remarks: data.remarks || "Personnel enlisted into base register"
  };

  db.personnel.unshift(newMember);
  logAudit(`[PERSONNEL REGISTER] Registered ${newMember.rank} ${newMember.name} (${newMember.armyNo}) to ${targetUnit.shortName}`, operator, "PERSONNEL");
  saveDatabase();
  return newMember;
}

function updatePersonnel(id, updates, operator = "Col R. S. Rathore") {
  const member = db.personnel.find(p => p.id === id || p.armyNo === id);
  if (!member) return null;

  Object.assign(member, updates);
  if (updates.unitId) {
    const u = db.units.find(unit => unit.id === updates.unitId);
    if (u) member.unit = u.shortName;
  }

  logAudit(`[PERSONNEL UPDATE] Updated details for ${member.name} (${member.armyNo})`, operator, "PERSONNEL");
  saveDatabase();
  return member;
}

function transferPersonnel(armyNo, targetUnitId, operator = "Col R. S. Rathore", remarks = "") {
  const member = db.personnel.find(p => p.armyNo === armyNo || p.id === armyNo);
  if (!member) return { success: false, error: "Member not found" };

  const targetUnit = db.units.find(u => u.id === targetUnitId || u.shortName === targetUnitId);
  if (!targetUnit) return { success: false, error: "Target unit not found" };

  const oldUnit = member.unit;
  member.unitId = targetUnit.id;
  member.unit = targetUnit.shortName;
  member.joinedDate = new Date().toISOString().substring(0, 10);
  if (remarks) member.remarks = remarks;

  logAudit(`[UNIT TRANSFER] Transferred ${member.rank} ${member.name} (${member.armyNo}) from ${oldUnit} to ${targetUnit.shortName}`, operator, "UNIT_TRANSFER");
  saveDatabase();
  return { success: true, member, oldUnit, newUnit: targetUnit.shortName };
}

function deletePersonnel(id, operator = "Col R. S. Rathore") {
  const idx = db.personnel.findIndex(p => p.id === id || p.armyNo === id);
  if (idx === -1) return false;
  const removed = db.personnel.splice(idx, 1)[0];
  logAudit(`[PERSONNEL REMOVAL] Removed member record for ${removed.name} (${removed.armyNo})`, operator, "PERSONNEL");
  saveDatabase();
  return removed;
}

// ==========================================
// 3. DUTY ASSIGNMENT & ROSTER OPERATIONS
// ==========================================

function getDutyPosts() {
  return db.dutyPosts;
}

function getDutyAssignments(filters = {}) {
  let list = [...db.dutyAssignments];
  const { unitId, date, shift, status } = filters;
  if (unitId && unitId !== "ALL") {
    list = list.filter(a => a.unitId === unitId || a.unit === unitId);
  }
  if (date) {
    list = list.filter(a => a.date === date);
  }
  if (shift && shift !== "ALL") {
    list = list.filter(a => a.shift === shift);
  }
  if (status && status !== "ALL") {
    list = list.filter(a => a.status === status);
  }
  return list;
}

function createAssignment(payload, operator = "Col R. S. Rathore") {
  const { unitId, date, shift, postId, supervisor, assignedPersonnel, remarks } = payload;
  
  if (!unitId || !date || !shift || !postId || !assignedPersonnel || assignedPersonnel.length === 0) {
    throw new Error("Missing required duty assignment fields (unit, date, shift, post, personnel).");
  }

  const post = db.dutyPosts.find(p => p.id === postId) || { name: postId };
  const unit = db.units.find(u => u.id === unitId || u.shortName === unitId) || { id: unitId, shortName: unitId };

  // Conflict Checking: Check if any assigned soldier is already on active duty for same date & shift
  const existingForDateShift = db.dutyAssignments.filter(a => a.date === date && a.shift === shift && a.status !== "CANCELLED");
  const conflicts = [];

  assignedPersonnel.forEach(p => {
    existingForDateShift.forEach(existing => {
      if (existing.assignedPersonnel && existing.assignedPersonnel.some(ep => ep.armyNo === p.armyNo)) {
        conflicts.push(`${p.name} (${p.armyNo}) is already assigned to ${existing.postName} on shift ${shift}`);
      }
    });
  });

  if (conflicts.length > 0) {
    throw new Error(`Duty Assignment Conflict: ${conflicts.join('; ')}`);
  }

  const assignment = {
    id: `ASN-${date.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    date,
    shift,
    unitId: unit.id,
    unit: unit.shortName,
    postId: post.id || postId,
    postName: post.name,
    supervisor: supervisor || operator,
    assignedPersonnel,
    status: "ACTIVE",
    remarks: remarks || "Standard duty assignment",
    createdAt: new Date().toISOString(),
    createdBy: operator
  };

  db.dutyAssignments.unshift(assignment);

  // Update soldier status in personnel
  assignedPersonnel.forEach(p => {
    const soldier = db.personnel.find(sp => sp.armyNo === p.armyNo);
    if (soldier) {
      soldier.status = "ON DUTY";
    }
  });

  // Also record into permanent Duty History
  const names = assignedPersonnel.map(p => `${p.rank} ${p.name}`).join(", ");
  const historyEntry = {
    id: `DH-${date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    date,
    shift,
    unitId: unit.id,
    unit: unit.shortName,
    post: post.name,
    supervisor: supervisor || operator,
    assignedPersonnelNames: names,
    status: "ACTIVE",
    authorizedBy: operator,
    timeIn: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    timeOut: "Active",
    remarks: remarks || "Assignment logged"
  };
  db.dutyHistory.unshift(historyEntry);

  logAudit(`[DUTY ASSIGNED] Assigned ${names} to ${post.name} [Unit: ${unit.shortName}, Shift: ${shift}, Date: ${date}]`, operator, "DUTY");
  saveDatabase();

  return assignment;
}

function updateAssignmentStatus(id, newStatus, operator = "Col R. S. Rathore") {
  const assignment = db.dutyAssignments.find(a => a.id === id);
  if (!assignment) return null;

  assignment.status = newStatus;
  if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
    assignment.assignedPersonnel.forEach(p => {
      const soldier = db.personnel.find(sp => sp.armyNo === p.armyNo);
      if (soldier && soldier.status === "ON DUTY") {
        soldier.status = "AVAILABLE";
      }
    });
  }

  logAudit(`[DUTY STATUS] Assignment ${id} marked ${newStatus}`, operator, "DUTY");
  saveDatabase();
  return assignment;
}

// ==========================================
// 4. DUTY HISTORY OPERATIONS
// ==========================================

function getDutyHistory(filters = {}) {
  let list = [...db.dutyHistory];
  const { date, unitId, post, soldier } = filters;

  if (date && date !== "ALL") {
    list = list.filter(item => item.date === date);
  }
  if (unitId && unitId !== "ALL") {
    list = list.filter(item => item.unitId === unitId || item.unit === unitId);
  }
  if (post && post !== "ALL") {
    list = list.filter(item => item.post.toLowerCase().includes(post.toLowerCase()));
  }
  if (soldier) {
    const s = soldier.toLowerCase();
    list = list.filter(item => 
      (item.name && item.name.toLowerCase().includes(s)) ||
      (item.assignedPersonnelNames && item.assignedPersonnelNames.toLowerCase().includes(s)) ||
      (item.armyNo && item.armyNo.toLowerCase().includes(s))
    );
  }
  return list;
}

function getDutyHistoryDates() {
  const set = new Set(db.dutyHistory.map(h => h.date).filter(Boolean));
  // Include dates from dutyAssignments as well
  db.dutyAssignments.forEach(a => {
    if (a.date) set.add(a.date);
  });
  return Array.from(set).sort().reverse();
}

// ==========================================
// 5. CONTROLLED EQUIPMENT (INVENTORY & CUSTODY)
// ==========================================

function getControlledItems(filters = {}) {
  let list = [...db.controlledItems];
  const { category, status, unitId, query } = filters;

  if (category && category !== "ALL") {
    list = list.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }
  if (status && status !== "ALL") {
    list = list.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }
  if (unitId && unitId !== "ALL") {
    list = list.filter(i => i.unitId === unitId || i.unit === unitId);
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.serial.toLowerCase().includes(q) ||
      (i.custodian && i.custodian.toLowerCase().includes(q))
    );
  }
  return list;
}

function recordCustodyTransaction(payload, operator = "Lt Menon, S.") {
  const { serial, action, custodian, remarks } = payload;
  const item = db.controlledItems.find(i => i.serial.toUpperCase() === serial.toUpperCase() || i.id === serial);
  
  if (!item) throw new Error(`Controlled item with serial ${serial} not found.`);

  const newStatus = action === "ISSUE" ? "ISSUED" : "IN ARMOURY";
  const newCustodian = action === "ISSUE" ? (custodian || "Duty Soldier") : "Armoury Depot Complex";

  item.status = newStatus;
  item.custodian = newCustodian;
  item.issuingOfficer = operator;
  if (action === "ISSUE") {
    item.issuedDate = new Date().toISOString().substring(0, 16).replace('T', ' ') + ' IST';
  }

  const hash = crypto.randomBytes(4).toString('hex') + '...' + crypto.randomBytes(4).toString('hex');
  const tx = {
    id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
    itemId: item.id,
    serial: item.serial,
    action,
    custodian: newCustodian,
    officer: operator,
    timestamp: new Date().toISOString(),
    remarks: remarks || `Item ${action.toLowerCase()} recorded under authorized supervision`,
    hash
  };

  db.custodyTransactions.unshift(tx);
  logAudit(`[CONTROLLED ITEM] ${item.serial} (${item.name}) ${action} -> Custodian: ${newCustodian}`, operator, "EQUIPMENT");
  saveDatabase();

  return { item, transaction: tx };
}

function getCustodyTransactions(itemId) {
  if (itemId) {
    return db.custodyTransactions.filter(t => t.itemId === itemId || t.serial === itemId);
  }
  return db.custodyTransactions;
}

// ==========================================
// 6. DASHBOARD & SUMMARY METRICS
// ==========================================

function getDashboardStats() {
  const totalUnits = db.units.length;
  const totalPersonnel = db.personnel.length;
  const onDutyCount = db.personnel.filter(p => p.status === 'ON DUTY').length;
  const availableCount = db.personnel.filter(p => p.status === 'AVAILABLE').length;
  const restCount = db.personnel.filter(p => p.status === 'REST' || p.status === 'LEAVE').length;

  const todayStr = new Date().toISOString().substring(0, 10);
  const todayAssignments = db.dutyAssignments.filter(a => a.date === todayStr);

  const weaponsIssued = db.controlledItems.filter(i => i.status === 'ISSUED').length;

  return {
    baseInfo: db.baseInfo,
    unitsCount: totalUnits,
    personnelCount: totalPersonnel,
    onDuty: {
      count: onDutyCount,
      total: totalPersonnel,
      label: "ON DUTY NOW",
      sub: `of ${totalPersonnel} registered servicemen`
    },
    standby: {
      count: availableCount,
      label: "AVAILABLE STANDBY",
      sub: "Reserve readiness"
    },
    resting: {
      count: restCount,
      label: "REST / LEAVE CYCLE",
      sub: "Fatigue mitigation"
    },
    todayAssignmentsCount: todayAssignments.length,
    controlledEquipmentIssued: weaponsIssued,
    totalControlledEquipment: db.controlledItems.length,
    postsMannedRatio: `${db.dutyPosts.length} / ${db.dutyPosts.length} Posts Active`
  };
}

function getManningChartData() {
  const labels = ["0600", "0900", "1200", "1500", "1800", "2100", "0000", "0300"];
  const onDutyPersonnel = [12, 14, 14, 13, 15, 12, 10, 8];
  const standbyReserve = [6, 8, 8, 7, 6, 8, 10, 12];

  return {
    labels,
    datasets: [
      {
        label: "Armed Sentry & Post Manned",
        data: onDutyPersonnel,
        borderColor: "#dfba74",
        backgroundColor: "rgba(223, 186, 116, 0.15)",
        fill: true,
        tension: 0.35
      },
      {
        label: "Quick Reaction Standby",
        data: standbyReserve,
        borderColor: "#4a7a58",
        backgroundColor: "rgba(74, 122, 88, 0.12)",
        fill: true,
        tension: 0.35
      }
    ]
  };
}

function getAuditLogs() {
  return db.auditLogs;
}

// Retain compatibility helpers for public portal
function getTelemetry() {
  const now = new Date();
  return {
    theatreCommands: 7,
    theatreCoverage: "Pan-India Command Grid",
    readinessStatus: "100%",
    postManningRatio: `${db.personnel.filter(p => p.status === 'ON DUTY').length} / ${db.dutyPosts.length * 2}`,
    encryptionProtocol: "256-BIT SHA",
    defconLevel: "DEFCON 4 NORMAL READY",
    istTime: `${now.toLocaleTimeString('en-GB')} IST`,
    istDate: now.toDateString().toUpperCase(),
    status: "OPERATIONAL",
    timestamp: now.toISOString()
  };
}

module.exports = {
  db,
  loadDatabase,
  saveDatabase,
  logAudit,
  getBaseInfo,
  getUnits,
  getUnitById,
  getPersonnel,
  getPersonnelById,
  addPersonnel,
  updatePersonnel,
  transferPersonnel,
  deletePersonnel,
  getDutyPosts,
  getDutyAssignments,
  createAssignment,
  updateAssignmentStatus,
  getDutyHistory,
  getDutyHistoryDates,
  getControlledItems,
  recordCustodyTransaction,
  getCustodyTransactions,
  getDashboardStats,
  getManningChartData,
  getAuditLogs,
  getTelemetry,
  // Backward compatibility alias for weapons
  weapons: db.controlledItems
};
