const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkToken = require('../middleware/checkToken');
const { storage } = require("../config/cloudinary"); 
const upload = multer({ storage });
const { addSubscriber, getSubscribers } = require('../controllers/subscriberController');
const { sendNewsletter, submitContactForm } = require('../controllers/newsletterController');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// Product Routes
router.post("/", upload.array("productImages", ), createProduct); 
router.get("/", checkToken,  getProducts);
router.get("/:id", getProduct);
router.put("/:id", upload.array("productImages",), updateProduct); 
router.delete("/:id", checkToken, deleteProduct);

// Subscriber Routes
router.get('/', getSubscribers);
router.post('/subscribe', addSubscriber);
// Newsletter Routes
router.post('/send', sendNewsletter);
// Contact Form Route 
router.post('/contact', submitContactForm); 

module.exports = router;  
