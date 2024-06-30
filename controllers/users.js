const User = require("../models/user.js");

module.exports.rendersignupform = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
      let {username, email,password}= req.body;
      const newuser= new User({email,username});
      const registeruser =  await User.register(newuser,password);
      console.log(registeruser);
      req.login(registeruser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","Welcome to WanderWin!");
        res.redirect("/listings");
      });
     
    }catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }
      
};

  module.exports.renderloginform = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =async(req,res)=>{
    req.flash("success","Welcome Back To WanderWin!");
    let redirecturl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);
};

module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
       return next(err);
      }
      req.flash("success","you are logged out");
      res.redirect("/listings");
    });
  }