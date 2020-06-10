var express      =require("express"),
app              =express(),
bodyParser       =require("body-parser"),
Campground       =require("./models/campground"),
Comment			 =require("./models/comment"),
User			 =require("./models/user"),
seedDB			 =require("./seeds"),
mongoose         =require("mongoose"),
flash            =require("connect-flash"),
passport		 =require("passport"),
LocalStrategy    =require("passport-local"),
methodOverride   =require("method-override");

//seedDB();
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"again rusty is the best",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//will call this function on all routes
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//requiring routes
var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes=require("./routes/index");

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify:false});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,process.env.IP,function(){console.log("YelpCamp server has started");});