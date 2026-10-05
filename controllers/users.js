const User = require("../models/user.js")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("users/login.ejs");

}

module.exports.signup = async (req, res, next) => {
   try {
     let { username, email, password } = req.body;
     const newUser = new User({ email, username });
     const registerdUser = await User.register(newUser, password);
     console.log(registerdUser);
     req.login(registerdUser, (err) => {
         if (err) {
             return next(err);
         }
         req.flash("success", "Welcome to Wanderlust!");
         res.redirect("/listings");
     });
   } catch(e) {
     req.flash("error", e.message);
     res.redirect("/signup");
   }
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect("/listings");
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
