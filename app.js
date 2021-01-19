require ("dotenv").config();
const express = require ("express");
const mongoose = require ("mongoose");

const userRoutes = require ("./routes/user");

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzllw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {   useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use((req, res, next) => {
    res.json({messge: "message bien recu"});
    next;
});


app.use("/api/auth", userRoutes);

module.exports = app;