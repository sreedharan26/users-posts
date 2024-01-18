require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Post = require("./models/post");
const User = require("./models/user");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (e) => console.log(e));
db.once("open", () => console.log("Connected to database"));

app.use(cors());
app.use(express.json());

const posts = [
  {
    username: "Dharan",
    title: "post 1",
  },
  {
    username: "dharan",
    title: "post 2",
  },
];

app.get("/users", authenticateToken, async (req, res) => {
  if (req.user) {
    try {
      const user = await User.findOne({ username: req.user.name });
      const posts = await Post.find({ user: user._id });
      console.log(user);
      res.json({ user, posts }).status(201);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
    // res.json(posts.filter((post) => post.username === req.user.name));
  } else {
    res.sendStatus(404);
  }
  //   const post = posts.filter((x) => x.username === userName);
  //   res.json(post);
});

app.post("/:userId/posts", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const post = await Post.create({
      title: req.body.title,
      user: user._id,
    });
    console.log("created");
    const posts = await Post.find();
    res.status(201).json({ message: "Post created", posts });
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});
// app.get('/user')

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      console.log(err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.listen(5001);
