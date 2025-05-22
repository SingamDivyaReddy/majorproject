const Listings=require("./Models/listing");
const Review=require("./Models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");



module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        if (req.originalUrl === "/listings/new") {
            req.flash("error","You must be logged in to create a new listing.");
        } else {
            req.flash("error","You must be logged in to perform this action.");
        }
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl=((req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
});

module.exports.isOwned=(async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listings.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(((el) => el.message)).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(((el) => el.message)).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor=(async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!(review.author.equals(res.locals.curruser._id))){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
});