var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//index route
router.get("/", function(req,res){
	//get all campgrounds from db
     Campground.find({}, function(err,allCampgrounds){
		 if(err){
			 console.log(err);
		 }else{
			 res.render("campgrounds/index", {campgrounds: allCampgrounds });
		 }
	 });	
	
});

//create route
router.post("/", isLoggedIn, function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
    var description = req.body.description; 
	
	var author = {
		           id: req.user._id,
	               username: req.user.username
	             };
	
	var newCampGround =  {name: name,
	                     image: image,
						 author: author, 
						 description: description
						 };

    //create a new campground and save to db
	Campground.create(newCampGround, function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			
			res.redirect("/campgrounds");
		}
	});
    
});

//campground new route
router.get("/new", isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//SHOW: show more info about campground
router.get("/:id", function(req,res){
	//find the campground with id 
	Campground.findById(req.params.id).populate("comments").exec(
		function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//and show more information
	        res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

/////Edit Route/////////
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
	
});

////Update Route/////////

router.put("/:id", checkCampgroundOwnership, function(req, res){
	//Find and update correct Campground
	var formData = req.body.campground;
	Campground.findByIdAndUpdate(req.params.id, formData,
								 function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
			//redirect to show page
		}
	});
	
});

//////Destroy Route///////////

router.delete("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
 		}
	});
});

///Middleware///////////////////
function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){ //If the user is logged in i.e. is authenticated
			Campground.findById(req.params.id).populate("comments").exec(
			function(err, foundCampground){
			if(err){
				console.log(err);
			}else{
				//does user own the campground
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				
			}
		});
	}else{
		res.redirect("back");
	}
}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;