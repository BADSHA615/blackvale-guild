const Squad = require('../models/Squad');
const User = require('../models/User');

// Create squad (send for approval)
exports.createSquad = async (req, res) => {
  try {
    const { name, description, maxMembers } = req.body;

    // Validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Squad name must be at least 3 characters' });
    }

    if (maxMembers && (maxMembers < 2 || maxMembers > 10)) {
      return res.status(400).json({ message: 'Max members must be between 2 and 10' });
    }

    // Check if user already has a squad
    const existingSquad = await Squad.findOne({
      $or: [
        { leader: req.userId, status: { $in: ['pending', 'approved'] } },
        { members: req.userId, status: { $in: ['pending', 'approved'] } }
      ]
    });

    if (existingSquad) {
      return res.status(400).json({ message: 'You already have an active squad' });
    }

    // Create squad with leader as first member
    const squad = new Squad({
      name: name.trim(),
      description: description || '',
      leader: req.userId,
      members: [req.userId],
      maxMembers: maxMembers || 4
    });

    await squad.save();
    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

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

    res.json({
      count: squads.length,
      squads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve squad (Admin)
exports.approveSquad = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { adminComment } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    if (squad.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending squads can be approved' });
    }

    squad.status = 'approved';
    squad.approvedBy = req.userId;
    squad.approvedAt = new Date();
    squad.adminComment = adminComment || '';

    await squad.save();

    // Update users to add squad reference
    await User.updateMany(
      { _id: { $in: squad.members } },
      { squad: squadId }
    );

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');
    await squad.populate('approvedBy', '-password');

    res.json({
      message: 'Squad approved successfully',
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

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    if (squad.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending squads can be rejected' });
    }

    squad.status = 'rejected';
    squad.approvedBy = req.userId;
    squad.adminComment = adminComment || '';

    await squad.save();
    await squad.populate('leader', '-password');

    res.json({
      message: 'Squad rejected',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update squad name (Leader or Admin)
exports.updateSquadName = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { name } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: 'Squad name must be at least 3 characters' });
    }

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Check if user is leader or admin
    if (squad.leader.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ message: 'Only squad leader or admin can update squad name' });
    }

    squad.name = name.trim();
    await squad.save();

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

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
      .sort({ wins: -1, createdAt: -1 });

    res.json({
      count: squads.length,
      squads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's squad
exports.getUserSquad = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const squad = await Squad.findOne({
      $or: [
        { leader: userId },
        { members: userId }
      ],
      status: 'approved'
    })
      .populate('leader', '-password')
      .populate('members', '-password');

    if (!squad) {
      return res.status(404).json({ message: 'User not in any approved squad' });
    }

    res.json(squad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to squad (Leader only)
exports.addMember = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { userId } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Check if requester is squad leader
    if (squad.leader.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only squad leader can add members' });
    }

    // Check if squad is full
    if (squad.members.length >= squad.maxMembers) {
      return res.status(400).json({ message: 'Squad is full' });
    }

    // Check if user is already in squad
    if (squad.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already in this squad' });
    }

    // Check if user is in another squad
    const userSquad = await Squad.findOne({
      members: userId,
      status: 'approved'
    });

    if (userSquad) {
      return res.status(400).json({ message: 'User is already in another squad' });
    }

    squad.members.push(userId);
    await squad.save();

    // Update user
    await User.findByIdAndUpdate(userId, { squad: squadId });

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

    res.json({
      message: 'Member added successfully',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove member from squad (Leader only)
exports.removeMember = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { userId } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Check if requester is squad leader
    if (squad.leader.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only squad leader can remove members' });
    }

    // Cannot remove leader
    if (userId === squad.leader.toString()) {
      return res.status(400).json({ message: 'Cannot remove squad leader' });
    }

    squad.members = squad.members.filter(id => id.toString() !== userId);
    await squad.save();

    // Update user
    await User.findByIdAndUpdate(userId, { squad: null });

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

    res.json({
      message: 'Member removed successfully',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave squad
exports.leaveSquad = async (req, res) => {
  try {
    const { squadId } = req.params;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Cannot leave if you're the leader
    if (squad.leader.toString() === req.userId) {
      return res.status(400).json({ message: 'Squad leader cannot leave. Transfer leadership first.' });
    }

    // Check if user is in squad
    if (!squad.members.includes(req.userId)) {
      return res.status(400).json({ message: 'You are not in this squad' });
    }

    squad.members = squad.members.filter(id => id.toString() !== req.userId);
    await squad.save();

    // Update user
    await User.findByIdAndUpdate(req.userId, { squad: null });

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

    res.json({
      message: 'Successfully left squad',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get squad by ID
exports.getSquadById = async (req, res) => {
  try {
    const { squadId } = req.params;

    const squad = await Squad.findById(squadId)
      .populate('leader', '-password')
      .populate('members', '-password')
      .populate('approvedBy', '-password');

    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    res.json(squad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate squad (Leader or Admin)
exports.deactivateSquad = async (req, res) => {
  try {
    const { squadId } = req.params;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Check if user is leader or admin
    if (squad.leader.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ message: 'Only squad leader or admin can deactivate squad' });
    }

    squad.status = 'inactive';
    await squad.save();

    // Remove squad reference from all members
    await User.updateMany(
      { _id: { $in: squad.members } },
      { squad: null }
    );

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

    res.json({
      message: 'Squad deactivated',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== ADMIN SQUAD MANAGEMENT ==========

// Get all squads with analytics (Admin)
exports.getAllSquads = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'leader.username': { $regex: search, $options: 'i' } }
      ];
    }

    const squads = await Squad.find(query)
      .populate('leader', '-password')
      .populate('members', '-password')
      .populate('approvedBy', '-password')
      .sort({ createdAt: -1 });

    // Add analytics for each squad
    const squadsWithAnalytics = squads.map(squad => {
      const squadObj = squad.toObject();
      
      // Calculate squad stats
      const totalKills = squad.members.reduce((sum, member) => sum + (member.kills || 0), 0);
      const totalWins = squad.members.reduce((sum, member) => sum + (member.wins || 0), 0);
      const avgKills = squad.members.length > 0 ? (totalKills / squad.members.length).toFixed(2) : 0;
      const avgWins = squad.members.length > 0 ? (totalWins / squad.members.length).toFixed(2) : 0;

      squadObj.analytics = {
        totalMembers: squad.members.length,
        totalKills,
        totalWins,
        avgKills: parseFloat(avgKills),
        avgWins: parseFloat(avgWins),
        fillPercentage: ((squad.members.length / squad.maxMembers) * 100).toFixed(1)
      };

      return squadObj;
    });

    res.json({
      count: squadsWithAnalytics.length,
      squads: squadsWithAnalytics
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get squad analytics detail (Admin)
exports.getSquadAnalytics = async (req, res) => {
  try {
    const { squadId } = req.params;

    const squad = await Squad.findById(squadId)
      .populate('leader', '-password')
      .populate('members')
      .populate('approvedBy', '-password');

    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Detailed analytics
    const totalKills = squad.members.reduce((sum, member) => sum + (member.kills || 0), 0);
    const totalWins = squad.members.reduce((sum, member) => sum + (member.wins || 0), 0);
    const totalMatches = squad.members.reduce((sum, member) => sum + (member.matches || 0), 0);
    const avgKills = squad.members.length > 0 ? (totalKills / squad.members.length).toFixed(2) : 0;
    const avgWins = squad.members.length > 0 ? (totalWins / squad.members.length).toFixed(2) : 0;

    // Identify inactive members (no kills for 30 days assumed)
    const inactiveMembers = squad.members.map(member => ({
      _id: member._id,
      username: member.username,
      gameId: member.gameId,
      kills: member.kills,
      wins: member.wins,
      matches: member.matches,
      lastActive: member.createdAt,
      isInactive: !member.kills || member.kills === 0 // Simple inactivity check
    })).filter(m => m.isInactive);

    const analytics = {
      squadInfo: {
        name: squad.name,
        status: squad.status,
        leader: squad.leader.username,
        members: squad.members.length,
        maxMembers: squad.maxMembers,
        createdAt: squad.createdAt,
        approvedAt: squad.approvedAt
      },
      performance: {
        totalKills,
        totalWins,
        totalMatches,
        avgKills: parseFloat(avgKills),
        avgWins: parseFloat(avgWins),
        winRate: totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(2) : '0'
      },
      memberDetails: squad.members.map(m => ({
        _id: m._id,
        username: m.username,
        gameId: m.gameId,
        kills: m.kills,
        wins: m.wins,
        matches: m.matches,
        isLeader: m._id.toString() === squad.leader._id.toString()
      })),
      inactiveMembers,
      inactiveCount: inactiveMembers.length
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin kick member from squad
exports.adminKickMember = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { userId, reason } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Cannot kick leader
    if (userId === squad.leader.toString()) {
      return res.status(400).json({ message: 'Cannot kick squad leader' });
    }

    // Check if member is in squad
    if (!squad.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not in this squad' });
    }

    squad.members = squad.members.filter(id => id.toString() !== userId);
    await squad.save();

    // Update user
    await User.findByIdAndUpdate(userId, { squad: null });

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

    res.json({
      message: `Member kicked from squad${reason ? ' - ' + reason : ''}`,
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin add member to squad
exports.adminAddMember = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { userId } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Check if squad is full
    if (squad.members.length >= squad.maxMembers) {
      return res.status(400).json({ message: 'Squad is full' });
    }

    // Check if user is already in squad
    if (squad.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already in this squad' });
    }

    // Check if user is in another squad
    const userSquad = await Squad.findOne({
      members: userId,
      status: 'approved'
    });

    if (userSquad) {
      return res.status(400).json({ message: 'User is already in another squad' });
    }

    squad.members.push(userId);
    await squad.save();

    // Update user
    await User.findByIdAndUpdate(userId, { squad: squadId });

    await squad.populate('leader', '-password');
    await squad.populate('members', '-password');

    res.json({
      message: 'Member added to squad by admin',
      squad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin delete squad completely
exports.adminDeleteSquad = async (req, res) => {
  try {
    const { squadId } = req.params;
    const { reason } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }

    // Remove squad reference from all members
    await User.updateMany(
      { _id: { $in: squad.members } },
      { squad: null }
    );

    // Delete squad
    await Squad.findByIdAndDelete(squadId);

    res.json({
      message: `Squad deleted${reason ? ' - ' + reason : ''}`,
      deletedSquadId: squadId,
      deletedMembersCount: squad.members.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get squad statistics summary (Admin Dashboard)
exports.getSquadStats = async (req, res) => {
  try {
    const totalSquads = await Squad.countDocuments();
    const approvedSquads = await Squad.countDocuments({ status: 'approved' });
    const pendingSquads = await Squad.countDocuments({ status: 'pending' });
    const rejectedSquads = await Squad.countDocuments({ status: 'rejected' });
    const inactiveSquads = await Squad.countDocuments({ status: 'inactive' });

    const allSquads = await Squad.find()
      .populate('members', 'kills')
      .lean();

    const totalMembers = allSquads.reduce((sum, squad) => sum + squad.members.length, 0);
    const totalSquadWins = allSquads.reduce((sum, squad) => sum + (squad.wins || 0), 0);
    const totalSquadLosses = allSquads.reduce((sum, squad) => sum + (squad.losses || 0), 0);

    const stats = {
      squads: {
        total: totalSquads,
        approved: approvedSquads,
        pending: pendingSquads,
        rejected: rejectedSquads,
        inactive: inactiveSquads
      },
      performance: {
        totalMembers,
        totalWins: totalSquadWins,
        totalLosses: totalSquadLosses
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
