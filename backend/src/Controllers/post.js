const Post = require("../Models/post");
const User = require("../Models/user");
const mongoose = require("mongoose");

const create = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json({
      message: "Post created successfull",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    post
      ? res.status(200).json({
          message: "Post found",
          data: post,
        })
      : res.status(200).json({
          message: "Post not found",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPostByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await Post.find({ id });
    posts
      ? res.status(200).json({
          message: "Posts found",
          data: posts,
        })
      : res.status(200).json({
          message: "Posts not found",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find();
    posts
      ? res.status(200).json({
          message: "Posts found",
          data: posts,
        })
      : res.status(200).json({
          message: "Posts not found",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(200).json({
        message: "Post not found",
      });
    }

    if (!req.body.userId) {
      return res.status(200).json({
        message: "kindly provide userId",
      });
    }

    if (req.body.userId === post.userId) {
      await post.updateOne({ $set: req.body });

      res.status(200).json({
        message: "Post updated successfully",
        data: post,
      });
    } else {
      return res.status(403).json({
        message: "Action denied",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(200).json({
        message: "Post not found",
      });
    }
    if (!req.body.userId) {
      return res.status(200).json({
        message: "kindly provide userId",
      });
    }

    if (req.body.userId === post.userId) {
      await post.deleteOne();

      res.status(200).json({
        message: "Post deleted successfully",
        data: post,
      });
    } else {
      return res.status(403).json({
        message: "Action denied",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeDislikePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    if (!userId) {
      return res.status(200).json({
        message: "kindly provide userId",
      });
    }
    if (!post) {
      return res.status(200).json({
        message: "Post not found",
      });
    } else {
      if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });
        res.status(200).json({
          message: "Post liked",
        });
      } else {
        await post.updateOne({ $pull: { likes: userId } });
        res.status(200).json({
          message: "Post unliked",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get Timeline POsts
const getTimelinePosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const currentUserPosts = await Post.find({ userId: userId });
    const followingPosts = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      message: "Posts",
      data: currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        }),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  create,
  getPostById,
  getAllPostByUserId,
  getAllPost,
  updatePostById,
  deletePostById,
  likeDislikePost,
  getTimelinePosts,
};
