var express = require('express')
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signout , signup, signin, isSignedIn } = require("../controllers/auth")

router.post(
    "/signup",
    [
    check("name", "min 3 character").isLength({ min: 3}),
    check("email", "email is required").isEmail(),
    check("password", "min 3 character").isLength({ min: 3})

    //this is the code of a newer version of express-validator
    // check("name").isLength({ min: 3}).withmessage("min 3 character"),
    // check("email").isEmail().withmessage("email is required"),
    // check("password").isLength({ min: 3}).withmessage("min 3 character")
    ], 
    signup
); //use postman to run 

router.post(
    "/signin", 
    [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 3})

    
    ],
    signin
); //use postman to run 

router.get("/signout", signout);

// router.get("/testroute", isSignedIn, (req, res)=>{
//     //auth will give _id
//     res.json(req.auth); //auth came from userProperty in controller auth.js
// });



//throws the code out 
module.exports = router;