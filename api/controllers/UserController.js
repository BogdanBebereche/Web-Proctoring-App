var db = require("../models/database");

module.exports.put = async (req, res) => {
  db.Students.findByPk(req.params.id)
    .then((message) => {
      if (message) {
        message
          .update(req.body)
          .then((result) => {
            res.status(201).json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send("db error");
          });
      } else {
        res.status(404).send("res not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("db error");
    });
};
