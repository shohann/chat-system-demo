const express = require("express");
const documentRouter = express.Router();
const multer = require("../middlewares/multer");
const createImageUrls = require("../utils/createImageUrls");
const baseURL = process.env.BASE_URL;

documentRouter
  .route("/upload")
  .post(multer.array("files", 5), (req, res, next) => {
    try {
      const files = req.files;
      const imageURLs = createImageUrls(files, baseURL);

      res.status(201).send({
        images: imageURLs,
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = documentRouter;
