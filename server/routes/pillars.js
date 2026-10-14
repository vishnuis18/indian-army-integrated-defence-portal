const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/pillars
 * Fetch all strategic pillars summary
 */
router.get('/', (req, res) => {
  try {
    const pillars = store.getStrategicPillars();
    res.json({
      success: true,
      data: pillars
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/pillars/:id
 * Fetch deep dossier for a specific pillar with live aligned telemetry
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pillar = store.getStrategicPillarById(id);
    if (!pillar) {
      return res.status(404).json({ success: false, error: `Strategic Pillar '${id}' not found` });
    }
    res.json({
      success: true,
      data: pillar
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
