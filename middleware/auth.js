const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodetToken = jwt.verify(token, process.env.JWT_PASS);
        const userId = decodetToken.userId;
        if (req.body.userId && req.body.userId !== userId){
            throw "Utilisateur non valable";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | "Requête non autentifiée" });
    }
};