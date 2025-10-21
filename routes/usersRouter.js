const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const userModel = require("../models/user-model")
const protect = require("../middlewares/find-user")
const jwt = require("jsonwebtoken")

router.get("/", (req, res)=>{
  try {
    const message = req.session.message;
    const authMsg = req.session.authMsg
    
    res.render("register.ejs", {message, authMsg})
    
  } catch (error) {
    //console.log(error.message)
  }
})

router.post("/register", async (req, res)=>{
  try {
    const {username, email, password} = (req.body)

    const createUser = new userModel({
      username,
      email,
      password,
    })
    
await createUser.save()
    res.redirect("/")
  } catch (error) {
    res.send(error.message)
  }
})


router.post("/login", protect,(req, res)=>{
  try{

    const {email} = req.userData;

    // res.cookie("token", "hello")
    let token = jwt.sign(email, process.env.JWT_KEY);
    // //console.log(token)

    res.cookie("token", token)
    
  

    res.redirect("/shop")

  }
  catch(error){
    res.send(error.message)
  }
})

module.exports = router;