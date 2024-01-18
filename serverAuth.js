require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Token = require("./models/token");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (e) => console.log(e));
db.once("open", () => console.log("Connected to database"));

app.use(cors());
app.use(express.json());

const refreshTokens = [];

app.post("/token", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    const exToken = await Token.findOne({ token: refreshToken });
    if (exToken == null) {
      return res.sendStatus(403);
    }
    // if (!refreshTokens.includes(refreshToken)) {
    //   return res.sendStatus(403);
    // }
    await Token.deleteOne(exToken);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
      if (err) {
        console.log(err.message);
        return res.send("something Error");
      }
      const accessToken = generateAccessToken({ name: user.name });
      const refreshToken = jwt.sign(
        { name: user.name },
        process.env.REFRESH_TOKEN
      );
      const token1 = new Token({ token: refreshToken });
      await token1.save();
      console.log(user);
      res.json({ accessToken, refreshToken });
    });
  } catch (e) {
    console.log(e.message);
  }
});

app.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await Token.deleteOne({ token: refreshToken });
    res.sendStatus(204);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  try {
    const name = req.body.username;
    const user = { name };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
    const token1 = new Token({ token: refreshToken });
    await token1.save();
    // refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      throw new Error("Enter all credentials");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const euser = await User.findOne({ email });
    if (euser) {
      throw new Error("User already exists");
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (e) {
    console.log(e.message);
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "5s" });
}

app.listen(4000);
