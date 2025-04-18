const express=require("express");
const router=express.Router({mergeParams:true});
let wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review=require("../Models/review.js");
let Listings=require("../Models/listing");
const reviewcontroller=require("../controllers/review.js");

//reviews
//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewcontroller.postReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewcontroller.destroyReview))

module.exports=router;