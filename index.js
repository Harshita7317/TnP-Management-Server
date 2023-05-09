const express = require("express"); //used for creating APIs
const app = express();
const { connectDatabase } = require("./Connections/connection"); //for database connection
const JOBS_MODELS = require("./models/Jobs");
const REGISTRATIONS_MODELS = require("./models/Registrations");
app.use(express.json()); //enables json transportation

//Creating post api for receiving data from frontend to backend
app.post("/api/Jobdescription", async (req, res) => {
  try {
    //console.log(req.body);
    const { Companyname } = req.body;
    const countjobs = await JOBS_MODELS.countDocuments({ Companyname });
    if (countjobs >= 2) {
      return res
        .status(400)
        .json({ message: "Error! Already posted two jobs" });
    }
    const jobsobject = {
      Companyname: req.body.name,
      Jobrole: req.body.role,
      JobLocation: req.body.location,
      Salary: req.body.salary,
      NoofVacany: req.body.noofvacancy,
      BranchEligibility: req.body.brancheligibility,
      MinimumCGPA: req.body.mincgpa,
      Deadlinedateforregistration: req.body.deadline,
    };
    console.log(jobsobject);
    const Jobs = await JOBS_MODELS(jobsobject);
    await Jobs.save();
    return res.json({ success: true, message: "data saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
});

//TnP can update the job details
app.put("/updateindetails/:id", async (req, res) => {
  try {
    const data = await JOBS_MODELS.findByIdAndUpdate(req.params.id, {
      BranchEligibility: "CSE",
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//TnP can delete the jobs
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletepostings = await JOBS_MODELS.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//Students can see job postings according to their branch and CGPA
app.get(
  "/api/fileteredJobs/ :BranchEligibility/: MinimumCGPA",
  async (req, res) => {
    try {
      const { BranchEligibility, MinimumCGPA } = req.params;
      const sortedstudents = await JOBS_MODELS.find({
        BranchEligibility: { $in: BranchEligibility },
        MinimumCGPA: { $lte: MinimumCGPA },
      });
      return res.json({ success: true, data: sortedstudents });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
);
//A student cannot register in the same job twice
app.post("/api/Studentdetails", async (req, res) => {
  try {
    const { JobID, emailID } = req.body;
    const count = await REGISTRATIONS_MODELS.countDocuments({ JobID, emailID });
    if (count > 0) {
      return res.status(400).json({ message: "Applied" });
    }
    const Studentsobject = {
      Studentname: req.body.name,
      JobID: req.body.id,
      Branch: req.body.branch,
      CGPA: req.body.cgpa,
      passoutYear: req.body.passoutyear,
      emailID: req.body.email,
      phonenumber: req.body.contactnumber,
      HomeAddress: req.body.homeaddress,
      JobStatus: req.body.jobstatus,
      JobApplicationdate: req.body.jobapplication,
    };
    console.log(jobsobject);
    const Jobs = await JOBS_MODELS(jobsobject);
    await Jobs.save();
    return res.json({ success: true, message: "data saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
});

//TnP can change the job status of students
app.put("/updatestatus/:id", async (req, res) => {
  try {
    const data = await REGISTRATIONS_MODELS.findByIdAndUpdate(req.params.id, {
      JobStatus: "Hired",
    });
    return res.json({ success: true, data: data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
});

//Students can change their details too
app.put("/updatebystudents/:id", async (req, res) => {
  try {
    const update = await REGISTRATIONS_MODELS.findByIdAndUpdate(req.params.id, {
      emailID: "harshitamishra7313@gmail.com",
    });
    return res.status(200).json({ success: true, data: update });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//Tnp can see all the registered students for any job
app.get("/api/registeredstudents", async (req, res) => {
  try {
    const registeredstu = await REGISTRATIONS_MODELS.find();
    return res.json({ success: true, data: registeredstu });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});
//Tnp can see all the hired, shortlisted and rejected candidates
app.get("/api/registerdstudent/:JobStatus/:JobID", async (req, res) => {
  const { JobStatus, JobID } = req.params;
  try {
    const data = await REGISTRATIONS_MODELS.find({
      JobStatus,
      JobID,
    });
    return res.json({ success: true, data: data });
  } catch {
    console.log(error);
    return res.status(400).json({ success: false, errro: error.message });
  }
});

//Students must be able to view all the jobs applied to
app.get("/api/ appliedjobs/:emailID /:JobID", async (req, res) => {
  const { emailID, JobID } = req.params;
  try {
    const sortedstudents = await REGISTRATIONS_MODELS.find({ emailID, JobID });
    return res.json({ success: true, data: sortedstudents });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//Studetns can delete their registrations
app.delete("/deleteregistrationbystu/:id", async (req, res) => {
  try {
    const deletedata = await REGISTRATIONS_MODELS.findByIdAndDelete(
      req.params.id
    );
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

connectDatabase();
const PORT = 8000;
app.listen(PORT, async () => {
  console.log("server is running at Port", PORT);
});
