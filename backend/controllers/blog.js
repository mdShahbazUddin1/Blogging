const { BlogModel } = require("../models/post.model");

const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.userId;
    let imageDataURL = null;
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const imageBase64 = imageBuffer.toString("base64");
      imageDataURL = `data:${req.file.mimetype};base64,${imageBase64}`;
    }

    const newBlog = await BlogModel.create({
      title,
      content,
      author:authorId,
      image: imageDataURL,
    });

    res.status(201).send({ msg: "New blog created", newBlog });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addPost,
};
