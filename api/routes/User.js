var express = require("express");
var router = express.Router();
const UserController = require("../controllers/UserController");

router.put("/:id", UserController.put);

module.exports = router;
