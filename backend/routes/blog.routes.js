
const express = require("express");
const blogController = require("../controllers/blog");
const { auth } = require("../middlewares/auth");
const multer = require("multer");

const blogRoute = express.Router();
blogRoute.use(express.json({ limit: "50mb" }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Set the maximum file size to 50MB
  },
});

// POST route for adding a new post with an image
blogRoute.post("/addpost",auth, upload.single("image"), blogController.addPost);

module.exports = blogRoute;


module.exports = {
  blogRoute,
};
