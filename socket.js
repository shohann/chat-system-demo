const conversationService = require("./services/conversation.service");
const messageService = require("./services/message.service");
const userService = require("./services/user.service");
let active_users = [];

module.exports.socketServer = (nameSpace) => {
  nameSpace.on("connection", (socket) => {
    const currentUserId = socket.handshake.query.userId;
    let active_user = active_users.find((e) => e === currentUserId);

    if (!active_user) {
      active_users.push(currentUserId);
    }
    active_user = active_users.find((e) => e === currentUserId);

    socket.on("joinChat", async (data) => {
      const conversationId = data.conversationId;

      try {
        const validConversation =
          await conversationService.findConversationById(conversationId);

        socket.join(validConversation.id.toString());
        socket.broadcast
          .to(validConversation.id.toString())
          .emit("userJoined", {
            event: "userJoined",
            userId: currentUserId,
            conversationId: validConversation.id,
          });
      } catch (error) {
        socket.emit("error_message", { message: error.message });
      }
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, conversationId, message, attachments } = data;

      const newMessage = await messageService.createPrivateMessage({
        senderId,
        conversationId,
        message,
        attachments,
      });

      const senderDetails = await userService.findUserById(senderId);

      socket.broadcast.to(conversationId.toString()).emit("receivedMessage", {
        id: newMessage.id,
        event: "receivedMessage",
        senderDetails: senderDetails,
        conversationId: newMessage.conversationId,
        message: message ? message : null,
        attachments: attachments ? attachments : null,
      });
    });

    socket.on("typing", (data) => {
      const { conversationId } = data;
      socket.broadcast
        .to(conversationId.toString())
        .emit("typing", { event: "typing", userId: currentUserId });
    });

    socket.on("stopTyping", (data) => {
      const { conversationId } = data;
      socket.broadcast
        .to(conversationId.toString())
        .emit("stopTyping", { event: "stopTyping", userId: currentUserId });
    });

    socket.on("disconnect", () => {
      active_users = active_users.filter((user) => user !== currentUserId);
      socket.broadcast.emit("userDisconnected", {
        event: "userDisconnected",
        userId: currentUserId,
      });
    });
  });
};
