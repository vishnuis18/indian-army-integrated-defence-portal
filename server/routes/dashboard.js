const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/dashboard/stats
 * Command Board KPI summary counters
 */
router.get('/stats', (req, res) => {
  try {
    const stats = store.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/dashboard/manning-chart
 * Chart.js post manning real-time ratio data
 */
router.get('/manning-chart', (req, res) => {
  try {
    const chartData = store.getManningChartData();
    res.json({ success: true, data: chartData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/dashboard/alerts
 * Live shift and operational alert notifications
 */
router.get('/alerts', (req, res) => {
  try {
    // Generate alerts dynamically from audit logs and personnel status
    const logs = store.getAuditLogs().slice(0, 5);
    const alerts = logs.map((log, idx) => ({
      id: `ALT-${idx}`,
      text: log.action,
      time: log.time,
      severity: log.category === 'DUTY' ? 'WARN' : log.category === 'EQUIPMENT' ? 'ALERT' : 'INFO'
    }));
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
