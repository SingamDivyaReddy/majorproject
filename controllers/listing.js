const Listings=require("../Models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: maptoken });

module.exports.index=async(req,res)=>{
    let alllistings=await(Listings.find({}));
    res.render("listings/index.ejs",{alllistings});
    
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

    res.render("listings/show.ejs",{listing});
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
        await listing.save();
    }
    ;
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