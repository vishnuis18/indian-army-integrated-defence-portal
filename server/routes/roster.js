const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/roster
 * Fetch master duty roster shifts, assignments and stations
 */
router.get('/', (req, res) => {
  try {
    const { unitId, date, shift, status } = req.query;
    const assignments = store.getDutyAssignments({ unitId, date, shift, status });
    const posts = store.getDutyPosts();
    res.json({
      success: true,
      data: assignments,
      posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/roster/dates
 * Fetch all unique calendar dates with recorded duty history
 */
router.get('/dates', (req, res) => {
  try {
    const dates = store.getDutyHistoryDates();
    res.json({
      success: true,
      data: dates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/roster/history
 * Fetch historical duty records for selected date / filters
 */
router.get('/history', (req, res) => {
  try {
    const { date, unitId, post, soldier } = req.query;
    const history = store.getDutyHistory({ date, unitId, post, soldier });
    res.json({
      success: true,
      data: history,
      total: history.length,
      filter: { date: date || "ALL", unitId: unitId || "ALL", post: post || "ALL", soldier: soldier || "ALL" }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/roster/assign
 * Backward-compatible admin duty assign endpoint
 */
router.post('/assign', (req, res) => {
  try {
    const { shift, post, personnelName, operator, date, priority, unitId, unit } = req.body;
    if (!shift || !post || !personnelName) {
      return res.status(400).json({ success: false, error: "shift, post, and personnelName are required" });
    }

    // Split personnelName if contains armyNo
    const parts = personnelName.trim().split(' ');
    const armyNo = parts[0];
    const name = parts.slice(1).join(' ') || parts[0];
    const soldier = store.getPersonnelById(armyNo) || { armyNo, name, rank: "Sep" };

    const assignment = store.createAssignment({
      unitId: unitId || soldier.unitId || "UNIT-01",
      date: date || new Date().toISOString().substring(0, 10),
      shift,
      postId: post,
      supervisor: operator || "Col R. S. Rathore",
      assignedPersonnel: [
        { armyNo: soldier.armyNo, name: soldier.name, rank: soldier.rank }
      ],
      remarks: `Admin duty order by ${operator || 'Admin CO'}`
    }, operator || "Col R. S. Rathore");

    res.json({
      success: true,
      data: assignment,
      posts: store.getDutyPosts(),
      message: `[ADMIN ORDER] Successfully assigned ${personnelName} to ${post} (${shift})`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
