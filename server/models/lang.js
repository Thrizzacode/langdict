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
  createdDate: {
    type: "Date",
    default: Date.now,
    required: true,
  },
  updatedDate: {
    type: "Date",
    default: Date.now,
  },
});

langSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedDate: Date.now() });
  next();
});

// 建立 Model
const Lang = mongoose.model("Lang", langSchema);

export default Lang;
