const express = require("express")
const router = express.Router()

const ownerModel = require("../models/owners-model")
const productModel = require("../models/product-model")


router.get("/stark", async(req, res)=>{
  res.render("ownerAuth.ejs")
})


module.exports = router;