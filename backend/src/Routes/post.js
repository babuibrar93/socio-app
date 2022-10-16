const express = require("express");
const router = express.Router();

const {
  create,
  getPostById,
  getAllPostByUserId,
  getAllPost,
  updatePostById,
  deletePostById,
  likeDislikePost,
  getTimelinePosts,
} = require("../Controllers/post");

router.post("/create", create);
router.get("/getPostById/:id", getPostById);
router.get("/getAllPostByUserId/:id", getAllPostByUserId);
router.get("/getAllPost", getAllPost);
router.patch("/updatePostById/:id", updatePostById);
router.delete("/deletePostById/:id", deletePostById);
router.post("/likeDislikePost/:id", likeDislikePost);
router.get("/getTimelinePosts/:userId", getTimelinePosts);

module.exports = router;
