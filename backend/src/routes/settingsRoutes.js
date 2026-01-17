const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

// Public - Get settings
router.get('/', getSettings);

// Admin only - Update settings
router.put('/', protect, admin, updateSettings);

module.exports = router;
