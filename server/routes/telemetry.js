const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/telemetry
 * Returns live telemetry indicators for the Hero Command HUD and Topbar
 */
router.get('/', (req, res) => {
  try {
    const telemetry = store.getTelemetry();
    res.json({
      success: true,
      data: telemetry
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
