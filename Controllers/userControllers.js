const express = require('express');
const userModel = require('../modals/userModals');
const ExpressAsyncHandler = require('express-async-handler');

// Contrôleur pour l'inscription
const registerController = ExpressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Vérification des champs obligatoires
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Tous les champs nécessaires doivent être remplis");
    }

    // Vérifier si l'email existe déjà
    const userEmailExist = await userModel.findOne({ email });
    if (userEmailExist) {
        res.status(400);
        throw new Error("L'email est déjà utilisé");
    }

    // Vérifier si le nom existe déjà
    const userNameExist = await userModel.findOne({ name });
    if (userNameExist) {
        res.status(400);
        throw new Error("Le nom est déjà utilisé");
    }

    // Création d'un nouvel utilisateur
    try {
        const user = await userModel.create({ name, email, password });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500);
        throw new Error("Erreur lors de la création de l'utilisateur");
    }
});

// Contrôleur pour la connexion (à implémenter si nécessaire)
const loginController = () => {
    // Votre logique de connexion ici
};

module.exports = {
    registerController,
    loginController,
};
