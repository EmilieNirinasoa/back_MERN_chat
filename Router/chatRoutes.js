const express = require('express');
const router = express.Router();
const {
    accessChat,
    fetchChats,
    fetchGroups,
    createGroupChat,
    groupExit,
    addSelfToGroup,
} = require('../Controllers/chatControllers');
const protect  = require('../middleware/authMiddleware');

// Routes pour les chats privés
router.route('/')
    .post(protect, accessChat) // Accéder à un chat
    .get(protect, fetchChats); // Récupérer tous les chats de l'utilisateur

// Routes pour les groupes
router.post('/createGroup',protect, createGroupChat); // Créer un groupe

router.route('/fetchGroups')
    .get(protect, fetchGroups); // Récupérer tous les groupes

router.route('/groupExit')
    .put(protect, groupExit); // Quitter un groupe

router.route('/addSelfToGroup')
    .put(protect, addSelfToGroup); // Ajouter soi-même à un groupe

module.exports = router;
