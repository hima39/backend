const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const { productName, description, price, costPrice, quantity, ingredients, skinType, shelfLife, madeIn } = req.body;

    const product = new Product({
      productName,
      description,
      costPrice: parseFloat(costPrice), // Ensure proper conversion
      price: parseFloat(price),
      quantity: parseInt(quantity),
      ingredients,
      skinType,
      shelfLife,
      madeIn,
      productImages: req.files?.map(file => file.path) || []
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({
      error: err.message,
      receivedData: req.body // Echo back received data
    });
  }
};

// READ ALL
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const versionIndex = parts.findIndex(part => /^v\d+$/.test(part));
    if (versionIndex === -1 || versionIndex + 1 >= parts.length) {
      throw new Error('Invalid Cloudinary URL format');
    }
    const publicIdWithExtension = parts.slice(versionIndex + 1).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (error) {

    return null;
  }
};
// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const { productName, description, costPrice, price, quantity, ingredients, skinType, shelfLife, madeIn } = req.body;// Added costPrice
    const removedImages = JSON.parse(req.body.removedImages || '[]');

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove specified images
    if (removedImages.length > 0) {
      for (const imageUrl of removedImages) {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          product.productImages = product.productImages.filter((img) => img !== imageUrl);
        }
      }
    }

    // Add new images if any
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => file.path);
      product.productImages = product.productImages.concat(newImagePaths);
    }

    // Update all fields
    product.productName = productName;
    product.description = description;
    product.costPrice = costPrice; // Added costPrice update
    product.price = price;
    product.quantity = quantity;
    product.ingredients = ingredients;
    product.skinType = skinType;
    product.shelfLife = shelfLife;
    product.madeIn = madeIn;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (remains the same)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images from Cloudinary
    for (const imageUrl of product.productImages) {
      const publicId = extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};