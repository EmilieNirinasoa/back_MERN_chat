const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors= require('cors')
const userRoutes=require('./Router/userRoutes')
const chatRoutes=require('./Router/chatRoutes')
const messageRoutes=require('./Router/messageRoutes')
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
app.use(cors({
    origin:"https://chat-mern-front.vercel.app",
}))
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route principale
app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/user",userRoutes)
app.use("/chat",chatRoutes)
app.use("/message",messageRoutes)
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
const PORT = process.env.PORT;

// Lancement du serveur
const server=app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});

const io = new Server(server, { 
    cors:{
        origin:"*",
    },
    pingTimeout:60000
});

io.on("connection", (socket) => {
 socket.on("setup",(user)=>{
    socket.join(user.data._id);
    socket.emit("connectzd")
 });
 socket.on("join chat",(room)=>{
    socket.join(room);
    socket.emit("room",room)
 });
 socket.on("new message",(newMessagesStatus)=>{
    var chat= newMessagesStatus.chat;
    if (!chat.users) {
        return console.log('chat.users not defined')
    }
    chat.users.forEach((users) => {
        if (user._id == newMessagesStatus.sender._id) {
            return;
        }
        socket.in(user._id).emit("message received",newMessageReceived)
    });
 });

 


});

