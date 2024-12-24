const prisma = require("../database");
const {
  NotFoundError,
  ValidationError,
} = require("../utils/errors/app.errors");

module.exports.createPrivateConversation = async ({ senderId, receiverId }) => {
  const userIds = [senderId, receiverId];
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  if (users.length !== 2) {
    throw new NotFoundError("One or both users not found.");
  }

  const conversation = await prisma.conversation.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
    include: {
      users: true,
    },
  });

  return conversation;
};

module.exports.findConversationById = async (id) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: id,
    },
  });

  return conversation;
};

module.exports.createGroupConversation = async ({ name, userIds }) => {
  if (!name || !userIds || !Array.isArray(userIds) || userIds.length < 2) {
    throw new ValidationError(
      "Invalid input. Provide a name and at least two user IDs."
    );
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  console.log(users);

  if (users.length !== userIds.length) {
    throw new NotFoundError("One or more users not found.");
  }

  const newConversation = await prisma.conversation.create({
    data: {
      name,
      type: "GROUP",
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
    include: {
      users: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return newConversation;
};

module.exports.addUsersToConversation = async ({ conversationId, userIds }) => {
  if (
    !conversationId ||
    !userIds ||
    !Array.isArray(userIds) ||
    userIds.length === 0
  ) {
    throw new ValidationError(
      "Invalid input. Provide a conversation ID and at least one user ID."
    );
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { users: true },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found.");
  }

  if (conversation.type !== "GROUP") {
    throw new ValidationError("Cannot add users to a non-group conversation.");
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  if (users.length !== userIds.length) {
    throw new NotFoundError("One or more users not found.");
  }

  const newUserIds = userIds.filter(
    (id) => !conversation.users.some((user) => user.id === id)
  );

  if (newUserIds.length === 0) {
    throw new ValidationError(
      "All specified users are already in the conversation."
    );
  }

  const updatedConversation = await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      users: {
        connect: newUserIds.map((id) => ({ id })),
      },
    },
    include: {
      users: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return updatedConversation;
};

module.exports.getConversationDetails = async (conversationId) => {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      users: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found.");
  }

  return conversation;
};
