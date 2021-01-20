const multer = require("multer");

const MINE_TYPE = {
    "images/jpg": "jpg",
    "images/jpeg": "jpg",
    "images/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, "images")
    },
    filename: (req, file, callback) =>{
        const name = file.originalname.split(" ").join("_");
        const extension = MINE_TYPE[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    }
});

module.exports = multer({storage}).single("image");