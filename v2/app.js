var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);



/////////////Routes//////////////////////////////////////
app.get("/", function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds", function(req,res){
	//get all campgrounds from db
     Campground.find({}, function(err,allCampgrounds){
		 if(err){
			 console.log(err);
		 }else{
			 res.render("index", {campgrounds: allCampgrounds});
		 }
	 });	
	
});

app.post("/campgrounds", function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
    var description = req.body.description;
	
	var newCampGround =  {name: name,
	                     image: image,
						 description: description};

    //create a new campground and save to db
	Campground.create(newCampGround, function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			
			res.redirect("/campgrounds");
		}
	});
    
});

app.get("/campgrounds/new", function(req,res){
	res.render("new");
});

//SHOW: show more info about campground
app.get("/campgrounds/:id", function(req,res){
	//find the( campground with id 
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//and show more information
	        res.render("show", {campground: foundCampground});
		}
	});
	
	
});

app.listen(3000, function(){
	console.log("Server is up !!!");
});