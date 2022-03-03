const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  tasks: [
    {
      taskTitle: { type: String, trim: true },
      taskComment: { type: String, trim: true },
      lastDate: { type: String },
      completed: { type: Boolean, default: false },
      createdAt: {
        type: Date,
        default: () => Date.now(),
      },
      updatedAt: {
        type: Date,
        default: () => Date.now(),
      },
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const UserData = mongoose.model("UserData", userSchema);

module.exports = UserData;
