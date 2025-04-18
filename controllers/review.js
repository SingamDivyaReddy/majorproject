const Listings=require("../Models/listing");
const Review=require("../Models/review.js");

module.exports.postReview=async(req,res)=>{
    let listing=await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review saved");
    req.flash("success","New review is created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");

    res.redirect(`/listings/${id}`);
}