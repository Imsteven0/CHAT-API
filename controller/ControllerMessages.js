const SchemaMessage = require("../models/message");

exports.listMessagesByIdConversation = async (req, res, next) => {
  try {
    const IdConversation = req.params.IdConversation;
    const messages = await SchemaMessage.find({
      conversationId: IdConversation,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "No se pudo recuperar mensajes" });
  }
};

exports.newMessage = async (req, res, next) => {
  try {
    const message = new SchemaMessage({
      body: req.body.message,
      conversationId: req.body.IdConversation,
      senderId: req.body.UserIdSender,
    });
    const savedMessage = await message.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar la conversacion" });
  }
};
