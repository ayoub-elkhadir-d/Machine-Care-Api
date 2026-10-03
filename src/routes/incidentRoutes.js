const express = require("express");
const router = express.Router();

const {protect} =require("../middlewares/authMiddleware");
const {cretepanne} = require("../controllers/incidentController");
router.use(protect);
router.post('/',cretepanne);
module.exports = router;
