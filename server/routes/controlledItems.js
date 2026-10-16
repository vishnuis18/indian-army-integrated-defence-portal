const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/controlled-items
 * Retrieve controlled equipment records with filters
 */
router.get('/', (req, res) => {
  try {
    const { category, status, unitId, query } = req.query;
    const items = store.getControlledItems({ category, status, unitId, query });
    res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/controlled-items/custody
 * Record custody transaction (ISSUE, RETURN, INSPECTION)
 */
router.post('/custody', (req, res) => {
  try {
    const { serial, action, custodian, remarks, operator } = req.body;
    if (!serial || !action) {
      return res.status(400).json({ success: false, error: "serial and action (ISSUE / RETURN) are required." });
    }

    const result = store.recordCustodyTransaction({
      serial,
      action: action.toUpperCase(),
      custodian,
      remarks
    }, operator || "Lt Menon, S.");

    res.json({
      success: true,
      data: result.item,
      transaction: result.transaction,
      message: `[CUSTODY TRANSACTION] Item ${result.item.serial} status updated to ${result.item.status} (${result.item.custodian})`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/controlled-items/transactions
 * Retrieve audit log of custody transactions
 */
router.get('/transactions', (req, res) => {
  try {
    const { itemId } = req.query;
    const txs = store.getCustodyTransactions(itemId);
    res.json({
      success: true,
      data: txs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
