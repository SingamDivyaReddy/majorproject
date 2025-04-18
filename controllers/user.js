const User=require("../Models/userModel.js");

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