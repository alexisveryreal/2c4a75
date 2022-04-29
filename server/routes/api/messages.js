const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender, seen } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId,
        seen,
      });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      seen: false,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { seen, senderId, recipientId } = req.body;

    const findConvo = await Conversation.findConversation(
      senderId,
      recipientId
    );

    const unAuthorizedCheck =
      req.user.dataValues.id !== recipientId &&
      req.user.dataValues.id !== senderId;

    // If we can't find a conversation with these users
    // or if for some reason the logged in user is not the recipient or the sender
    // then we send an unauthorized response
    if (findConvo === null || unAuthorizedCheck) {
      return res.sendStatus(401);
    }

    // Updates all messages from the senderId to seen
    const [rowsUpdate, message] = await Message.update(
      { seen: seen },
      {
        returning: true,
        where: {
          seen: false,
          senderId: senderId,
        },
      }
    );
    // returns last updated message
    res.json(message[message.length - 1].dataValues);
  } catch (error) {
    next(error);
  }
});

// Gets all messages in a certain conversation from a user, and seen or not.
// returns the data itself and the count of said data.
router.get("/:conversationId/:userId/:seen", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { conversationId, seen, userId } = req.params;
    const messages = await Message.findAndCountAll({
      where: {
        seen: seen,
        conversationId: conversationId,
        senderId: userId,
      },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
