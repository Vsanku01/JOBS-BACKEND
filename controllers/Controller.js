const User = require("../models/Model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const moment = require("moment");

// Sign up
module.exports.signup = async (req, res, next) => {
  const { email, password, category } = req.body;

  User.findOne({ email: email }, (data) => {
    if (data === null) {
    }
  });
  if (category === "user") {
    const { resume } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(password, salt);
      const user = await User.create({
        email: email,
        password: encrypted,
        category,
        resume,
        jobsApplied: [],
        jobsPosted: [],
      });
      res
        .status(201)
        .json({ flag: true, category, message: "User created successfully" });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ flag: false, category, message: "Failed to create user" });
    }
  } else if (category === "recruiter") {
    try {
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(password, salt);
      const user = await User.create({
        email: email,
        password: encrypted,
        category,
        jobsApplied: [],
        jobsPosted: [],
      });
      res
        .status(201)
        .json({ flag: true, category, message: "User created successfully" });
    } catch (err) {
      res
        .status(400)
        .json({ flag: false, category, message: "Failed to create user" });
    }
  }
};

// Login
module.exports.login = async (req, res) => {
  const { email, password, category } = req.body;
  User.findOne({ email: email, category: category }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // If error in procedure.
        if (err) {
          res.json({ message: err });
        }
        // If passwords are same.
        if (result) {
          res.json({
            flag: true,
            category: category,
            message: "Login Successful!",
          });
        }

        // If passwords are not matching...
        else {
          res.json({
            flag: false,
            message: "You have entered a wrong password",
          });
        }
      });
    }
    // User not found in the database
    else {
      res.json({
        flag: false,
        message: "User not found, please signup and then try again",
      });
    }
  });
};

// Add JOB Posting.
module.exports.addPosting = async (req, res) => {
  const { name, type, email, location, title, description, company } = req.body;
  // name, type, email, location, title, description, companyName
  let id = mongoose.Types.ObjectId();

  if (!type || !company || !location || !title || !email || !description) {
    return res.json({
      message: "Please fill all the  required fields before posting..",
    });
  }
  // create a new posting
  const newPost = {
    id,
    type,
    company,
    location,
    title,
    description,
    email,
  };

  // Find the user and add it...
  User.findOne({ email: email }, (err, data) => {
    if (err || !data) {
      return res.json({
        message: "User not found, Please enter your email correctly...",
      });
    } else {
      data.jobsPosted.push(newPost);
      // save changes..
      data.save((err) => {
        if (err) {
          return res.json({ message: "Failed to add new Job Posting" });
        }
        return res.json({ message: "Job Posted Successfully" });
      });
    }
  });
};

// Apply for JOB.
module.exports.apply = async (req, res) => {
  const { id, userEmail, recruiterEmail, dateApplied } = req.body;

  // 1. Find the userEmail and get (email, resume )
  // 2. Add it to the recruiter email (peopleApplied [] )
  User.findOne({ email: userEmail }, (err, data) => {
    if (data === null) {
      return res.status(400).json({ message: "User not found" });
    } else {
      const applyJob = {
        id: id,
        userEmail: userEmail,
        resume: data.resume,
        dateApplied: moment().format("YYYY-MM-DD"),
      };

      User.findOne({ email: recruiterEmail }, (error, user) => {
        if (user === null) {
          return res.status(400).json({ message: "Recruiter not found" });
        } else {
          user.peopleApplied.push(applyJob);
          user.save((errMsg) => {
            if (errMsg) {
              return res.json({ message: "Failed to apply for Job" });
            }
            return res.json({
              message: "Applied to JOB Successfully",
            });
          });
        }
      });
    }
  });
};

// GET list of all jobs
module.exports.listJobs = async (req, res) => {
  let jobsArray = [];
  try {
    const filter = {};
    const all = await User.find(filter);
    all.forEach((ele) => {
      ele.jobsPosted.forEach((job) => {
        jobsArray.push(job);
      });
      // jobsArray = [...jobsArray, ele.jobsPosted];
    });
    return res.json({ data: jobsArray });
  } catch (err) {
    return res.json({ error: err });
  }
};

// View all candidate applied..
module.exports.viewCandidates = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }, (err, user) => {
    return res.json({ message: user.peopleApplied });
    if (err) {
      return res.json({ message: "Recruiter not found" });
    }
  });
};
