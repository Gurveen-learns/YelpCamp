var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose 			  = require("mongoose"),
    Campground 			  = require("./models/campground.js"),
	Comment 			  = require("./models/comment.js"),
	seedDB                = require("./seeds.js"),
	passport              = require("passport"),
	LocalStrategy         = require("passport-local"),
	User                  = require("./models/user.js");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/yelp_camp_v5");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDB();
//====Passport Configuration=============//
app.use(require("express-session")({
	secret: "Every tear is a waterfall",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

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
			 res.render("campgrounds/index", {campgrounds: allCampgrounds });
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
	res.render("campgrounds/new");
});

//SHOW: show more info about campground
app.get("/campgrounds/:id", function(req,res){
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

//////////////////Comments Routes////////////////////////

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	//find campground by findById
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
	
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

////////Auth Routes////////////////////

//==Show Register Form==//
app.get("/register", function(req, res){
	res.render("register");
});

//==Handle SignUp ==//
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
		
	});
});

//==Show Login Form==//
app.get("/login", function(req, res){
	res.render("login");
});

//==Handle Login==//
app.post("/login",passport.authenticate("local", 
				{
	               successRedirect: "/campgrounds",
				    failureRedirect: "/login"
                }),
		 function(req, res){
	});

//==Logout route==//
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("Server is up !!!");
});