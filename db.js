const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.MONGO_URL;

mongoose.connect(DB_URL, {
})
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database not connected"));


  module.exports = mongoose