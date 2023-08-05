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

const getAllBlog = async (req,res) =>{
  try {
    const blog = await BlogModel.find()
    res.status(200).send(blog)
    
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const getCreatorBlog = async(req,res) => {
  try {
    const authorId = req.userId

    const blog = await BlogModel.find({author:authorId})

    if(!blog || blog.length === 0) return res.status(400).send({msg:"No blog found for this author"});


    res.status(200).send(blog)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.userId;
    const { title, content } = req.body;

    // Find the blog by its ID
    const blog = await BlogModel.findById(id);

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    // Check if the authenticated user is the author of the blog
    if (blog.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to update this blog" });
    }

      let imageDataURL = null;
      if (req.file) {
        const imageBuffer = req.file.buffer;
        const imageBase64 = imageBuffer.toString("base64");
        imageDataURL = `data:${req.file.mimetype};base64,${imageBase64}`;
      }

    // Update the blog with the new title and content
    blog.title = title;
    blog.content = content;
     blog.image = imageDataURL

    await blog.save();

    res
      .status(200)
      .json({ msg: "Blog updated successfully", updatedBlog: blog });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteBlog = async (req,res) => {
  try {
    const { id } = req.params;
    const authorId = req.userId;

    // Find the blog and delete it based on its _id and author
    const blog = await BlogModel.findOneAndDelete({
      _id: id,
      author: authorId,
    });

    // Check if the blog was found and deleted
    if (!blog) {
      return res
        .status(404)
        .json({
          msg: "Blog not found or you are not authorized to delete this blog",
        });
    }

    res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message)
  }

}

module.exports = {
  addPost,
  getAllBlog,
  getCreatorBlog,
  updateBlog,
  deleteBlog
};
