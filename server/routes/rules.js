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
    console.error('Failed to read rules.json:', err.message);
  }
  return { categories: [], updates: [] };
}

/**
 * GET /api/rules
 * Retrieve all 8 rule categories with search/filter support
 */
router.get('/', (req, res) => {
  try {
    const rulesData = loadRules();
    const { query } = req.query;

    if (query) {
      const q = query.toLowerCase();
      const filtered = rulesData.categories.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.rules.some(r => 
          r.title.toLowerCase().includes(q) ||
          r.explanation.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q)
        )
      );
      return res.json({
        success: true,
        data: filtered,
        total: filtered.length,
        updates: rulesData.updates,
        disclaimer: rulesData.disclaimer
      });
    }

    res.json({
      success: true,
      data: rulesData.categories,
      total: rulesData.categories.length,
      updates: rulesData.updates,
      disclaimer: rulesData.disclaimer
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/rules/:id
 * Retrieve single category with detailed rules
 */
router.get('/:id', (req, res) => {
  try {
    const rulesData = loadRules();
    const item = rulesData.categories.find(c => c.id === req.params.id || c.code.toLowerCase().includes(req.params.id.toLowerCase()));
    if (!item) {
      return res.status(404).json({ success: false, error: `Rule category '${req.params.id}' not found.` });
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
