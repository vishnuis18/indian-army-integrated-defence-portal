const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/personnel
 * Fetch servicemen roster and rest matrix
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: store.personnel
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/personnel/status
 * Update soldier duty or rest status
 */
router.post('/status', (req, res) => {
  try {
    const { armyNo, status, rest } = req.body;
    if (!armyNo || !status) {
      return res.status(400).json({ success: false, error: "armyNo and status are required" });
    }

    const updated = store.updatePersonnelStatus(armyNo, status, rest);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Soldier with Army No ${armyNo} not found` });
    }

    res.json({
      success: true,
      data: updated,
      personnel: store.personnel,
      message: `Updated status for ${updated.name} to ${status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
