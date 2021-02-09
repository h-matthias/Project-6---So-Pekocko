const Sauce = require("../models/Sauce");
const fs = require("fs");

/** Retourne toute les sauce **/
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

/** retourne une seule sauce **/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};
/** crée une sauce **/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;//supprmie l'id renvoyer par le front pour le créer via mongoDB
    const sauce = new Sauce({
        ...sauceObject,//copie directement les champ formulaire dans les champs du schema sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //crée une addresse URL dynamique
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(()=> res.status(201).json({message: "Sauce enregisté"}))
    .catch(() =>  res.status(400).json({error}))
};

/** Modification sauce  
 *  si image modifié on parse le json pour recuper et modifier le champs et l'url de l'image
 *  sinon modifi que la requete du body sans tenir compte de l'image
 ***/
exports.modifySauce = (req, res, next) => {
            const sauceObject = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body};
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: "Sauce Modifié"}))
                .catch(error => res.status(400).json({ error })); 
};

/** Supprime la sauce et aussi l'image associer **/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id:req.params.id})
                .then(() => res.status(200).json({message: "Sauce suprimé"}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

/***
 * function pour aimer ou ne pas aimer une sauce et d'annuler le choix
 *  verifie si l'utilisateur aime ou pas la sauce
 *  si j'aime = 1 , on ajoute userId au tableau userLike et incrément likes.
 *  si j'aime = -1 ,  on ajoute userId au tableau userDislike et incrément dislikes
 *  si j'aime = 0, soit l'utilisateur aimait donc retire du tableau userLike et decrément like
 *                 soit n'aimait pas donc retire du tableau userDislike et decrément dislike
 ***/
exports.likedSauce =(req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    let inLiked;
    let inDisLiked;
    Sauce.findOne({_id: req.params.id})
    .then( sauce =>{
        for (const user of sauce.usersLiked) {
            if (user === userId){
                inLiked = true;
            }
        }
        for (const user of sauce.usersDisliked) {
            if (user === userId){
                inDisLiked = true;
            }
        }
        switch (like){
        case 1: 
            if (!inLiked && !inDisLiked){
                sauce.usersLiked.push(userId);
                ++sauce.likes;
                sauce.save()
                .then(() => res.status(200).json({message: "l'utilisateur à aimer la sauce"}))
                .catch(() =>  res.status(400).json({error}))
            }
            break;
        case 0:
            if (inLiked && !inDisLiked){
                sauce.usersLiked.remove(userId);
                --sauce.likes;
                sauce.save()
                .then(() => res.status(200).json({message: "l'utilisateur n'aime plus la sauce"}))
                .catch(() =>  res.status(400).json({error}))
            } else if (!inLiked && inDisLiked){
                sauce.usersDisliked.remove(userId);
                --sauce.dislikes;
                sauce.save()
                .then(() => res.status(200).json({message: "l'utilisateur à arreter de plus aimer la sauce"}))
                .catch(() =>  res.status(400).json({error}))
            }
            break;
        case -1:
            if (!inLiked && !inDisLiked){
                sauce.usersDisliked.push(userId);
                ++sauce.dislikes;
                sauce.save()
                .then(() => res.status(200).json({message: "l'utilisateur n'aime pas la sauce"}))
                .catch(() =>  res.status(400).json({error}))
            }
            break;
        }
    })
    .catch(error => res.status(500).json({ error }));
    
};