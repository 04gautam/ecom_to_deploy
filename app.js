const express = require("express")
const app = express()
require("dotenv").config()

const db = require("./config/mongoose-connection")
const cookieParser = require("cookie-parser")
const path = require("path")
const ownersRouter = require("./routes/ownersRouter")
const productsRouter = require("./routes/productsRouter")
const usersRouter = require("./routes/usersRouter")
const indexRouter = require("./routes/index")
const session = require("express-session")
const multer = require("multer")
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
  // Set up session middleware
  app.use(session({
    secret: 'secret_key', // replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
}));

app.use("/owner", ownersRouter)
app.use("/admin", productsRouter)
app.use("/", usersRouter)
app.use("/", indexRouter)



// app.listen(PORT, ()=>console.log(`Server runninning on port ${PORT}`))

module.exports = app;