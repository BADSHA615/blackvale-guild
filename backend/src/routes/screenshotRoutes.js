const express = require('express');
const router = express.Router();
const screenshotController = require('../controllers/screenshotController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/submit', authMiddleware, screenshotController.submitScreenshot);
router.get('/pending', authMiddleware, adminMiddleware, screenshotController.getPendingScreenshots);
router.put('/approve/:screenshotId', authMiddleware, adminMiddleware, screenshotController.approveScreenshot);
router.put('/reject/:screenshotId', authMiddleware, adminMiddleware, screenshotController.rejectScreenshot);
router.get('/approved', screenshotController.getApprovedScreenshots);
router.get('/user/:userId', screenshotController.getUserScreenshots);

module.exports = router;
