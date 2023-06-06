const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  name: String,
  isGroup: Boolean,
  messagesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  userIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Conversation", conversationSchema);
