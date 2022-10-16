const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserById,
  updateUserById,
  deleteUserById,
  follow,
  unfollow,
} = require("../Controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/getUserById/:id", getUserById);
router.patch("/updateUserById/:id", updateUserById);
router.delete("/deleteUserById/:id", deleteUserById);
router.put("/follow/:id", follow);
router.put("/unfollow/:id", unfollow);

module.exports = router;
