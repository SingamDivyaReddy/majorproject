const User=require("../Models/userModel.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.signupform=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email,username})
        let registeredUser= await User.register(newUser,password);
        req.logIn(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WonderLust!!");
            res.redirect("/listings");
        })      
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

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