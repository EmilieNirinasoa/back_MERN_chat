const mongoose = require('mongoose');

// Définir le schéma utilisateur
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        trim: true, // Supprime les espaces inutiles
        minlength: [3, "Le nom doit comporter au moins 3 caractères"]
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true, // Assure que chaque email est unique
        match: [/\S+@\S+\.\S+/, "Veuillez entrer un email valide"] // Validation de format
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        minlength: [6, "Le mot de passe doit comporter au moins 6 caractères"]
    }
}, {
    timestamps: true // Ajoute automatiquement `createdAt` et `updatedAt`
});

// Créer le modèle utilisateur
const User = mongoose.model('User', userSchema);

module.exports = User;
