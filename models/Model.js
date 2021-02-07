const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

/*
Users:
      email,
      password,
      Jobs Applied
Recruiter:
      email,
      password,
      Post a job,
      view candidates
*/

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter an password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  category: { type: String, required: true },
  peopleApplied: [],
  jobsPosted: [],
  resume: { type: String, required: false },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
