const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  EmpName: {
    type: String,
    required: true
  },
  EMPID: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    required: true
  }
});
const Emp = mongoose.model("EmpDOB", EmployeeSchema);
module.exports = {Emp}