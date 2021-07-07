const express= require("express")
const router = express.Router()

//the way to import 
const { getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const {isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth")

//router.param(name, callback) --https://expressjs.com/en/api.html#router.param
//defined callback in controller/user.js and import here
router.param("userId", getUserById );

router.get("/user/:userId",isSignedIn, isAuthenticated, getUser);

router.put("/user/:userId",isSignedIn, isAuthenticated, updateUser);

router.put("/orders/user/:userId",isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;