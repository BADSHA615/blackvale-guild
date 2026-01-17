const Settings = require('../models/Settings');

// Get website settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update website settings (admin only)
exports.updateSettings = async (req, res) => {
  try {
    const { websiteName, websiteLogo, description } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }
    
    if (websiteName) settings.websiteName = websiteName;
    if (websiteLogo) settings.websiteLogo = websiteLogo;
    if (description) settings.description = description;
    settings.updatedAt = Date.now();
    
    await settings.save();
    
    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
