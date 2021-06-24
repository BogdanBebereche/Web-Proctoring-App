const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const db = {};
const basename = path.basename(module.filename);
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.log("Unable to connect to the database: ", error);
  });

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

db.Students = require("./Students")(sequelize, Sequelize);
db.Reports = require("./Reports")(sequelize, Sequelize);

db.Students.hasMany(db.Reports); //<--- a student has many notes
db.Reports.belongsTo(db.Students); //<--- a note belongs to a student

module.exports = db;
