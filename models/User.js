const mongoose = require ("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: {type: String, unique: true, required: true, unique: "Adresse Email déjà enregistrée." },
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);