const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player'
  },
  gameId: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: null
  },
  kills: {
    type: Number,
    default: 0
  },
  deaths: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  matches: {
    type: Number,
    default: 0
  },
  weeklyRank: {
    type: Number,
    default: 0
  },
  weeklyScore: {
    type: Number,
    default: 0
  },
  squad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Squad',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
