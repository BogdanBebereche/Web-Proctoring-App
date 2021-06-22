module.exports = function (sequelize, DataTypes) {
  var Students = sequelize.define("students", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    score: {
      type: DataTypes.INTEGER,
    },
  });
  return Students;
};
