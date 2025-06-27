const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const subscriberRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes")
const cors = require("cors");
const helmet = require("helmet"); // Add helmet for security headers
const { getSubscribers } = require("./controllers/subscriberController");
const { submitContactForm } = require("./controllers/newsletterController");
const cron = require('node-cron');
const axios = require('axios');


dotenv.config();
connectDB();

const app = express();


app.use(helmet()); 
app.use(cors({
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200
}));

// Additional security headers
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Don't allow embedding in iframes
  res.setHeader('X-Frame-Options', 'DENY');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Content Security Policy - adjust as needed for your app
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});


// Ping your own server every 14 minutes
cron.schedule('*/14 * * * *', async () => {
  try {
    await axios.get(process.env.PING_URL, { timeout: 5000 });
    console.log("Self-ping sent to keep server awake");
  } catch (error) {
    console.error("Ping failed:", error.message);
  }
})

app.use(express.json());
app.use("/api/products", productRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/getsubscribers', getSubscribers);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/contact", submitContactForm);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));