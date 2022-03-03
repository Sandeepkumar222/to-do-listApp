const expressAsyncHandler = require("express-async-handler");
const UserData = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = expressAsyncHandler(async (req, res) => {
  let { name, email, password, pic } = req.body;
  console.log("hi", req.body);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const checkMailId = await UserData.findOne({ email });

  if (checkMailId) {
    res.status(400).send({ Error: "Email alraedy exist" });
  }

  password = password.toString();

  //password encrption
  const salt = bcrypt.genSaltSync(10);
  password = await bcrypt.hash(password, salt);

  const user = await UserData.create({
    name,
    email,
    password,
    pic,
  });

  //Generating token and sending token as response
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: token,
  });
});

const loginUser = expressAsyncHandler(async (req, res) => {
  let { email, password } = req.body;

  const user = await UserData.findOne({ email });

  password = password.toString();

  if (user) {
    //check for password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).send({ error: "User or password is incorrect" });

    //Generating token and sending token as response
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    if (token) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        tasks: user.tasks,
        pic: user.pic,
        token: token,
      });
    } else {
      return res.status(500).send({ error: "Failed to create token" });
    }
  } else {
    return res.status(400).send({ error: "User or password is incorrect" });
  }
});

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserData.findById(decoded._id).select("-password");
      // console.log("here",req.user)

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed, verification failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const allTasks = expressAsyncHandler(async (req, res) => {
  try {
    const users = await UserData.find({ _id: { $eq: req.user._id } });
    res.send(users);
  } catch (error) {
    res.status(401);
    throw new Error("Could not fetch data");
  }
});

const postTasks = expressAsyncHandler(async (req, res) => {
  const { tasks } = req.body;

  const user = await UserData.findOneAndUpdate(
    { _id: { $eq: req.user._id } },
    {
      $push: { tasks: tasks },
    },
    {
      new: true,
    }
  );

  if (!user) {
    res.status(400);
    throw new Error("Task not posted");
  } else {
    res.json(user);
  }
});

const delTasks = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await UserData.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $pull: { tasks: { _id: { $eq: id } } },
    },
    {
      new: true,
    }
  );

  if (!user) {
    res.status(400);
    throw new Error("Task not deleted");
  } else {
    res.json(user);
  }
});

const putTasks = expressAsyncHandler(async (req, res) => {
  const { tasks } = req.body;

  const user = await UserData.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { tasks: tasks },
    },
    {
      new: true,
    }
  );

  if (!user) {
    res.status(400);
    throw new Error("Task not deleted");
  } else {
    res.json(user);
  }
});

const EditUser = expressAsyncHandler(async (req, res) => {
  const { name, pic, email } = req.body;

  const user = await UserData.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { name, pic, email },
    },
    {
      new: true,
    }
  );

  if (!user) {
    res.status(400);
    throw new Error("Task not deleted");
  } else {
    res.json(user);
  }
});

module.exports = {
  registerUser,
  loginUser,
  protect,
  allTasks,
  postTasks,
  delTasks,
  putTasks,
  EditUser,
};
