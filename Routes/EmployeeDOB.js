const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const {Emp} = require("../Model/Employee")
const app = express();
app.use(bodyParser.json())
const employee = express.Router();
employee.route("/add").post(async (req, res) => {
  try {
    const DOB = new Emp(req.body)
    console.log(DOB)
    await DOB.save();
    
  } catch (error) {
    res.json({ message: error })
  }
});

module.exports = employee;