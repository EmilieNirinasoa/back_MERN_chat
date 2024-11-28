const asyncHandler = require('express-async-handler');
const Chat = require('../modals/chatModels');
const Message = require('../modals/messageModel');

// Fonction pour récupérer tous les messages d'un chat
const allMessages = asyncHandler(async (req, res) => {
    
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("receiver")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Fonction pour envoyer un message
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return res.sendStatus(400); // Mauvaise demande si contenu ou chatId manquent
    }

    const newMessage = {
        sender: req.user._id, // Id de l'utilisateur connecté
        content: content,
        chat: chatId
    };

    try {
        let message = await Message.create(newMessage);

        // On récupère les détails du message avec populate
        message = await message.populate("sender", "name");
        message = await message.populate("chat");
        message = await message.populate("receiver");
        message = await message.populate({
            path: "chat.users",
            select: "name email"
        });

        // Mise à jour du dernier message dans le chat
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message); // Envoi du message comme réponse
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    allMessages,
    sendMessage
};
