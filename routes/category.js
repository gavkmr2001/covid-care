var express= require("express")
var router=  express.Router()

//bringing something(methods) the controllers
const {
    getCategoryById, 
    createCategory, 
    getCategory, 
    getAllCategory,
    updateCategory,
    removeCategory
} = require("../controllers/category")
const { isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth") //order doesnot matter
const {getUserById } = require("../controllers/user")


//params
router.param("userId", getUserById );
router.param("categoryId", getCategoryById );

//actual routes goes here
//create routes-------------
router.post("/category/create/:userId", 
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory //method 
); //order is important

//read routes-------------
// :categoryId param will run
router.get("/category/:categoryId", getCategory) //grab a single category

router.get("/categories", getAllCategory) //get all category

//update routes
router.put("/category/:categoryId/:userId", 
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);


//delete routes

router.delete("/category/:categoryId/:userId", 
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
);

//throws the code out
module.exports = router;