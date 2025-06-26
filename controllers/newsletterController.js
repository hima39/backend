const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

const sendNewsletter = async (req, res) => {
    const { subject, message } = req.body;
    try {
        const subscribers = await Subscriber.find();
        const emails = subscribers.map(sub => sub.email);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Newsletter sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending newsletter', error });
    }
};

const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;
    
    try {
        // Create transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin
            subject: 'New Contact Form Submission',
            text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            success: true,
            message: 'Thank you for your message. We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error submitting contact form', 
            error: error.message 
        });
    }
};

module.exports = { sendNewsletter,submitContactForm };
