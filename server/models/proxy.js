import mongoose from "mongoose";

// 建立 Schema
const proxySchema = new mongoose.Schema({
  proxylist: {
    type: "array",
    required: true,
  },
});

// 建立 Model
const Proxy = mongoose.model("Porxy", proxySchema);

export default Proxy;
