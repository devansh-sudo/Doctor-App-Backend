const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
      unique: [true, "Phone is already taken"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    notifcation: {
      type: Array,
      default: [],
    },
    seennotification: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
