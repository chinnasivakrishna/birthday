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
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    for (let i = 0; i < data.length; i++) {
      const date1 = data[i].DOB;
      const month1 = date1.getMonth() + 1;
      const day1 = date1.getDate();

      if (day == day1 && month == month1) {
        console.log(`It's ${data[i].EmpName}, ${data[i]._id}'s birthday today!`);
        // Send email asynchronously
        await sendBirthdayEmail(data[i].Email, data[i].EmpName).then(() => {
          console.log(`Birthday email sent to ${data[i].EmpName}`);
        }).catch((error) => {
          console.error(`Failed to send birthday email to ${data[i].EmpName}`, error);
        });
      } else {
        console.log(`Today is not ${data[i].EmpName}'s birthday.`);
      }
    }
    res.send('Birthday check complete');
  } catch (err) {
    console.error('Error during birthday check', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/favicon.ico', (req, res) => res.status(204));


const getDataFromDB = async () => {
  console.log('Fetching data from DB at scheduled time');
  try {
    const data = await Emp.find();
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const birthdayPromises = data.map(async (employee) => {
      const dob = employee.DOB;
      const month1 = dob.getMonth() + 1;
      const day1 = dob.getDate();

      if (day === day1 && month === month1) {
        console.log(`It's ${employee.EmpName}, ${employee._id}'s birthday today!`);
        try {
          await sendBirthdayEmail(employee.Email, employee.EmpName);
          console.log(`Birthday email sent to ${employee.EmpName}`);
        } catch (error) {
          console.error(`Failed to send birthday email to ${employee.EmpName}`, error);
        }
      } else {
        console.log(`Today is not ${employee.EmpName}'s birthday.`);
      }
    });

    await Promise.all(birthdayPromises);
  } catch (err) {
    console.error('Error during birthday check', err);
  }
};

cron.schedule('24 15 * * *', () => {
  getDataFromDB();
  console.log("Scheduled task ran at midnight");
});

app.listen(8080, () => {
  console.log("Server is running");
});
