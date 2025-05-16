const User=require("../Models/userModel.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { generateOTP, sendOTP } = require("../utils/otp");
const otpStore = {}; 

module.exports.signupform=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered.");
      return res.redirect("/signup");
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      req.flash("error", "Username already taken.");
      res.redirect("/signup");
      return;
    }

    const otp = generateOTP();
    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      userData: { username, email, password }
    };

    await sendOTP(email, otp);
    req.flash("success", "OTP sent to your email");
    res.render("users/otp", { email, error: null });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record || Date.now() > record.expires) {
    req.flash("error", "OTP expired. Please sign up again.");
    return res.redirect("/signup");
  }

  if (record.otp !== otp) {
    return res.render("users/otp", { email, error: "Invalid OTP" });
  }
  // Register user
  const { username, password } = record.userData;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  delete otpStore[email];

  req.logIn(registeredUser, err => {
    if (err) return next(err);
    req.flash("success", "Welcome! Your account is now verified.");
    res.redirect("/listings");
  });
};


module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs");
}


module.exports.login=async(req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl||"/listings");  // or any page you want to show after login
}


module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}

module.exports.forgotform=(req,res)=>{
    res.render("users/forgot.ejs");
}
module.exports.forgot=async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/forgot');
    }
  
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
  
    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    const resetURL = `http://${req.headers.host}/reset/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>`,
    });
  
    req.flash('success', 'Reset password link is sent');
    res.redirect('/forgot');

    
  };
module.exports.resetform = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
  
    if (!user) {
      req.flash('error', 'Invalid or expired token');
      return res.redirect('/forgot');
    }
  
    res.render('users/reset', { token }); // Your view file to show reset form
  };
module.exports.reset= async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;        
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
    });
        
    if (!user){
        req.flash('error', 'Invalid or expired token');
        return res.redirect('/forgot');
    } 
    await user.setPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    req.flash('success', 'Password updated successfully');
    res.redirect('/login');
    
};
module.exports.otpform = (req, res) => {
  const email = req.user?.email || req.session.email; // adjust as needed
  res.render("users/otp", { email });
};