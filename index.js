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

  } catch (err) {
    console.error('Error during birthday check', err);
  }
};
app.use( function(req, res, next) {

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

 next();
  
});
// Schedule the cron job to run at the specified time (e.g., 10:15 AM every day)
cron.schedule('31 16 * * *', () => {
  app.get('/favicon.ico', (req, res) => res.status(204));
  getDataFromDB();
  console.log('Scheduled task ran at the specified time');
});

app.listen(8080, () => {
  console.log("Server is running");
});
