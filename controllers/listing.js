const { response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let Token =  process.env.MAP_TOKEN ;
const GeocodingClient = mbxGeocoding({ accessToken: Token });


module.exports.index = async (req,res)=>{
    const all = await Listing.find({});
    res.render("./listings/index.ejs",{all});
};

module.exports.rendernewform = async (req,res)=>{
    
    res.render("listings/new.ejs")
};
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews",
          populate:{
         path:"author",
    }})
    .populate("owner");
 
     if(!listing){
         req.flash("error","Listing you requested for does not exist!"); 
         res.redirect("/listings");
     }
    res.render("./listings/show.ejs",{listing});
 };

 module.exports.createListing= async(req,res,next)=>{
   //find a location for map
    let response = await GeocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

   
    let url = req.file.path;
    let filename= req.file.filename;
    const newlisting = new Listing(req.body.listing);
      newlisting.owner = req.user._id;
      newlisting.image = {url , filename};
      newlisting.geometry= response.body.features[0].geometry;
     let savedlist= await newlisting.save();
     console.log(savedlist);
     req.flash("success","New Listing Created!");
     res.redirect("/listings");

};

module.exports.editListing= async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!"); 
        res.redirect("/listings");
    }
    let orgimage = listing.image.url;
    orgimage = orgimage.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, orgimage});
};
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(req.file){
   let url = req.file.path;
   let filename= req.file.filename;
   listing.image = {url , filename};
   await listing.save();
    }

   req.flash("success","Listing Updated!");
   res.redirect(`/listings/${id}`);
};

module.exports.deleteListing= async(req,res)=>{
    let {id} = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.filter = async(req,res)=>{
    let {id} = req.params;
    let all = await Listing.find({category:id});
    if(all != 0 ){
        res.render("listings/index.ejs",{all});
    }
    else{
        req.flash("error","Listings is not here");
        res.redirect("/listings");
    };
};

module.exports.search = async(req,res)=>{
    let {title} = req.query;
    const all = await Listing.find({title});
    res.render("listings/index.ejs",{all});
};