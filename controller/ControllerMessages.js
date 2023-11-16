const SchemaMessage = require("../models/message");
const SchemaConversation = require("../models/conversation");

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

exports.ListMessageByID = async (req, res, next) => {
  try {
    const IdConversation = req.params.idMessage;
    const messages = await SchemaMessage.find({
      _id: IdConversation,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "No se pudo recuperar el mensaje" });
  }
};

exports.listMessagesByUsersIds = async (req, res, next) => {
  try {
    const conversation = await SchemaConversation.find({
      $and: [
        { userIds: { $elemMatch: { $eq: req.body.userOriginId } } },
        { userIds: { $elemMatch: { $eq: req.body.userAuxId } } }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ error: "No se encontró la conversación" });
    }

    const messages = await SchemaMessage.find({
      conversationId: conversation[0]._id,
    });

    res.json(messages);
  } catch (error) {
    console.log(error)
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

    // Actualizar el arreglo messagesIds en el documento de conversación
    const conversation = await SchemaConversation.findByIdAndUpdate(
      req.body.IdConversation,
      {
        $push: { messagesIds: savedMessage._id },
        lastMessageAt: Date.now(),
      },
      { new: true }
    );

    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el mensaje" });
  }
};

exports.saveNewMessage = async (data) => {
  try {
    const message = new SchemaMessage({
      body: data.message,
      conversationId: data.IdConversation,
      senderId: data.UserIdSender,
    });
    const savedMessage = await message.save();

    // Actualizar el arreglo messagesIds en el documento de conversación
    const conversation = await SchemaConversation.findByIdAndUpdate(
      data.IdConversation,
      {
        $push: { messagesIds: savedMessage._id },
        lastMessageAt: Date.now(),
      },
      { new: true }
    );

    return savedMessage;
  } catch (error) {
    console.log(error);
    return { error: "No se pudo guardar el mensaje" };
  }
};