const db = require("../db");
const { DataTypes } = require("sequelize");

const conversationOfUsers = db.define("user_conversation", {
  lastSeen: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
  },
});

module.exports = conversationOfUsers;
