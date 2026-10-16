const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/post-members
 * Retrieve all station post members, transfer tenures, and quarters allocation
 */
router.get('/', (req, res) => {
  try {
    const list = store.getPostMembers();
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
 * POST /api/post-members
 * Add / post a new member to a station with transfer & family quarter details
 */
router.post('/', (req, res) => {
  try {
    const { armyNo, name, rank, unit, post, transferDate, nextTransferDate, familyStatus, quarterStatus, quarterNo, remarks } = req.body;
    if (!name || !post) {
      return res.status(400).json({ success: false, error: "name and post/station are required" });
    }

    const created = store.addPostMember({
      armyNo,
      name,
      rank,
      unit,
      post,
      transferDate,
      nextTransferDate,
      familyStatus,
      quarterStatus,
      quarterNo,
      remarks
    });

    res.status(201).json({
      success: true,
      data: created,
      message: `[POSTING ORDER] Successfully added ${created.name} to ${created.post}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/post-members/:id
 * Remove / transfer out a post member by ID or Army No
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const removed = store.deletePostMember(id);
    if (!removed) {
      return res.status(404).json({ success: false, error: `Member with id/armyNo ${id} not found` });
    }

    res.json({
      success: true,
      data: removed,
      message: `[POSTING ORDER] Successfully removed ${removed.name} from ${removed.post}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
