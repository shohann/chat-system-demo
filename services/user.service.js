const prisma = require("../database");
const { ValidationError } = require("../utils/errors/app.errors");

module.exports.createUser = async ({
  email,
  userName,
  password,
  firstName,
  lastName,
}) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email.toLowerCase() },
        { userName: userName.toLowerCase() },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      throw new ValidationError("Email already in use");
    }
    if (existingUser.userName.toLowerCase() === userName.toLowerCase()) {
      throw new ValidationError("Username already taken");
    }
  }

  const newUser = await prisma.user.create({
    data: {
      email: email,
      userName: userName.toLowerCase(),
      password: password,
      firstName,
      lastName,
    },
  });

  return newUser;
};

module.exports.getUserList = async () => {
  const users = await prisma.user.findMany();

  return users;
};
