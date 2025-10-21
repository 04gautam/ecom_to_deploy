const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  image: Buffer,
  name: String,
  price: Number,
  discount: {
    type: Number,
    default: 0
  },
  discription: String
})

 module.exports = mongoose.model("product", productSchema)