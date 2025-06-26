const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  costPrice: { type: Number, required: true }, 
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productImages: [{ type: String }],
  ingredients: { type: String, },
  skinType: { type: String, enum: ['All', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
  shelfLife: { type: String,},
  madeIn: { type: String, }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);