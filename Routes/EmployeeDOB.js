const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const {Emp} = require("../Model/Employee")
const app = express();
app.use(bodyParser.json())
const employee = express.Router();
const date = new Date();
employee.route("/add").post(async (req, res) => {
  try {
    const DOB = new Emp(req.body)
    console.log(DOB)
    await DOB.save();
    res.json({DOB})
    
  } catch (error) {
    res.json({ message: error })
  }
});

module.exports = employee;