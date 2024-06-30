const express =require("express");
const router= express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");
const ExpressError= require("../utils/expresserror.js"); 
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isAuthor}= require("../middelware.js");
const reviewcontroller = require("../controllers/reviews.js");

//reviews
router.post("/",isLoggedIn,validateReview ,wrapasync(reviewcontroller.createReview));
 
 //delete route
 
 router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
     wrapasync(reviewcontroller.deleteReview));

 module.exports=router;