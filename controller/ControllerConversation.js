const SchemaConversation = require("../models/conversation");

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
    const conversation = new ConveSchemaConversationrsation({
      userIds: [req.body.id_user_1, req.body.id_user_2],
    });
    const savedConversation = await conversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar la conversacion" });
  }
};
