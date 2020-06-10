var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var middleware=require("../middleware");//index is a special name that get called by default
//var flash=require("connect-flash");
//root route
router.get("/",function(req,res){
	res.render("landing");
});

//===========
//Auth Routes
//===========

//Show register form
router.get("/register",function(req,res){
	res.render("register");
});
//handle sign up logic
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("register");
		}
		//we are registering the new user then logging him in
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
//show login form
router.get("/login",function(req,res){
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", //we presume the user already exists and we log him in
	{
	  successRedirect:"/campgrounds",
	  failureRedirect:"/login"
	
    }),function(req,res){
	
});

//logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});

module.exports=router;