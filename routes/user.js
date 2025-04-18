const express=require("express");
const router=express.Router();
const User=require("../Models/userModel.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js")


router
    .route("/signup")
    .get(usercontroller.signupform)
    .post(wrapAsync(usercontroller.signup))

router
    .route("/login")
    .get(usercontroller.loginform)
    .post(saveRedirectUrl, 
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),usercontroller.login);

router.get("/logout",usercontroller.logout)

module.exports=router;