const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * GET /api/personnel
 * Retrieve servicemen roster with optional unit, rank, status & search filters
 */
router.get('/', (req, res) => {
  try {
    const { unitId, rank, status, query } = req.query;
    const list = store.getPersonnel({ unitId, rank, status, query });
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
 * GET /api/personnel/:id
 * Retrieve single personnel profile by ID or Army No
 */
router.get('/:id', (req, res) => {
  try {
    const member = store.getPersonnelById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, error: `Member ${req.params.id} not found` });
    }
    // Also attach recent duty history for this member
    const memberHistory = store.getDutyHistory({ soldier: member.armyNo });
    res.json({
      success: true,
      data: {
        ...member,
        recentDuties: memberHistory.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/personnel
 * Register new unit member
 */
router.post('/', (req, res) => {
  try {
    const { armyNo, name, rank, unitId, unit, designation, status, restHours, familyStatus, quarterStatus, quarterNo, joinedDate, nextTransferDate, phone, bloodGroup, remarks, operator } = req.body;
    if (!name || (!unitId && !unit)) {
      return res.status(400).json({ success: false, error: "Member name and unit are required." });
    }

    const created = store.addPersonnel({
      armyNo,
      name,
      rank,
      unitId,
      unit,
      designation,
      status,
      restHours,
      familyStatus,
      quarterStatus,
      quarterNo,
      joinedDate,
      nextTransferDate,
      phone,
      bloodGroup,
      remarks
    }, operator || "Col R. S. Rathore");

    res.status(201).json({
      success: true,
      data: created,
      message: `[PERSONNEL REGISTERED] ${created.rank} ${created.name} (${created.armyNo}) enlisted into ${created.unit}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/personnel/:id
 * Update existing member profile details
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const operator = req.body.operator || "Col R. S. Rathore";
    const updated = store.updatePersonnel(id, req.body, operator);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Member ${id} not found` });
    }
    res.json({
      success: true,
      data: updated,
      message: `Member profile ${updated.name} updated successfully`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/personnel/transfer
 * Inter-unit personnel transfer with logging
 */
router.post('/transfer', (req, res) => {
  try {
    const { armyNo, targetUnitId, operator, remarks } = req.body;
    if (!armyNo || !targetUnitId) {
      return res.status(400).json({ success: false, error: "armyNo and targetUnitId are required for transfer." });
    }

    const result = store.transferPersonnel(armyNo, targetUnitId, operator || "Col R. S. Rathore", remarks);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      data: result.member,
      message: `[TRANSFER ORDER] Successfully transferred ${result.member.rank} ${result.member.name} from ${result.oldUnit} to ${result.newUnit}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/personnel/status
 * Backward-compatible status updater
 */
router.post('/status', (req, res) => {
  try {
    const { armyNo, status, rest, operator } = req.body;
    if (!armyNo || !status) {
      return res.status(400).json({ success: false, error: "armyNo and status are required" });
    }

    const updated = store.updatePersonnel(armyNo, { status, restHours: Number(rest) || 0 }, operator);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Soldier ${armyNo} not found` });
    }

    res.json({
      success: true,
      data: updated,
      message: `Updated status for ${updated.name} to ${status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/personnel/:id
 * Remove member record
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const operator = req.query.operator || "Col R. S. Rathore";
    const removed = store.deletePersonnel(id, operator);
    if (!removed) {
      return res.status(404).json({ success: false, error: `Member ${id} not found` });
    }

    res.json({
      success: true,
      data: removed,
      message: `Successfully removed member ${removed.name} (${removed.armyNo})`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
