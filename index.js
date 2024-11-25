const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes=require('./Router/userRoutes')
const app = express();
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route principale
app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("user/",userRoutes)

// Fonction pour connecter à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Quitter l'application en cas d'échec
    }
};

// Connexion à la base de données
connectDB();

// Définir le port
const PORT = process.env.PORT || 5000;

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
