const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/units
 * Retrieve all registered units with live strength & commander details
 */
router.get('/', (req, res) => {
  try {
    const units = store.getUnits();
    const baseInfo = store.getBaseInfo();
    res.json({
      success: true,
      data: units,
      baseInfo
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/units/:id
 * Retrieve specific unit profile, rank breakdown, and assigned members
 */
router.get('/:id', (req, res) => {
  try {
    const unit = store.getUnitById(req.params.id);
    if (!unit) {
      return res.status(404).json({ success: false, error: `Unit ${req.params.id} not found` });
    }
    res.json({
      success: true,
      data: unit
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
