const express = require("express");
const userRouter = express.Router();
const userService = require("../services/user.service");

userRouter.post("/", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res) => {
  try {
    const users = await userService.getUserList();

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await userService.findUserByEmail(email);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/user-conversations", async (req, res) => {
  try {
    const user = await userService.getUserConversations(
      Number(req.query.userId)
    );

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
