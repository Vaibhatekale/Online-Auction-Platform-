const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // अपने Razorpay Key ID डालो
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // अपने Razorpay Secret Key डालो
});

module.exports = razorpayInstance;
