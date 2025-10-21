const session = require("express-session")
const userModel = require("../models/user-model")

module.exports = async function protect(req, res, next){
try {
  const  {email, password} = req.body
  findUser = await userModel.findOne({email:email, password:password})
  if(!findUser){
    req.session.authMsg = "Register first or Enter correct Email and password";
    setTimeout(()=>{
      req.session.destroy();
     },2000)

  return res.redirect("/")
  }
  req.userData = findUser
  
  next()
} catch (error) {
    res.send(error.messsage)
  } 
}
  