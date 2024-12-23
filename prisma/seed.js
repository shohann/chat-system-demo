const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedUser() {
  const firstUser = await prisma.user.create({
    data: {
      email: "user1@gmail.com",
      userName: "user1",
      password: "12345",
      firstName: "User 1 First",
      lastName: "Name",
    },
  });

  const secondUser = await prisma.user.create({
    data: {
      email: "user2@gmail.com",
      userName: "user2",
      password: "12345",
      firstName: "User 2 First",
      lastName: "Name",
    },
  });

  const thirdUser = await prisma.user.create({
    data: {
      email: "user3@gmail.com",
      userName: "user3",
      password: "12345",
      firstName: "User 3 First",
      lastName: "Name",
    },
  });
}

async function main() {
  await seedUser();
}

main();
