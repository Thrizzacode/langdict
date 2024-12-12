import mongoose from "mongoose";

// 建立 Schema
const langSchema = new mongoose.Schema({
  langCode: {
    type: "string",
    required: true,
    unique: true,
  },
  zhCN: {
    type: "string",
  },
  en: {
    type: "string",
  },
});

// 建立 Model
const Lang = mongoose.model("Lang", langSchema);

export default Lang;
