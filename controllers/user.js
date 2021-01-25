require ("dotenv").config();

const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/** inscription de l'utilisateur avec cryptage du pass **/
exports.signup = (req, res, next) => {
    bcrypt.hash (req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(()=> res.status(201).json({ message : "utilisateur créé"}))
            .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

/** connection de l'utilisateur avec authentification token **/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (!user){
                return res.status(401).json({error : "utilisateur non trouvé"})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error : "mot de passe incorect"})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId : user._id },
                            process.env.JWT_PASS,
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}