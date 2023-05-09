const mongoose = require("mongoose");
const jobsSchema = new mongoose.Schema(
  {
    Companyname: String,
    Jobrole: String,
    JobLocation: String,
    Salary: String,
    NoofVacany: Number,
    BranchEligibility: String,
    MinimumCGPA: Number,
    Deadlinedateforregistration: String,
  },
  { timestamps: true }
);
const jobsmodel = mongoose.model("Jobs", jobsSchema);
module.exports = jobsmodel;
