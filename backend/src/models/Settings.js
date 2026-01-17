const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  websiteName: {
    type: String,
    default: '⚔️ BlackVale Guild',
    required: true
  },
  websiteLogo: {
    type: String,
    default: '⚔️',
    required: true,
    // Can store emoji text or Base64 image data (data:image/...)
  },
  description: {
    type: String,
    default: 'A Free Fire Guild Management System'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
