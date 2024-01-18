const mongoose = require("mongoose");
const User = require("./user");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = new mongoose.model("post", postSchema);
