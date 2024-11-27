const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence au modèle User
      required: true,
    },
    content: {
      type: String,
      required: true, // Le contenu du message est obligatoire
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', // Référence au modèle Chat
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Référence optionnelle pour un destinataire spécifique
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
