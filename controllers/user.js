const User = require("../models/user") 
const Order= require("../models/order")

exports.getUserById = (req, res, next ,id) => { //METHOD
    User.findById(id).exec((err, user) => {
        if(err || !user) { //MIDDLEWARE
            return res.status(400).json({
                error: "no user was found in DB"
            });
        }
        req.profile = user; //saved the object in profile
        next();
    });
};

exports.getUser = (req, res) => { //METHOD
    //sensitive info..not to be shown----------
    req.profile.salt =undefined; 
    req.profile.encry_password = undefined; 
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    //----------------------
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id}, //how do i find it
        {$set: req.body}, //what we want to update or push
        {new: true, useFindAndModify: false},
        (err, user) => { 
            if(err){
                return res.status(400).json({
                    error: "COULDNOT UPDATE"
                });
            }
            //we are getting user from the callback and want to show selected info only
            user.salt =undefined; 
            user.encry_password = undefined; 
            user.createdAt = undefined;
            user.updatedAt = undefined;
            return res.json(user);
        }

    );
};


exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id}) //from order.js
    .populate("user", "_id name")
    .exec((err, order) =>{
        if(err){
            return res.status(400).json({
                error: "No order in this account"
            });
        }
        return res.json(order);
    });
};

//middleware ..so need to use next in callback
exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    //store this in db
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}}, //$push because it is an array
        {new: true}, //send the updated object from db
        //callback
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next();
        }
    
    )

}