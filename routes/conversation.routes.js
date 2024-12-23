const express = require("express");
const conversationRouter = express.Router();
const conversationService = require("../services/conversation.service");

conversationRouter.post("/", async (req, res, next) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    const conversation = await conversationService.createPrivateConversation({
      senderId,
      receiverId,
    });

    res.status(201).send(conversation);
  } catch (error) {
    next(error);
  }
});

conversationRouter.post("/groups", async (req, res) => {
  try {
    const name = req.body.name;
    const userIds = req.body.userIds;

    const groupConversation = await conversationService.createGroupConversation(
      {
        name,
        userIds,
      }
    );

    res.status(201).send(groupConversation);
  } catch (error) {
    next(error);
  }
});

conversationRouter.post("/groups/add-member", async (req, res) => {
  try {
    const conversationId = req.body.conversationId;
    const userIds = req.body.userIds;

    const groupConversation = await conversationService.addUsersToConversation({
      userIds,
      conversationId,
    });

    res.status(201).send(groupConversation);
  } catch (error) {
    next(error);
  }
});

module.exports = conversationRouter;
