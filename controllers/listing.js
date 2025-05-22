const Listings=require("../Models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: maptoken });

module.exports.index=async(req,res)=>{
    // Get category from query parameters
    const { category, minPrice, maxPrice, searchQuery } = req.query;
    let filter = {}; // Initialize an empty filter object

    // If a category is provided, add it to the filter
    if (category) {
        filter.category = category;
    }

    // Add price filtering if minPrice and maxPrice are provided
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
            filter.price.$gte = parseInt(minPrice);
        }
        if (maxPrice) {
            filter.price.$lte = parseInt(maxPrice);
        }
    }
    
    // If a search query is provided, combine it with existing filters
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
        const searchTerm = searchQuery.trim();
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
        const regex = new RegExp(escapedSearchTerm, 'i');
        
        const searchOrClause = { $or: [{ title: regex }, { location: regex }, { country: regex }] };

        if (Object.keys(filter).length > 0) {
            // If other filters exist, combine with $and
            filter = {
                $and: [
                    {...filter}, // Spread existing filters (e.g., category, price)
                    searchOrClause
                ]
            };
        } else {
            // If no other filters, search is the main query
            filter = searchOrClause;
        }
    }

    // Fetch listings based on the filter
    let alllistings = await Listings.find(filter);

    // Render the index page, passing the listings, current category, prices, and search query
    res.render("listings/index.ejs",{
        alllistings, 
        currentCategory: category, 
        minPrice: minPrice ? parseInt(minPrice) : "", // Pass parsed int or empty string 
        maxPrice: maxPrice ? parseInt(maxPrice) : "", // Pass parsed int or empty string
        searchQuery: searchQuery || "" // Pass empty string if searchQuery is undefined
    });
}

module.exports.newform=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showlistings=async(req,res)=>{
    let {id}=req.params;
    let listing=await(Listings.findById(id)).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing doesnot exists");
        res.redirect("/listings");
    }

    // Pass showSearch: false to hide search bar on this page
    res.render("listings/show.ejs",{listing, showSearch: false});
}

module.exports.createlistings=async(req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting= new Listings(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry
    let savedlisting = await newlisting.save();
    console.log(savedlisting);
    req.flash("success","New listing is created");
    console.log(newlisting);
    res.redirect("/listings");
    
}

module.exports.editlistings=async(req,res)=>{
    let {id}=req.params;
    let listing=await(Listings.findById(id));
    if(!listing){
        req.flash("error","Listing doesnot exists");
        res.redirect("/listings");
    }
    let originalimageurl=listing.image.url;
    originalimageurl=originalimageurl.replace("/upload","/upload/h_200,w_250,c_fill");
    res.render("listings/edit.ejs",{listing,originalimageurl});
}



module.exports.updatelisting=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listings.findByIdAndUpdate(id,{...req.body.listing});

    const newLocation = req.body.listing.location;
    if (newLocation && newLocation !== listing.location) {
        const geoData = await geocodingClient.forwardGeocode({
            query: newLocation,
            limit: 1
        }).send();
        listing.geometry = geoData.body.features[0].geometry;
    }


    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
    }
    await listing.save();
    req.flash("success","listing is updated");
    res.redirect(`/listings/${id}`);
}



module.exports.destroylisting=async(req,res)=>{
    let {id}=req.params;
    let deletedid=await Listings.findByIdAndDelete(id);
    req.flash("success","listing is deleted");
    console.log(deletedid);
    res.redirect("/listings");
}

// The searchListings function is no longer needed as its functionality
// has been integrated into the index function.
/*
module.exports.searchListings = async (req, res) => {
    const { query: rawQuery } = req.query; 
    let alllistings = [];
    let searchQueryForDisplay = rawQuery; 
    let filter = {};

    if (rawQuery && typeof rawQuery === 'string') {
        const searchTerm = rawQuery.trim(); 

        if (searchTerm) {
            const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
            const regex = new RegExp(escapedSearchTerm, 'i'); 

            filter = {
                $or: [
                    { title: { $regex: regex } },      
                    { location: { $regex: regex } },   
                    { country: { $regex: regex } }    
                ]
            };
            alllistings = await Listings.find(filter);
        } else {
            searchQueryForDisplay = ""; 
            alllistings = await Listings.find({}); 
        }
    } else {
        searchQueryForDisplay = "";
        alllistings = await Listings.find({}); 
    }

    res.render("listings/index.ejs", { 
        alllistings, 
        isSearchResult: true, 
        searchQuery: searchQueryForDisplay,
        currentCategory: req.query.category, 
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice
    }); 
};
*/