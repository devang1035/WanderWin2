const express =require("express");
const router= express.Router();
const Wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validatelisting}= require("../middelware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage}= require("../cloudconfig.js");
const upload = multer({ storage });

 router.get("/filter/:id",Wrapasync(listingcontroller.filter));
 router.get("/search",Wrapasync(listingcontroller.search));
 
router
.route("/")
.get(Wrapasync(listingcontroller.index)) //index Route
.post(                                   //create Route
    isLoggedIn,
    upload.single("listing[image]"),
    validatelisting,
     Wrapasync(listingcontroller.createListing)
  );

 //new route
router.get("/new",isLoggedIn,Wrapasync(listingcontroller.rendernewform));

router.route("/:id")
.get(isLoggedIn,Wrapasync(listingcontroller.showListing)) //show route 
.put(isLoggedIn,                                           //update route
    isOwner,
    upload.single("listing[image]"),                                                //delete route
    validatelisting,
    Wrapasync(listingcontroller.updateListing))
.delete(isLoggedIn, isOwner,Wrapasync(listingcontroller.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn, isOwner,Wrapasync(listingcontroller.editListing));

module.exports= router;