const Sequelize = require("sequelize");
const db = require("../db");

const GroupMessage = db.define("group_message", {
  // assuming id, createdAt, updatedAt are defined

  // every message will be sent in a channel
  // thinking similar to that of a discord channel
  // this is equivalent to a conversation
  channel_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  // same as id but more explicit
  message_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sender_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = GroupMessage;
