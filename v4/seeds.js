var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

var seeds = [{
	name: "Salmon Creek",
	image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
},{
	name: "Anchovie Camp",
	image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
},{
	name: "Tuna Mountain",
	image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
}];

function seedDB(){
	//remove all campgrounds
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Campgrounds removed");
		Comment.deleteMany({}, function(err){
			if(err){
				console.log(err);
			}
			console.log("Comments Removed");
			//add a few campgrounds
			seeds.forEach(function(seed){
				Campground.create(seed, function(err, newCampground){
					if(err){
						console.log(err);
					}else{
						console.log("new campground added");
						//create a comment
						Comment.create({
							text: "Great Place, just lacks Bleach Shop",
							author: "NotTheZodiac"
						}, function(err, newComment){
							if(err){
								console.log(err);
							}else{
								newCampground.comments.push(newComment);
								newCampground.save();
								console.log("Created new Comment");
							}
						});
					}
				});
			});
		});
	});
}

module.exports = seedDB;