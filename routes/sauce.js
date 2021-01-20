const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, sauceCtrl.createSauce);
// router.put("/:id", auth, sauceCtrl.modifySauce);
// router.delete("/:id", auth, sauceCtrl.deleteSauce);
// router.post("/:id/like", auth, sauceCtrl.likedSauce)

module.exports = router;