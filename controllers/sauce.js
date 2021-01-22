const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(sauce => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(()=> res.status(201).json({message: "Sauce enregisté"}))
    .catch(() =>  res.status(400).json({error}))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: "Sauce Modifié"}))
    .catch(() => res.status(200).json({error}));
};

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