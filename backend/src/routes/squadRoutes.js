const express = require('express');
const router = express.Router();
const squadController = require('../controllers/squadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/create', authMiddleware, squadController.createSquad);
router.get('/pending', authMiddleware, adminMiddleware, squadController.getPendingSquads);
router.put('/approve/:squadId', authMiddleware, adminMiddleware, squadController.approveSquad);
router.put('/reject/:squadId', authMiddleware, adminMiddleware, squadController.rejectSquad);
router.put('/update-name/:squadId', authMiddleware, adminMiddleware, squadController.updateSquadName);
router.get('/approved', squadController.getApprovedSquads);
router.get('/user/:userId', squadController.getUserSquad);

module.exports = router;
