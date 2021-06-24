module.exports = function (sequelize, DataTypes) {
  var Reports = sequelize.define("reports", {
    noCopyPaste: DataTypes.INTEGER,
    noSpeech: DataTypes.INTEGER,
    noTabSwitch: DataTypes.INTEGER,
    noFace: DataTypes.INTEGER,
  });
  return Reports;
};
