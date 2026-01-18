const express = require('express');
const router = express.Router();
const squadController = require('../controllers/squadController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/approved', squadController.getApprovedSquads);
router.get('/details/:squadId', squadController.getSquadById);

// Protected routes (authenticated users)
router.post('/create', authMiddleware, squadController.createSquad);
router.get('/user/:userId', squadController.getUserSquad);
router.put('/:squadId/add-member', authMiddleware, squadController.addMember);
router.put('/:squadId/remove-member', authMiddleware, squadController.removeMember);
router.put('/:squadId/leave', authMiddleware, squadController.leaveSquad);
router.put('/:squadId/update-name', authMiddleware, squadController.updateSquadName);
router.put('/:squadId/deactivate', authMiddleware, squadController.deactivateSquad);

// Admin routes
router.get('/pending/admin/list', authMiddleware, adminMiddleware, squadController.getPendingSquads);
router.put('/:squadId/approve', authMiddleware, adminMiddleware, squadController.approveSquad);
router.put('/:squadId/reject', authMiddleware, adminMiddleware, squadController.rejectSquad);

// Admin Squad Management Routes
router.get('/admin/all-squads', authMiddleware, adminMiddleware, squadController.getAllSquads);
router.get('/admin/squad-stats', authMiddleware, adminMiddleware, squadController.getSquadStats);
router.get('/admin/analytics/:squadId', authMiddleware, adminMiddleware, squadController.getSquadAnalytics);
router.put('/admin/kick-member/:squadId', authMiddleware, adminMiddleware, squadController.adminKickMember);
router.put('/admin/add-member/:squadId', authMiddleware, adminMiddleware, squadController.adminAddMember);
router.delete('/admin/delete-squad/:squadId', authMiddleware, adminMiddleware, squadController.adminDeleteSquad);

module.exports = router;
