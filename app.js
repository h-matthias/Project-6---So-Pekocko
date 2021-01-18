const express = require ("express");
const mongoose = require ("mongoose");

const app = express();

mongoose.connect("mongodb+srv://readWrite:u2BlMzTF9mw8Bu3u@cluster0.lzllw.mongodb.net/SopekoDB?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.json({messge: "message bien recu"});
    next;
});


module.exports = app;