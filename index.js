require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const { sendBirthdayEmail } = require("./mailer");
require('./db');
const app = express();

app.use(cors({
  origin: ["https://birthday-mail-ten.vercel.app"],
  methods: ["GET", "POST"],
  credentials:true
}));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.json({
        message: 'The API is working!'
    });
});

const employee = require("./Routes/EmployeeDOB");
const { Emp } = require("./Model/Employee");

const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
console.log(date);

app.use("/api/employees", employee);

app.get("/send", async (req, res) => {
  try {
    const data = await Emp.find();
    for (let i = 0; i < data.length; i++) {
      const date1 = data[i].DOB;
      const month1 = date1.getMonth() + 1;
      const day1 = date1.getDate();
      if (day == day1 && month == month1) {
        console.log(date, day, month)
        console.log(date1, day1, month1)
        console.log(`It's ${data[i].EmpName},${data[i]._id}'s birthday today!`);
        await sendBirthdayEmail(data[i].Email, data[i].EmpName);
      } else {
        console.log(`Today is not ${data[i].EmpName}'s birthday.`);
      }
    }
  }
  catch(err) {
    console.log("hii")
  }
});

const getDataFromDB = async () => {
  console.log("Fetching data from DB at midnight");
  const data = await Emp.find();
  for (let i = 0; i < data.length; i++) {
    const date1 = data[i].DOB;
    const month1 = date1.getMonth() + 1;
    const day1 = date1.getDate();
    if (day == day1 && month == month1) {
      console.log(date,day,month)
      console.log(date1,day1,month1)
      console.log(`It's ${data[i].EmpName},${data[i]._id}'s birthday today!`);
      await sendBirthdayEmail(data[i].Email, data[i].EmpName);
    } else {
      console.log(`Today is not ${data[i].EmpName}'s birthday.`);
    }
  }
};

cron.schedule('07 11 * * *', () => {
  getDataFromDB();
  console.log("Scheduled task ran at midnight");
});

app.listen(8080, () => {
  console.log("Server is running");
});
