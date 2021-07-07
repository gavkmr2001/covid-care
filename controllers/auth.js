const User= require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt'); //change name to avoid confusion


exports.signup = (req,res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            //https://express-validator.github.io/docs/index.html
            error: errors.array()[0].msg //check above link
        })
    }

    //create object user from class User and populate
    //class User is created by class mongoose so we can
    //use all db methods that mongoose provides us
    const user= new User(req.body)
    user.save((err , user) => { //user is the time saved in db
        if(err){
//json makes it helpful for the frontend developer 
            return res.status(400).json({
                err: "Not able to save in db"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id //_id written in db
        });
    }) //save is a method from mongoose
};

//lecture 07-03
exports.signin =(req, res) => {
    const {email, password}= req.body //destructuring data
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            //https://express-validator.github.io/docs/index.html
            error: errors.array()[0].msg //check above link
        });
    }

//findOne finds the very first match from the db
    User.findOne({email}, (err, user) => { //findOne is mongoose method
        //------------if email doensnot exist=----------
        if(err || !user){
            return res.status(400).json({
                error: 'USER email doesnot exists'
            })
        }
//-------passowrd doesnot match
        if(!user.authenticate(password)){ //authenticate from user schema
            return res.status(401).json({
                error: "Email and password donot match"
            })
        }

        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        //put token in cookie
        res.cookie("token", token, {expire: new Date()+ 9999})

        //send response to frontend
        const {_id , name, email, role } = user;
        return res.json({ token, user: {_id, name, email, role} });
    });




};

exports.signout = (req, res)=> {
    //clearCookie method comes from cookieparser  
    res.clearCookie("token"); //deleted the token variable
    res.json({
        message: "user signout successful!!"
    }); 
};


//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth" //auth will give id
});


//custom middlewares
exports.isAuthenticated = (req, res, next) =>{
    // req.profile comes from frontend req.auth from issignedin route
    let checker=  req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error:"ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "ADMIN SECTION!!..ACCESS DENIED"
        })
    }
    next();
}


// When we do token-based authentication, such as OpenID,
// OAuth, or OpenID Connect, we receive an access_token 
// (and sometimes id_token) from a trusted authority. 
// Usually we want to store it and send it along with 
// HTTP Requests for protected resources. How do we do that?

// Option 1 is to store the token(s) in a cookie.
// This handles storage and also automatically sends
// the token(s) to the server in the Cookie header of
//  each request. The server then parses the cookie, 
//  checks the token(s), and responds accordingly.    

// benefits of JSON Web Tokens (JWT) when compared to Simple 
// Web Tokens (SWT) and Security Assertion Markup Language
//  Tokens (SAML).


