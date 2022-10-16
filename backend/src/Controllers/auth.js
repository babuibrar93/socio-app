const User = require("../Models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const user = new User({
      username,
      password: hashPassword,
      firstname,
      lastname,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      validity
        ? res.status(200).json({
            message: "Login successfully",
            data: user,
          })
        : res.status(200).json({
            message: "Wrong password",
          });
    } else {
      return res.status(200).json({
        message: `No account by the username ${username}`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user) {
      const { password, ...otherCredentials } = user._doc;
      res.status(200).json({
        message: "user found",
        data: otherCredentials,
      });
    } else {
      res.status(200).json({
        message: "No user found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (user) {
      res.status(200).json({
        message: "User updated successfully",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "No user found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({
        message: "User deleted successfully",
      });
    } else {
      res.status(200).json({
        message: "No user found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const follow = async (req, res) => {
  const { id } = req.params; // wants to follow this user - someone I want to follow
  const { currentUserId } = req.body; // the user who wants to follow - me

  try {
    if (id === currentUserId) {
      res.status(403).json({
        message: "Access denied",
      });
    } else {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json({
          message: "User Followed",
        });
      } else {
        res.status(200).json({
          message: "Already following",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unfollow = async (req, res) => {
  const { id } = req.params; // wants to unfollow this user - someone I want to unfollow
  const { currentUserId } = req.body; // the user who wants to unfollow - me

  try {
    if (id === currentUserId) {
      res.status(403).json({
        message: "Access denied",
      });
    } else {
      const followUser = await User.findById(id);
      const followingUser = await User.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json({
          message: "User Unfollowed",
        });
      } else {
        res.status(200).json({
          message: "First follow the user",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUserById,
  updateUserById,
  deleteUserById,
  follow,
  unfollow,
};
