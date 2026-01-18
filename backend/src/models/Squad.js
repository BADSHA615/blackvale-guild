const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Squad name is required'],
    trim: true,
    minlength: [3, 'Squad name must be at least 3 characters long'],
    maxlength: [50, 'Squad name cannot exceed 50 characters']
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxMembers: {
    type: Number,
    default: 4,
    min: [2, 'Squad must have at least 2 members'],
    max: [10, 'Squad cannot have more than 10 members']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adminComment: {
    type: String,
    default: '',
    maxlength: [500, 'Admin comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  }
});

// Pre-save validation
squadSchema.pre('save', async function(next) {
  if (this.isModified('members')) {
    // Ensure leader is in members list
    if (!this.members.includes(this.leader)) {
      this.members.unshift(this.leader);
    }
    // Check member limit
    if (this.members.length > this.maxMembers) {
      throw new Error(`Squad cannot have more than ${this.maxMembers} members`);
    }
  }
  next();
});

// Index for better query performance
squadSchema.index({ leader: 1 });
squadSchema.index({ status: 1 });
squadSchema.index({ members: 1 });

module.exports = mongoose.model('Squad', squadSchema);
