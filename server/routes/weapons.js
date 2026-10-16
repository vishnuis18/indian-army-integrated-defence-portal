const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/weapons (Backward-compatible route to controlled items)
 */
router.get('/', (req, res) => {
  try {
    const items = store.getControlledItems();
    res.json({
      success: true,
      data: items.map(i => ({
        serial: i.serial,
        type: i.name,
        calibre: i.calibre,
        issuedTo: i.status === 'ISSUED' ? i.custodian : 'None',
        status: i.status,
        lastCheck: i.lastInspectionDate || "06:00 IST"
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/weapons/issue (Backward-compatible weapon issue/return toggle)
 */
router.post('/issue', (req, res) => {
  try {
    const { serial, soldierName, operator } = req.body;
    if (!serial) {
      return res.status(400).json({ success: false, error: "Weapon serial number required" });
    }

    const currentItems = store.getControlledItems();
    const item = currentItems.find(i => i.serial.toUpperCase() === serial.toUpperCase() || i.id === serial);
    if (!item) {
      return res.status(404).json({ success: false, error: `Weapon with serial ${serial} not found` });
    }

    const nextAction = item.status === 'ISSUED' ? 'RETURN' : 'ISSUE';
    const result = store.recordCustodyTransaction({
      serial,
      action: nextAction,
      custodian: nextAction === 'ISSUE' ? (soldierName || "Duty Sentry") : "Armoury Depot Complex",
      remarks: `Toggled via barcode/QR check: ${nextAction}`
    }, operator || "Lt Menon, S.");

    res.json({
      success: true,
      data: result.item,
      weapons: store.getControlledItems().map(i => ({
        serial: i.serial,
        type: i.name,
        calibre: i.calibre,
        issuedTo: i.status === 'ISSUED' ? i.custodian : 'None',
        status: i.status,
        lastCheck: "Just now"
      })),
      message: `Weapon ${serial} status updated to ${result.item.status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
