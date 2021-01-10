var express = require("express");
var router = express.Router({mergeParams: true});
var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
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

/////Edit Comment Routes//////
router.get("/:commentId/edit", checkCommentOwnership, function(req, res){
	var myId = new mongoose.Types.ObjectId(req.params.commentId);
	Comment.findById(myId, function(err, foundComment){
		if(err){
			res.send(myId);
			console.log(err);
		}else{
			res.render("comments/edit", {campgroundId: req.params.id, 
	 									  comment: foundComment});
		}
	});
});

////Update Comment Routes/////////
router.put("/:commentId", checkCommentOwnership, function(req, res){
	var myId = new mongoose.Types.ObjectId(req.params.commentId);
	var campId = new mongoose.Types.ObjectId(req.params.id);
	
	Comment.findByIdAndUpdate(myId, req.body.comment,
							  function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+campId);
		}
	});
});

////Destroy Routes/////

router.delete("/:commentId", checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

///Middleware///////////////////
function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){ //If the user is logged in i.e. is authenticated
			Comment.findById(req.params.commentId, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				//does user own the campground
				if(foundComment.author.id.equals(req.user._id)){
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