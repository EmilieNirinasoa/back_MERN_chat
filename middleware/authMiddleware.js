const jwt = require('jsonwebtoken');
const userModel = require('../modals/userModals');

const protect = async (req, res, next) => {
    let token;

    // Vérifiez si le token est fourni dans l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extraire le token
            if (!token) {
                return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
            }

            // Vérifiez le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id).select('-password'); // Chargez l'utilisateur
            next();
        } catch (error) {
            console.error("Erreur de token :", error);
            return res.status(401).json({ message: "Non autorisé, token invalide" });
        }
    } else {
        // Si aucun token n'est présent
        return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
    }
};

module.exports = protect;
