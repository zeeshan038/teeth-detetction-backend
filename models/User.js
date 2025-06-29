const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profileImage: { type: String, default: "" },
    password: {
      type: String,
      required: true,
      select: false,
      minlenght: [6, "Password must be at least 6 characters"],
      maxlength: [200, "Password cannot excede 200 characters"],
    },
    favScore: {
      type: Number,
      default: 0,
    },
    profileImg: { type: String, default: "" },
    verificationCode: { type: String, select: false },
    otpLastSentTime: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
