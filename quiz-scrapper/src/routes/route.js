const express = require("express");
const router = express.Router();

const bot_controller = require("../controllers/bot.ctrl");

router.get("/", bot_controller.home_view);
router.post("/", bot_controller.get_data);

module.exports = router;
