var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

//////////////////Comments Routes////////////////////////

//comments new
router.get("/new", isLoggedIn, function(req, res){
	//find campground by findById
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
	
});

//comments create
router.post("/", isLoggedIn, function(req, res){
	//look campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			//create new comment
			Comment.create(req.body.comment, function(err, newComment){
				if(err){
					res.redirect("/campgrounds");
				}else{
					//Add username and id to comment
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					//save the comment
					newComment.save();
					//connect comment to campground
					campground.comments.push(newComment);
					campground.save();
		  			//redirect to campground page
					res.redirect("/campgrounds/"+campground._id);
				}
			});
	       
		}
	});
	
});

///Middleware///////////////////
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;