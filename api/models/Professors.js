module.exports = function (sequelize, DataTypes) {
  var Professors = sequelize.define("professors", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
  return Professors;
};
