const mongoose = require("mongoose");
const RegistrationSchema = new mongoose.Schema(
  {
    Studentname: String,
    JobID: Number,
    Branch: String,
    CGPA: Number,
    passoutYear: Number,
    emailID: String,
    phonenumber: Number,
    HomeAddress: String,
    JobStatus: String,
    JobApplicationdate: String,
  },
  { timestamps: true }
);

const registrationmodel = mongoose.model("Registrations", RegistrationSchema);
module.exports = registrationmodel;
