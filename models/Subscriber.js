const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
},
{
    timestamps: true // This automatically adds createdAt and updatedAt fields
  }
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
module.exports = Subscriber;
