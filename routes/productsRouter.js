const express = require("express")
const router = express.Router()
const productModel = require("../models/product-model")
const cookieProtect = require("../middlewares/cookie-protect")
const upload = require("../config/multer-config")
const ownerModel = require("../models/owners-model")

router.post("/proinfo", upload.single("image"), async (req, res)=>{
  try {
   const {name, price, discount, bgcolor ,panelcolor,textcolor, discription} = (req.body)

   const makeProduct = new productModel({
      image: req.file.buffer,
      name,
      price, 
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      discription

   })
   await makeProduct.save()

   res.redirect("/shop")

  // to Check only

  // //console.log(req.file)
  // res.send("done")
    
  } catch (error) {
    res.send(error.message)
  }
})



router.post("/stark", async(req, res)=>{
  try {

    let findOwner = await ownerModel.findOne({
        fullname:req.body.fullName,
        email:req.body.email,
        password: req.body.password
    })
  

    if(!findOwner){
      //console.log("null is false")
      return res.render("admin-wrong-auth.ejs")
    }


    res.render("admin-panel.ejs")
    
  } catch (error) {
    //console.log(error.message)
  }
})


router.get("/delete", (req, res)=>{
  res.render("deleteItems.ejs")
})

router.post("/delete-product", async(req, res)=>{
try {
  let deleteProduct = req.body.productName

 let deletedItem = await productModel.findOneAndDelete({name:deleteProduct})

 if(!deletedItem){
  return res.send("There is no such product ")

 }
  
//  //console.log(deletedItem)
  res.send("Deleted")

} catch (error) {
  //console.log(error.message)
}

})


module.exports = router;