const express = require("express");
const {
  registerUser,
  loginUser,
  protect,
  allTasks,
  postTasks,
  delTasks,
  putTasks,
  EditUser,
} = require("../services/userServices");

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", loginUser);
router.route("/tasks").get(protect, allTasks);

router.route("/tasks").post(protect, postTasks);
router.route("/tasks").put(protect, putTasks);
router.route("/userEdit").put(protect, EditUser);
router.route("/tasks").delete(protect, delTasks);

module.exports = router;
