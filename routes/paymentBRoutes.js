const express = require("express");
const router = express.Router();


const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/paymentB");
const { getUserById } = require("../controllers/user");
router.param("userId", getUserById);

router.get("/payment/gettoken/:userId",
    isSignedIn,
    isAuthenticated,  
    getToken);


// router.get("/payment/gettoken/:userId",
//     getToken);

router.post(
    "/payment/braintree/:userId", 
    isSignedIn,
    isAuthenticated, 
    processPayment //method defined in controller
);

// router.post(
//     "/payment/braintree/:userId",
//     processPayment //method defined in controller
// );


module.exports = router;