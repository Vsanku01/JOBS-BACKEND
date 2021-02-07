const { Router } = require("express");
const controller = require("../controllers/Controller");

const router = Router();

// Signup or Add member
router.post("/signup", controller.signup);
// Login
router.post("/login", controller.login);
// Add Job Posting
router.post("/postjob", controller.addPosting);
// Apply to Job
router.post("/applyjob", controller.apply);
// List all JOBS
router.get("/listjobs", controller.listJobs);
// View candidate applied for jobs
router.post("/view-candidates", controller.viewCandidates);

module.exports = router;
