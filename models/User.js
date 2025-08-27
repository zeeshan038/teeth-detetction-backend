const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },  
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlenght: [6, "Password must be at least 6 characters"],
      maxlength: [200, "Password cannot excede 200 characters"],
    },
    dob: {
      type: Date,
      required: true,
    },
    phoneNo :{
      type: Number
    },
    role : {
      type: String,
      enum: ["patient", "nurse"],
      default: "patient",
    },
    speciality : {
      type: String,
      default : ""
    },
    profileImage : {
      type: String,
      default :""
    },
    bio:{
      type : String ,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

// Reuse existing model if already compiled to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
