var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose 			  = require("mongoose"),
	methodOverrride       = require("method-override"),
    Campground 			  = require("./models/campground.js"),
	Comment 			  = require("./models/comment.js"),
	seedDB                = require("./seeds.js"),
	passport              = require("passport"),
	LocalStrategy         = require("passport-local"),
	User                  = require("./models/user.js");

//requiring routes
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes    = require("./routes/comments.js");
var indexRoutes      = require("./routes/index.js");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/yelp_camp_v7");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverrride("_method"));
//seedDB(); //Seed the database
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

/////////////Using Routes//////////////////////////////////////
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
	console.log("Server is up !!!");
});