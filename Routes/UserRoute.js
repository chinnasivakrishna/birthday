const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const {User} = require("../Model/User")
const app = express();
app.use(bodyParser.json())
const user = express.Router();

user.route("/add").post(async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save();
    res.json("Success")
    
  } catch (error) {
    res.json({ message: error })
  }
});

user.route("/login").post(async (req, res) => {
  try {
    const { Email, Password } = req.body
    console.log(req.body)
    const user =await User.findOne({ Email, Password })
    console.log(user)
    if (user) {
      res.send({user})
    }
    else {
      res.send({message:"Failed"})
    }
    
    
  } catch (error) {
    res.json({ message: error })
  }
});

module.exports = user;