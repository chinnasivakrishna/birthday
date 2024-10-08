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
const user = require("./Routes/UserRoute");
const { Emp } = require("./Model/Employee");

const date = new Date();
date.setDate(date.getDate())
const month = date.getMonth() + 1;
const day = date.getDate();
console.log(date);

app.use("/api/employees", employee);
app.use("/api/user", user);

app.get("/send", async (req, res) => {
  try {
    await getDataFromDB();
    res.send('Birthday check complete');
  } catch (err) {
    console.error('Error during birthday check', err);
    res.status(500).send('Internal Server Error');
  }
});

const getDataFromDB = async () => {
  console.log('Fetching data from DB at scheduled time');
  try {
    const data = await Emp.find();

    for (let i = 0; i < data.length; i++) {
      const date1 = data[i].DOB;
      const month1 = date1.getMonth() + 1;
      const day1 = date1.getDate();
      console.log(date1)
      if (day == day1 && month == month1) {
        console.log(`It's ${data[i].EmpName}, ${data[i]._id},${data[i].DOB}'s birthday today!`);
        // Send email asynchronously
        await sendBirthdayEmail(data[i].Email, data[i].EmpName, data[i].Name).then(() => {
          console.log(`Birthday email sent to ${data[i].EmpName}`);
        }).catch((error) => {
          console.error(`Failed to send birthday email to ${data[i].EmpName}`, error);
        });
      } else {
        console.log(`Today is not ${data[i].EmpName}'s birthday.`);
      }
    }

  } catch (err) {
    console.error('Error during birthday check', err);
  }
};
// Schedule the cron job to run at the specified time (e.g., 10:15 AM every day)
cron.schedule('29 07 * * *', () => {
  const date2 = new Date();
  hour = date2.getHours();
  minute = date2.getMinutes();
  console.log(hour)
  
    console.log("hii")
  getDataFromDB();
  console.log('Scheduled task ran at the specified time');
  
  
});

app.listen(8080, () => {
  console.log("Server is running");
});
