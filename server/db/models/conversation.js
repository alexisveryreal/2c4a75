const db = require("../db");
const Message = require("./message");
const User = require("./user");
const ConversationOfUsers = require("./conversationOfUsers");

const Conversation = db.define("conversation", {});

Conversation.findAndJoinConvo = async function (userId, conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
    },
    include: [
      {
        model: User,
        attributes: ["id"],
      },
      { model: Message },
    ],
  });

  const currentUsers = conversation
    .toJSON()
    .users.find((user) => user.id === userId);

  if (currentUsers) {
    console.error("User exist in conversation cannot join :(");
    return null;
  }
  const lastSeenIndex = conversation.messages.length - 1;

  await conversation.addUser(userId, { through: { lastSeen: lastSeenIndex } });

  return conversation;
};

Conversation.readConversation = async function (userId, conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
    },
    include: [
      { model: Message },
      {
        model: User,
        where: {
          id: userId,
        },
        attributes: ["id"],
      },
    ],
  });

  const lastSeenIndex = conversation.messages.length - 1;

  const convos = await ConversationOfUsers.findOne({
    where: { userId, conversationId },
  });

  await convos.update({ lastSeen: lastSeenIndex });

  return lastSeenIndex;
};

Conversation.initiateConvo = async function (currentUsers, initialMessage) {
  const conversation = await Conversation.create();
  await conversation.addUser(currentUsers, { through: { lastSeen: -1 } });

  if (initialMessage) {
    await Message.create({
      ...initialMessage,
      conversationId: conversation.id,
    });
  }

  return conversation;
};

Conversation.leave = async function (userId, conversationId) {
  const conversation = await Conversation.findOne({
    where: { id: conversationId },
    include: [{ model: User, where: { id: userId }, attributes: ["id"] }],
  });
  await conversation.removeUser(userId);
  return conversation;
};

module.exports = Conversation;
