const express = require("express");
const router = express.Router();

//TODO TINE MINTE DE REQUIRE ASTA!!
require("dotenv").config();
const db = require("../models/database");

router.get("/", function (req, res) {
  res.status(200).send("Express API is functional.");
});

router.post("/db/create_student", async function (req, res) {
  try {
    await db.Students.create({
      id: req.body.id,
      email: req.body.email,
      score: null,
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send("Student not added.");
  }
});

router.get("/db/creation", async function (req, res) {
  try {
    await db.sequelize.sync({ force: true });
    res.status(201).send("Database tables created.");
  } catch (error) {
    res.status(500).send("Database tables not created.");
    console.log(error);
  }
});

module.exports = router;
