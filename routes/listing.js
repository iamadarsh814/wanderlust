const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js");



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  
  




// CREATE route
router.post("/", wrapAsync(async(req,res) => {
    let newListing = await new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing created!")
    res.redirect("/listings")
  }));
  
  
  
  // INDEX route
  router.get("/",async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  });
  
  
  // NEW route
  router.get("/new",(req,res) => {
  res.render("listings/new.ejs")
  })
  
  
  // SHOW route
  router.get("/:id",async(req,res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate("reviews");
  if(!listing) {
    req.flash("error", "Listing you requested for does not exit!")
    res.redirect("/listings")
  }
  res.render("listings/show.ejs",{listing})
  });
  
  // EDIT route
  router.get("/:id/edit", async(req,res) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested for does not exit!")
    res.redirect("/listings")
  }
  res.render("listings/edit.ejs", {listing});
  })
  
  
  //Update Route
  router.put("/:id",validateListing, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated!")
    res.redirect(`/listings/${id}`);
  });
  
  
  //Delete Route
  router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!")
    res.redirect("/listings");
  });
  
  
module.exports = router;  