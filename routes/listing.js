const express=require("express");
const Listings=require("../Models/listing");
let wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwned, validateListing}=require("../middleware.js");
const router=express.Router();
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

router
    .route("/")
    .get(wrapAsync(listingcontroller.index))//Index route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.createlistings))//Create route
    

//New route
router.get("/new",isLoggedIn,listingcontroller.newform)

router    
    .route("/:id")
    .get(wrapAsync(listingcontroller.showlistings))//Show route
    .put(isLoggedIn,isOwned,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.updatelisting))//update route
    .delete(isLoggedIn,isOwned,wrapAsync(listingcontroller.destroylisting))//delete route



//Edit route
router.get("/:id/edit",isLoggedIn,isOwned,wrapAsync(listingcontroller.editlistings))

module.exports=router;