// const express = require('express');
const { Admin } = require('mongodb');
const userModel = require('../modals/userModals');
const ExpressAsyncHandler = require('express-async-handler');
const generateToken= require('../Config/generateToken')
// Contrôleur pour l'inscription
// Contrôleur pour l'inscription

const bcrypt = require('bcryptjs');

const hashPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log("Mot de passe haché :", hashedPassword);
};


const registerController = ExpressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Tous les champs nécessaires doivent être remplis");
    }

    // Vérifiez si l'email existe déjà
    const userEmailExist = await userModel.findOne({ email });
    if (userEmailExist) {
        res.status(400);
        throw new Error("L'email est déjà utilisé");
    }

    // Vérifiez si le nom existe déjà
    const userNameExist = await userModel.findOne({ name });
    if (userNameExist) {
        res.status(400);
        throw new Error("Le nom est déjà utilisé");
    }

    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword, // Utiliser le mot de passe haché
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                Admin: user.isAdmin,
                token: generateToken(user._id),
            },
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message,
        });
    }
});


// Contrôleur pour la connexion (à implémenter si nécessaire)
const loginController = ExpressAsyncHandler(async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(400);
        throw new Error("Tous les champs nécessaires doivent être remplis");
    }

    const user = await userModel.findOne({ name });

    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            Admin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Nom d'utilisateur ou mot de passe invalide");
    }
});

module.exports = {
    registerController,
    loginController,
};
