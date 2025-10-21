const express = require("express")
const { route } = require("./ownersRouter")
const cookieProtect = require("../middlewares/cookie-protect")
const findUser = require("../middlewares/find-user")
const userModel = require("../models/user-model")
const router = express.Router()
const productModel = require("../models/product-model")
const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")


router.get("/shop", cookieProtect, async (req, res)=>{
  try {

    const allProduct = await productModel.find()
    
    const cartMsg = req.session.message;
    delete req.session.message;


  const {token} = req.cookies;

  let decodedEmail = jwt.verify(token, process.env.JWT_KEY);
 

  let cartUser = await userModel.findOne({email:decodedEmail})
  .populate("cart")


    res.render("shop.ejs", {allProduct: allProduct, cartMsg, cartLen:cartUser.cart.length})
    
  } catch (error) {
    console.log(error.message)
  }
})



router.get("/cart/:productId",cookieProtect, async (req, res)=>{
  try{


    const {token} = req.cookies

    let decodedEmail = jwt.verify(token, process.env.JWT_KEY);
   
  let cartUser = await userModel.findOne({email:decodedEmail})

    cartUser.cart.push(req.params.productId)
    // console.log(req.params.productId)
   await cartUser.save()
  
    req.session.message = '1 item added in cart';
    res.redirect("/shop")

  }catch(error){
    res.send(error.message)
  }
})

router.get('/cart',cookieProtect, async (req, res)=>{
try {

  const {token} = req.cookies;

  let decodedEmail = jwt.verify(token, process.env.JWT_KEY);
 

  let cartUser = await userModel.findOne({email:decodedEmail})
  .populate("cart")
  
// console.log(cartUser)
// res.send("done")

  res.render("cart.ejs", {cartUser: cartUser.cart,cartLen:cartUser.cart.length})

} catch (error) {
  res.send(error)
}

}) 


//this is logout rout

router.get("/logout",cookieProtect, async (req, res)=>{

  try {
    res.clearCookie("token")
    req.session.message = 'You are logged out!';
   
    setTimeout(()=>{
     req.session.destroy();
   
    },3000)
   
     res.redirect("/")
  } catch (error) {
    res.send(error.message)
  }
 
})

router.get("/buy/:itemId", cookieProtect,(req, res)=>{
  try {
      // console.log(req.params.itemId)
      res.render("buy.ejs")
  } catch (error) {
    res.send(error.message)
  }

})

router.get("/delete/:deleteId", cookieProtect, async(req, res)=>{
  try {
    const {token} = req.cookies;
    const {deleteId} = req.params;

    // decoding the email
    let decodedEmail = jwt.verify(token, process.env.JWT_KEY);
    // console.log(decodedEmail)

    const deleteResult = await userModel.updateOne(
      {email: decodedEmail},
      { $pull: {cart: deleteId}}
    );
 
    
    // console.log("Delete Id", req.params.deleteId);
    // console.log("Delete Result", deleteResult)

      res.redirect("/cart")
  } catch (error) {
    res.send(error)
  }

})

router.get("/filter",cookieProtect,async (req, res)=>{

  let findItems = req.query.filterItem;
  
// let findItems = await productModel.find({name:"White bag"});
// let findItems = "Whitebag";


// Split query into words
const keywords = findItems.trim().split(/\s+/);

  // Create regex filters for each word (case-insensitive)
  const regexFilters = keywords.map((word) => ({
    name: { $regex: word, $options: 'i' }
  }));

try{


  // Use $or to match any of the words
      const products = await productModel.find({ $or: regexFilters });
  
  // console.log(products)


  //for cart item count
  const {token} = req.cookies;

  let decodedEmail = jwt.verify(token, process.env.JWT_KEY);
 

  let cartUser = await userModel.findOne({email:decodedEmail})
  .populate("cart")
  res.render('filter-items.ejs', {products, cartLen:cartUser.cart.length})
}
catch(err){
  res.status(500).json({error:"Search faild"})
}

})

router.get("/send/mail", cookieProtect,(req, res)=>{

  const {shipName, shipEmail, shipPhone, item, price, shipInfo, productId} = req.query
 
  // console.log(shipName, shipEmail, shipPhone, item, price, shipInfo)

    const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use 'hotmail', 'yahoo', or custom SMTP too
  auth: {
    user: "sunm13398@gmail.com", // Your Gmail address
    pass: "buptobsfyqyjfvil",     // Use app password, not your Gmail password
  },
});

// Email options
const mailOptions = {
  from: "sunm13398@gmail.com",
  to: shipEmail,
  subject: "STARK Technologies",
  text: "Hello customer",
 
  html: ` <div style="border: 2px solid #4a4a4a; border-radius: 8px; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; margin: 0;">STARK ORDER CONFIRMATION</h2>
        <div style="height: 3px; background: linear-gradient(to right, #3498db, #2ecc71); margin: 10px 0;"></div>
    </div>
    
    <div style="background-color: white; border-radius: 6px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; color: #7f8c8d;">Customer:</span>
            <span style="color: #2c3e50;">  ${shipName}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; color: #7f8c8d;">Email:</span>
            <span style="color: #2c3e50;">  ${shipEmail}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; color: #7f8c8d;">Phone:</span>
            <span style="color: #2c3e50;">  ${shipPhone}</span>
        </div>
        
        <div style="height: 1px; background-color: #ecf0f1; margin: 15px 0;"></div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; color: #7f8c8d;">Item:</span>
            <span style="color: #2c3e50; font-weight: bold;"> ${item}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; color: #7f8c8d;">Price:</span>
            <span style="color: #27ae60; font-weight: bold;"> ${price}</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; color: #7f8c8d;">ProductID:</span>
            <span style="color: #27ae60; font-weight: bold;"> ${productId}</span>
        </div>
    </div>
    
    <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 12px; margin-top: 20px; border-radius: 0 4px 4px 0;">
        <h4 style="color: #ff9800; margin: 0 0 5px 0;">Special Request:</h4>
        <p style="color: #5d4037; margin: 0; font-style: italic;">  "${shipInfo}"</p>
    </div>
    
    <div style="text-align: center; margin-top: 25px; color: #7f8c8d; font-size: 12px;">
        <p>Thank you for your order! We'll process it shortly.</p>
        <p>Need help? Contact us at support@stark.com</p>
    </div>
</div>
  `,
  

};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error:", error);
  }
  console.log("Email sent:", info.response);
});

res.redirect("/purchased")

})

router.get("/purchased", async(req, res)=>{

  
// const user = jwt.verify(req.cookies.token, process.env.JWT_KEY)
//   let userOrders = await productModel.findOne({email:user})
//   console.log(userOrders)


  res.render("purchaseMsg.ejs")
})

router.get("/email/:em", cookieProtect, async(req, res)=>{
  let shipItem = await productModel.findOne({_id:req.params.em})
  // console.log(shipItem)

  res.render("email-both-end.ejs", {shipItem})
})


router.get("/user/account",cookieProtect, async(req, res)=>{
     
    const userAccountInfo = jwt.verify(req.cookies.token, process.env.JWT_KEY)
      // console.log(decoded)
  res.render("userAccount.ejs", {userAccountInfo})
})


module.exports = router;
