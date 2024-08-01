const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  User: {
    type: String,
    required:true
  },
  EmpName: {
    type: String,
    required: true
  },
  EMPID: {
    type: String,
    required: true,
    unique:true
  },
  Email: {
    type: String,
    required: true,
    unique:true
  },
  DOB: {
    type: Date,
    required: true
  },
  Date: {
    type: String,
    required:true
  }
},{strict: true});
const Emp = mongoose.model("EmpDOB", EmployeeSchema);
module.exports = {Emp}