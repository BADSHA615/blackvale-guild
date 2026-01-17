const Squad = require('../models/Squad');
const User = require('../models/User');

// Create squad
exports.createSquad = async (req, res) => {
  try {
    const { name, description, maxMembers } = req.body;

    const squad = new Squad({
      name,
      description,
      leader: req.userId,
      maxMembers: maxMembers || 4
    });

    await squad.save();
    await squad.populate('leader', '-password');

    res.status(201).json({
      message: 'Squad created and sent for approval',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending squad requests (Admin)
exports.getPendingSquads = async (req, res) => {
  try {
    const squads = await Squad.find({ status: 'pending' })
      .populate('leader', '-password')
      .populate('members', '-password')
      .sort({ createdAt: -1 });

    res.json(squads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve squad (Admin)
exports.approveSquad = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { adminComment, selectedMembers } = req.body;

    const squad = await Squad.findByIdAndUpdate(
      squadId,
      {
        status: 'approved',
        approvedBy: req.userId,
        approvedAt: new Date(),
        adminComment,
        members: selectedMembers
      },
      { new: true }
    ).populate('leader', '-password')
     .populate('members', '-password');

    // Update users to add squad reference
    await User.updateMany(
      { _id: { $in: selectedMembers } },
      { squad: squadId }
    );

    res.json({
      message: 'Squad approved',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject squad (Admin)
exports.rejectSquad = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { adminComment } = req.body;

    const squad = await Squad.findByIdAndUpdate(
      squadId,
      {
        status: 'rejected',
        approvedBy: req.userId,
        adminComment
      },
      { new: true }
    ).populate('leader', '-password');

    res.json({
      message: 'Squad rejected',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update squad name (Admin only)
exports.updateSquadName = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { name } = req.body;

    const squad = await Squad.findByIdAndUpdate(
      squadId,
      { name },
      { new: true }
    ).populate('leader', '-password')
     .populate('members', '-password');

    res.json({
      message: 'Squad name updated',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all approved squads
exports.getApprovedSquads = async (req, res) => {
  try {
    const squads = await Squad.find({ status: 'approved' })
      .populate('leader', '-password')
      .populate('members', '-password')
      .sort({ createdAt: -1 });

    res.json(squads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's squad
exports.getUserSquad = async (req, res) => {
  try {
    const { userId } = req.params;
    const squad = await Squad.findOne({ members: userId })
      .populate('leader', '-password')
      .populate('members', '-password');

    if (!squad) {
      return res.status(404).json({ message: 'User not in any squad' });
    }

    res.json(squad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
