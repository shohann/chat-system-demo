const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const errorHandler = require("./utils/errors");
const userRouter = require("./routes/user.route");
const conversationRouter = require("./routes/conversation.routes");
const documentRouter = require("./routes/document.routes");

app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/users", userRouter);
app.use("/conversations", conversationRouter);
app.use("/documents", documentRouter);

errorHandler(app);

module.exports = app;
