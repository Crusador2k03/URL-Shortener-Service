const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 30,
    },

    nanoid: {
      type: String,
      required: true,
      unique: true,
    },

    originalUrl: {
      type: String,
      required: true,
    },

    isCustom: {
      type: Boolean,
      default: false,
    },

    visitHistory: [
      {
        timestamp: {
          type: Number,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("URL", urlSchema);