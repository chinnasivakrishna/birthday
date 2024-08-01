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
    const{Email} = req.body
    const user = await Emp.findOne({ Email })
    console.log(user)
    if (user) {
      console.log("failed")
      res.send("Email")
    }
    else {
      console.log("Succsss")
      const DOB = new Emp(req.body)
    await DOB.save();

    res.json({DOB})
    }
    
    
  } catch (error) {
    res.json({ message: error })
  }
});

employee.route("/data/:user").get(async (req, res) => {
  try {
    const { user } = req.params;
    const DOB = await Emp.find({ User:user })
    res.json({DOB})
    
  } catch (error) {
    res.json({ message: error })
  }
});

employee.route("/update/:user").put(async (req, res) => {
  try {
    const { user } = req.params;
    const { EmpName, Email, EMPID, Date } = req.body
    console.log(user)
    console.log(req.body)
    const DOB = await Emp.findOneAndUpdate({ _id: user }, { $set: { EmpName,Email,EMPID,Date} 
})
    console.log(DOB)
    res.json({DOB})
    
  } catch (error) {
    res.json({ message: error })
  }
});

module.exports = employee;