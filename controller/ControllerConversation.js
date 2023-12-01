const mongoose = require('mongoose');
const SchemaConversation = require("../models/conversation");
const SchemaUser = require("../models/user");
const SchemaMessage = require("../models/message");
const user = require('../models/user');

exports.listChatsUsers = async (req, res, next) => {
    try {
        const yourUserId = req.params.userId;
        const conversations = await SchemaConversation.find({userIds: yourUserId}).select('userIds').exec();
        if (conversations.length === 0) {
            return res.status(404).json({error: "No se encontraron conversaciones"});
        }

        const userIds = [];
        conversations.forEach(conversation => {
            conversation.userIds.forEach(userId => {
                userIds.push(new mongoose.Types.ObjectId(userId));
            });
        });

        // Obtener información de los usuarios
        const users = await SchemaUser.find({_id: {$in: userIds}});

        const conversationsWithMessages = [];
        for (const conversation of users) {
            if (conversation._id == yourUserId) {
                const messages = await SchemaMessage.find({
                    conversationId: conversation.conversationIds.toString(),
                });
                const conversationWithMessages = {
                    ...conversation.toObject(),
                    messages
                };
                conversationsWithMessages.push(conversationWithMessages);
            } else {
                const conversationWithMessages = {
                    ...conversation.toObject()
                };
                conversationsWithMessages.push(conversationWithMessages);
            }
        }

        res.json(conversationsWithMessages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "No se pudo recuperar usuarios"});
    }
};

exports.listConversation = async (req, res, next) => {
    try {
        const users = await SchemaConversation.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({error: "No se pudo recuperar conversaciones"});
    }
};

exports.listConversationByUserID = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        let conversations = await SchemaConversation.find({userIds: userId}).lean();

        for (let index = 0; index < conversations.length; index++) {
            const obj = conversations[index];
            const users = await SchemaUser.find({_id: {$in: obj.userIds}}).lean();
            const messages = await SchemaMessage.find({_id: {$in: obj.messagesIds}}).lean();
            conversations[index].messages = messages;
            conversations[index].users = users;
        }

        res.json(conversations);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "No se pudo recuperar conversaciones"});
    }
};


exports.newChat = async (req, res, next) => {
    try {
        let userId = '6557ee223a8c7f4382f194b8';
        let userData = await SchemaUser.findOne({_id: userId});

        let chat = await Promise.all(
            userData.conversationIds.map(async (conversationId) => {
                let conversation = await SchemaConversation.findById(conversationId);
                if (conversation !== null) {
                    let [users, messages] = await Promise.all([
                        SchemaUser.find({_id: {$in: conversation.userIds}}).lean(),
                        SchemaMessage.find({_id: {$in: conversation.messagesIds}}).lean()
                    ]);
                    return {...conversation.toObject(), users, messages};
                }
            })
        );

        let chats = chat.filter(Boolean);
        userData = {...userData.toObject(), chats};
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "No se pudo recuperar conversaciones"});
    }
};


exports.getConversations = async (userId) => {
    try {
        let conversations = await SchemaConversation.find({userIds: userId}).lean();

        for (let index = 0; index < conversations.length; index++) {
            const obj = conversations[index];
            const users = await SchemaUser.find({_id: {$in: obj.userIds}}).lean();
            conversations[index].messages = await SchemaMessage.find({_id: {$in: obj.messagesIds}}).lean();
            conversations[index].users = users;
        }

        return conversations;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.createNewChat = async (data) => {
    try {
        const conversation = new SchemaConversation({
            userIds: [data.idUser, data.idOriginUser],
        });
        const savedConversation = await conversation.save();

        const user1 = await SchemaUser.findByIdAndUpdate(
            data.idUser,
            {
                $push: {conversationIds: savedConversation._id},
            },
            {new: true}
        );

        const user2 = await SchemaUser.findByIdAndUpdate(
            data.idOriginUser,
            {
                $push: {conversationIds: savedConversation._id},
            },
            {new: true}
        );

        return savedConversation;
    } catch (error) {
        console.log(error);
        return [];
    }
};