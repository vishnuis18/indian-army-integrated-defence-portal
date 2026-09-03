const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const store = require('../data/store');

/**
 * GET /api/reports
 * Fetch cryptographic audit trail logs
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: store.auditLogs
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

    const hash = crypto.randomBytes(4).toString('hex') + '...' + crypto.randomBytes(4).toString('hex');
    const newLog = {
      time: new Date().toLocaleTimeString('en-GB') + ' IST',
      action,
      operator,
      category,
      hash
    };

    store.auditLogs.unshift(newLog);

    res.json({
      success: true,
      data: newLog,
      logs: store.auditLogs,
      message: "Security log gazetted"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
