var db = require("../models/database");

// // POST /report
// module.exports.create = async (req, res) => {
//   try {
//     let result = await db.Reports.create({
//       name: req.body.name,
//       noCopyPaste: req.body.noCopyPaste,
//       noTabSwitch: req.body.noTabSwitch,
//       noPeople: req.body.noPeople,
//       studentId: req.user.id,
//     });
//     res.status(201).send(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Server error.");
//   }
// };

//post report
module.exports.create = async (req, res) => {
  try {
    let report = await db.Reports.create({
      noCopyPaste: req.body.noCopyPaste,
      noSpeech: req.body.noSpeech,
      noTabSwitch: req.body.noTabSwitch,
      noFace: req.body.noFace,
      studentId: req.user.id,
    });

    res.status(201).send(report);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

// PUT /notes/:id
module.exports.put = async (req, res) => {
  db.Reports.findByPk(req.params.id)
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
