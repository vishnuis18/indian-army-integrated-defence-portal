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
    res.json({ success: true, data: store.alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/dashboard/alerts
 * Add new operational alert
 */
router.post('/alerts', (req, res) => {
  try {
    const { text, severity } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: "Alert text required" });
    }
    const updated = store.addAlert(text, severity);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/dashboard/alerts/:id
 * Dismiss alert by ID
 */
router.delete('/alerts/:id', (req, res) => {
  try {
    const updated = store.dismissAlert(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
