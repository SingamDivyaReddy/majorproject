// utils/otpUtils.js
const nodemailer = require("nodemailer");

exports.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`
  });
};
