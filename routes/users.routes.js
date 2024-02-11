const router = require("express").Router();
const { User } = require("../models/users.model");
const { authorize } = require("../middleware/auth.mw");
const { userVerify } = require("../middleware/userVerify.mw");

const {
  addNewUser,
  editUser,
  getAllUsers,
  getUserById,
  releaseUser,
  updateUserParams,
  toggleBusinessStatus,
  deleteUser,
} = require("../controllers/users.controller");

router.get("/me", authorize, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// GET user by id - same user or admin
router.get("/:id", authorize, userVerify, getUserById);

// GET all users - only admin
router.get("/", authorize, getAllUsers);

// Add (POST) new user
router.post("/", addNewUser);

// Update (PUT) user - by user or admin
router.put("/:id", authorize, userVerify, editUser);

// PATCH release locked user by id
router.patch("/release/:id", authorize, userVerify, releaseUser);

// PATCH update any params for user
router.patch("/user/:id", authorize, userVerify, updateUserParams);

// PATCH toggle is business
router.patch("/isBusiness/:id", authorize, userVerify, toggleBusinessStatus);

// DELETE user - same user or admin
router.delete("/:id", authorize, userVerify, deleteUser);

module.exports = router;
