const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

const sendEmail = async (email) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to our Newsletter',
        text: `Thank you for subscribing to our newsletter!`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

// In your subscriberController.js
const addSubscriber = async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          message: 'Email is required',
          error: 'EMAIL_MISSING'
        });
      }
  
      // Trim and lowercase email
      const cleanEmail = email.trim().toLowerCase();
      
      // Check for existing subscriber
      const existing = await Subscriber.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({
          message: 'Email already subscribed',
          error: 'DUPLICATE_EMAIL'
        });
      }
  
      // Create new subscriber
      const subscriber = new Subscriber({ email: cleanEmail });
      await subscriber.save();
      
      res.status(201).json({ 
        message: 'Subscription successful!',
        email: cleanEmail
      });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ 
        message: 'Error subscribing',
        error: error.message 
      });
    }
  };

// In subscriberController.js
const getSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subscribers = await Subscriber.find({})
      .select('email createdAt') // Explicitly include these fields
      .sort({ createdAt: -1 })  // Newest first
      .skip(skip)
      .limit(limit);

    const total = await Subscriber.countDocuments();

    res.status(200).json({
      subscribers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching subscribers',
      error: error.message 
    });
  }
};

module.exports = { addSubscriber,getSubscribers };
