const Screenshot = require('../models/Screenshot');
const User = require('../models/User');

// Submit screenshot
exports.submitScreenshot = async (req, res) => {
  try {
    const { imageUrl, description, kills, headshots, damageDealt, survival } = req.body;

    const screenshot = new Screenshot({
      player: req.userId,
      imageUrl,
      description,
      kills,
      headshots,
      damageDealt,
      survival
    });

    await screenshot.save();
    await screenshot.populate('player', '-password');

    res.status(201).json({
      message: 'Screenshot submitted successfully',
      screenshot
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending screenshots (Admin)
exports.getPendingScreenshots = async (req, res) => {
  try {
    const screenshots = await Screenshot.find({ status: 'pending' })
      .populate('player', '-password')
      .sort({ createdAt: -1 });

    res.json(screenshots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve screenshot (Admin)
exports.approveScreenshot = async (req, res) => {
  try {
    const { screenshotId } = req.params;
    const { adminComment } = req.body;

    const screenshot = await Screenshot.findByIdAndUpdate(
      screenshotId,
      {
        status: 'approved',
        approvedBy: req.userId,
        approvedAt: new Date(),
        adminComment
      },
      { new: true }
    ).populate('player', '-password');

    // Update weekly score
    await User.findByIdAndUpdate(
      screenshot.player._id,
      { $inc: { weeklyScore: 10 } } // 10 points per approved screenshot
    );

    res.json({
      message: 'Screenshot approved',
      screenshot
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject screenshot (Admin)
exports.rejectScreenshot = async (req, res) => {
  try {
    const { screenshotId } = req.params;
    const { adminComment } = req.body;

    const screenshot = await Screenshot.findByIdAndUpdate(
      screenshotId,
      {
        status: 'rejected',
        approvedBy: req.userId,
        adminComment
      },
      { new: true }
    ).populate('player', '-password');

    res.json({
      message: 'Screenshot rejected',
      screenshot
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved screenshots for dashboard
exports.getApprovedScreenshots = async (req, res) => {
  try {
    const screenshots = await Screenshot.find({ status: 'approved' })
      .populate('player', '-password')
      .sort({ approvedAt: -1 })
      .limit(50);

    res.json(screenshots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's screenshots
exports.getUserScreenshots = async (req, res) => {
  try {
    const { userId } = req.params;
    const screenshots = await Screenshot.find({ player: userId })
      .populate('player', '-password')
      .sort({ createdAt: -1 });

    res.json(screenshots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
