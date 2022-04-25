const Sequelize = require("sequelize");

// required when just running npm run seed
require("dotenv").config();

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/messenger",
  {
    logging: false,
  }
);

module.exports = db;
