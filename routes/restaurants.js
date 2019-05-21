var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");

// Index Route
router.get("/", function(req, res){
    Restaurant.find({}, function(err, allRestaurants){
        if(err){
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants:allRestaurants});
        }
    });
});

// Create
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var location = req.body.location;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRestaurant = {name: name, location: location, price: price, image: image, description: desc, author: author}
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/restaurants");
        }
    });
});

// New Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("restaurants/new");
});

// Show Route
router.get("/:id", function(req, res) {
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
       if(err || !foundRestaurant){
           req.flash("error", "Restaurant not found");
           res.redirect("back");
       } else {
            console.log(foundRestaurant);
            res.render("restaurants/show", {restaurant: foundRestaurant});
       }
    });
});

// Edit Restaurant
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
});

router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants/" + req.params.id)
        }
    });
});

// Remove Campgroud
router.delete("/:id", middleware.checkRestaurantOwnership, function(req, res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants");
        }
    });
});

module.exports = router;