const prisma = require("../database");

module.exports.createPrivateMessage = async ({
  conversationId,
  senderId,
  message,
  attachments,
}) => {
  const newMessage = await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId: senderId,
      message: message,
      attachments: attachments,
      status: "SENT",
    },
  });

  return newMessage;
};
