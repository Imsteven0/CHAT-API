const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  body: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seenIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Message", messageSchema);
