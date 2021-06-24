var express = require("express");
var router = express.Router();
const ReportsController = require("../controllers/ReportsController");

router.post("/", ReportsController.create);
// router.put("/update", ReportsController.put);

module.exports = router;
