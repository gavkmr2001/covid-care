const express = require("express")
const router = express.Router()

const{
    getProductById, 
    createProduct, 
    getProduct, 
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
} = require("../controllers/product")
const {isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const{getUserById} = require("../controllers/user")

//all of params
router.param("userId", getUserById);
router.param("productId", getProductById );

//actual routes=====================================
//create route
router.post(
    "/product/create/:userId", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    createProduct
    );

//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete routes
router.delete("/product/:productId/:userId",
    isSignedIn, 
    isAuthenticated, 
    isAdmin,
    deleteProduct
);


//update routes
router.put("/product/:productId/:userId",
    isSignedIn, 
    isAuthenticated, 
    isAdmin,
    updateProduct
);


//listing routes -->listing all produxts..will limit
//the number shown at once like 8,9
router.get("/products", getAllProducts);

router.get("/product/categories", getAllUniqueCategories);

module.exports = router;