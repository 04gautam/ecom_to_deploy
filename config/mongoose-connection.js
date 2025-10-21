const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("Database connected to the server")
 
})
.catch((err)=>console.log(err.message))

module.exports = mongoose.connection;