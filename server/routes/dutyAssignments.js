const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/duty-assignments
 * Retrieve assignments with optional unit, date, shift & status filters
 */
router.get('/', (req, res) => {
  try {
    const { unitId, date, shift, status } = req.query;
    const list = store.getDutyAssignments({ unitId, date, shift, status });
    res.json({
      success: true,
      data: list,
      total: list.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/duty-assignments/posts
 * Retrieve registered base guard posts
 */
router.get('/posts', (req, res) => {
  try {
    const posts = store.getDutyPosts();
    res.json({
      success: true,
      data: posts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/duty-assignments
 * Create new duty assignment with validation & conflict detection
 */
router.post('/', (req, res) => {
  try {
    const { unitId, date, shift, postId, supervisor, assignedPersonnel, remarks, operator } = req.body;
    
    const created = store.createAssignment({
      unitId,
      date,
      shift,
      postId,
      supervisor,
      assignedPersonnel,
      remarks
    }, operator || "Col R. S. Rathore");

    res.status(201).json({
      success: true,
      data: created,
      message: `[DUTY GAZETTED] Successfully created duty assignment for ${created.postName} on ${created.date} (${created.shift})`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/duty-assignments/:id/status
 * Update status of an assignment (e.g. COMPLETED, CANCELLED, ACTIVE)
 */
router.patch('/:id/status', (req, res) => {
  try {
    const { status, operator } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required." });
    }

    const updated = store.updateAssignmentStatus(req.params.id, status, operator || "Col R. S. Rathore");
    if (!updated) {
      return res.status(404).json({ success: false, error: `Assignment ${req.params.id} not found.` });
    }

    res.json({
      success: true,
      data: updated,
      message: `Duty assignment status updated to ${status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
