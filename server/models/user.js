import mongoose from "mongoose";

// 建立 Schema
const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  pwd: {
    type: "string",
    required: true,
  },
});

// 建立 Model
const User = mongoose.model("User", userSchema);

export default User;
