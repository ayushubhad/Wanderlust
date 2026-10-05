const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category } = req.query; // Grab the category from the URL string
    
    let allListings;
    if (category) {
       
        allListings = await Listing.find({ category: category });
    } else {
        
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm =  (req,res)=>{
 res.render("listings/new.ejs");
}


module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews", populate:{
        path :"author"
    }}).populate("owner");
if(!listing){
    req.flash("error", "Listing Does Not Exists!");
     return res.redirect("/listings");
}
    res.render("listings/show.ejs", {listing,  mapToken: process.env.MAP_TOKEN}, 
       
    );

}

module.exports.createListing = async (req, res, next) => {  
    // 1. Get geocoding data
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    
    // Create the listing instance using the text body data
    const newListing = new Listing(req.body.listing);  
    
   
   
  
    if (typeof req.file !== "undefined") {
        let url = req.file.path;        // This is the direct Cloudinary URL
        let filename = req.file.filename; // This is the Cloudinary public ID
        newListing.image = { url: url, filename: filename };
    } 
    
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.updateLisitng = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;

    // 1. Update the basic text fields
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // 2. Fetch new coordinates based on the location
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    
    // 3. Apply the new coordinates if Mapbox found the location
    if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
    }

    // 4. Update the image if a new file was uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    // 5. CRITICAL: Save the changes to the database (moved outside the if-statement!)
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.editListing = async (req,res)=>{
     let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error", "Listing Does Not Exists!");
    return res.redirect("/listings");
}
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl})
}

module.exports.deletelisting = async (req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
}

//search suggestiions
module.exports.suggestListings = async (req, res) => {
    let { q } = req.query;
    if (!q || q.trim() === "") {
        return res.json([]);
    }

    let regex = new RegExp(q.trim(), "i");
    let allSuggestions = await Listing.find({
        $or: [
            { title: regex },
            { location: regex },
            { country: regex },
            { category: regex }
        ]
    })
    .select("_id title location country price image.url")
    .limit(6);

    res.json(allSuggestions);
};