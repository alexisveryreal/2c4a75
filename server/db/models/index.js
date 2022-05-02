const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationOfUsers = require("./conversationOfUsers");

User.belongsToMany(Conversation, { through: ConversationOfUsers });
Conversation.belongsToMany(User, { through: ConversationOfUsers });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
};
