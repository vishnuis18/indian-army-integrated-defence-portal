const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/roster
 * Fetch master duty roster shifts and stations
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: store.dutyRoster,
      posts: store.posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/roster/history
 * Fetch duty history ledger: 'who worked on this day and in which post'
 * Supports filters: ?date=YYYY-MM-DD&post=Main+Gate&soldier=Rawat
 */
router.get('/history', (req, res) => {
  try {
    const { date, post, soldier } = req.query;
    const history = store.getDutyHistory({ date, post, soldier });
    res.json({
      success: true,
      data: history,
      total: history.length,
      filter: { date: date || "ALL", post: post || "ALL", soldier: soldier || "ALL" }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/roster/assign
 * Admin assignment of soldier to post, shift, and date
 */
router.post('/assign', (req, res) => {
  try {
    const { shift, post, personnelName, operator, date, priority } = req.body;
    if (!shift || !post || !personnelName) {
      return res.status(400).json({ success: false, error: "shift, post, and personnelName are required" });
    }
    const result = store.assignRoster({ shift, post, personnelName, operator, date, priority });
    res.json({
      success: true,
      data: result.roster,
      historyEntry: result.historyEntry,
      posts: result.posts,
      message: `[ADMIN ORDER] Successfully assigned ${personnelName} to ${post} (${shift})`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
