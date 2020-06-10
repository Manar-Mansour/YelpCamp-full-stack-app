var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");//index is a special name that get called by default
//INDEX route - show all campgrounds
router.get("/", function(req,res){
	console.log(req.user);
    Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err)
			   }else{
				   res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser:req.user});
			   }
	})
	//res.render("campgrounds",{campgrounds:campgrounds});
});

//CREATE route - add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req,res){
	//res.send("you hit post route");
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,price:price,image:image,description:desc,author:author};
	//campgrounds.push(newCampground);
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})
	//res.redirect("/campgrounds");
})

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error","Campground not found");
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
	
});
//Edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	
		Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
			
	});
	
	
});
//Update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});
//Destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find campground to be deleted and delete the comments associated to it
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//remove all comments associated to this campground
			foundCampground.comments.forEach(function(comment) {
				Comment.findByIdAndRemove(comment._id, function(err){
					if(err){
						console.log(err);
					} else {
						console.log("removed comment from deleted campground");
					}
				});
			});
		}
	});
	//remove campground
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports=router;