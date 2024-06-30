const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError= require("./utils/expresserror.js"); 
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you must be logged in to create a listings");
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl= (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;

    }
    next();
};
module.exports.isOwner= async(req,res,next)=>{
    let {id} = req.params;
    let listing= await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.curruser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);

    }
    next();
};

//error handling
module.exports.validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
         if(error){
        throw new ExpressError(400,error);
        }else{
            next();
        }
};

//error handling review function  
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
         if(error){
        throw new ExpressError(400,error);
        }else{
            next();
        }
};
//for reviews
module.exports.isAuthor= async(req,res,next)=>{
    let {id , reviewId} = req.params;
    let review= await Review.findById(reviewId);
    if( !review.author.equals(res.locals.curruser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);

    }
    next();
};