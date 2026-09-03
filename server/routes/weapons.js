const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/weapons
 * Fetch weapons registry
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: store.weapons
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/weapons/issue
 * Toggle weapon issue/return via QR scan
 */
router.post('/issue', (req, res) => {
  try {
    const { serial, soldierName, operator } = req.body;
    if (!serial) {
      return res.status(400).json({ success: false, error: "Weapon serial number required" });
    }

    const updatedWeapon = store.toggleWeaponIssue(serial, soldierName, operator);
    if (!updatedWeapon) {
      return res.status(404).json({ success: false, error: `Weapon with serial ${serial} not found` });
    }

    res.json({
      success: true,
      data: updatedWeapon,
      weapons: store.weapons,
      message: `Weapon ${serial} status updated to ${updatedWeapon.status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
