const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  emailVerified: Date,
  image: String,
  hashedPassword: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  conversationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  seenMessageIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  accounts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
});

module.exports = mongoose.model('User', userSchema);