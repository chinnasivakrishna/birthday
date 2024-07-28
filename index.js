require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const { sendBirthdayEmail } = require("./mailer");
const app = express();

app.use(cors({
  origin: ["https://birthday-mail-1y1h3cslk-sivas-projects-70b20ed5.vercel.app/"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(bodyParser.json());

const employee = require("./Routes/EmployeeDOB");
const { Emp } = require("./Model/Employee");

const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
console.log(date);
const DB_URL = process.env.MONGO_URL;

mongoose.connect(DB_URL, {
  serverSelectionTimeoutMS: 3000,
})
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database not connected"));

app.use("/api/employees", employee);

const getDataFromDB = async () => {
  console.log("Fetching data from DB at midnight");
  const data = await Emp.find();
  for (let i = 0; i < data.length; i++) {
    const date1 = data[i].DOB;
    const month1 = date1.getMonth() + 1;
    const day1 = date1.getDate();
    if (day == day1 && month == month1) {
      console.log(`It's ${data[i].EmpName}'s birthday today!`);
      await sendBirthdayEmail(data[i].Email, data[i].EmpName);
    } else {
      console.log(`Today is not ${data[i].EmpName}'s birthday.`);
    }
  }
};

cron.schedule('0 0 * * *', () => {
  getDataFromDB();
  console.log("Scheduled task ran at midnight");
});

app.listen(8080, () => {
  console.log("Server is running");
});
