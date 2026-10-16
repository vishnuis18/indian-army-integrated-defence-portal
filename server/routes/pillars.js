const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const RULES_PATH = path.join(__dirname, '..', 'data', 'rules.json');

function loadRules() {
  try {
    if (fs.existsSync(RULES_PATH)) {
      return JSON.parse(fs.readFileSync(RULES_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to read rules.json in pillars.js:', err.message);
  }
  return { categories: [] };
}

/**
 * GET /api/pillars
 * Backward-compatible endpoint returning rules data
 */
router.get('/', (req, res) => {
  try {
    const rulesData = loadRules();
    res.json({
      success: true,
      data: rulesData.categories
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/pillars/:id
 * Backward-compatible endpoint returning specific rule category
 */
router.get('/:id', (req, res) => {
  try {
    const rulesData = loadRules();
    const item = rulesData.categories.find(c => c.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: `Rule or Pillar '${req.params.id}' not found` });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
