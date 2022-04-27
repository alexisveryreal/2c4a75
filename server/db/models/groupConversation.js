const { Op, DataTypes } = require("sequelize");
const db = require("../db");

const GroupConversation = db.define("conversation", {
  // assuming id, createdAt, updatedAt is already defined
  users: {
    // never worked with sequelize but an array of user id's
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
  },
});

// find group conversation given an Id of the user which should be in this conversation

GroupConversation.findConversation = async function (userId) {
  const conversation = await GroupConversation.findOne({
    where: {
      users: {
        [Op.contains]: [userId],
      },
    },
  });

  return conversation;
};

module.exports = GroupConversation;
