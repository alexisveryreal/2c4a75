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

    // Simple update, doesn't update all fields just 'seen' field for now
    // If updateAll is present means there was messages before the one sent that need to be marked
    const { seen, id, updateAll, senderId } = req.body;

    if (updateAll) {
      const result = await Message.update(
        { seen: seen },
        {
          where: {
            seen: false,
            senderId: senderId,
          },
        }
      );
      res.json(result);
    } else {
      const [rowsUpdate, [message]] = await Message.update(
        { seen: seen },
        {
          returning: true,
          where: { id: id },
        }
      );
      // returns the saved message just in case we need it in the future
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
