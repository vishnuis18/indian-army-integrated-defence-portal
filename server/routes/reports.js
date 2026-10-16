const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/reports
 * Fetch cryptographic audit trail logs
 */
router.get('/', (req, res) => {
  try {
    const logs = store.getAuditLogs();
    res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/reports/unit-summary
 * Get unit-wise and rank-wise strength breakdown
 */
router.get('/unit-summary', (req, res) => {
  try {
    const units = store.getUnits();
    const personnel = store.getPersonnel();
    
    const rankDistribution = {};
    personnel.forEach(p => {
      rankDistribution[p.rank] = (rankDistribution[p.rank] || 0) + 1;
    });

    res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      baseInfo: store.getBaseInfo(),
      totalUnits: units.length,
      totalPersonnel: personnel.length,
      units,
      rankDistribution
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/reports/equipment-audit
 * Get controlled equipment custody and reconciliation report
 */
router.get('/equipment-audit', (req, res) => {
  try {
    const items = store.getControlledItems();
    const transactions = store.getCustodyTransactions();

    res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      totalControlledItems: items.length,
      issuedCount: items.filter(i => i.status === 'ISSUED').length,
      armouryCount: items.filter(i => i.status === 'IN ARMOURY').length,
      items,
      recentTransactions: transactions.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/reports/generate
 * Log a new command or security event
 */
router.post('/generate', (req, res) => {
  try {
    const { action, operator = "COMMAND OPERATOR", category = "GENERAL" } = req.body;
    if (!action) {
      return res.status(400).json({ success: false, error: "Action description required" });
    }

    const newLog = store.logAudit(action, operator, category);

    res.json({
      success: true,
      data: newLog,
      message: "Security log gazetted"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
