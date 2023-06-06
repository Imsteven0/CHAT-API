const mongoose = require('mongoose');
const SchemaConversation = require("../models/conversation");
const SchemaUser = require("../models/user");

exports.listChatsUsers = async (req, res, next) => {
  try {
    const yourUserId = req.params.userId;
    const conversation = await SchemaConversation.findOne({ userIds: yourUserId }).select('userIds').exec();

    if (!conversation) {
      return res.status(404).json({ error: "No se encontró la conversación" });
    }

    const userIds = conversation.userIds.map(userId => new mongoose.Types.ObjectId(userId));

    // Obtener información de los usuarios
    const users = await SchemaUser.find({ _id: { $in: userIds } });

    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "No se pudo recuperar usuarios" });
  }
};

exports.listConversation = async (req, res, next) => {
  try {
    const users = await SchemaConversation.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "No se pudo recuperar conversaciones" });
  }
};

exports.listConversationByUserID = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const conversations = await SchemaConversation.find({ userIds: userId });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "No se pudo recuperar conversaciones" });
  }
};

exports.newChat = async (req, res, next) => {
  try {
    const conversation = new SchemaConversation({
      userIds: [req.body.id_user_1, req.body.id_user_2],
    });
    const savedConversation = await conversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar la conversacion" });
  }
};
