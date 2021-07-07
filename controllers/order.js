const {Order, ProductCart} = require("../models/order")

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price") //no comma
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No order found in DB"
            })
        }
        req.order = order;
        next();
    })
}

//my main code...
exports.createOrder = (req, res) => {
    //see order model..user field is populted
    req.body.order.user = req.profile //req.profile populated by getUserById
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error: "Failed to save your order in DB"
            });
        }
        res.json(order);
    });
};

//=================================`
//got from codeshare...https://codeshare.io/24z3kL
// exports.createOrder = (req, res) => {
//     try{
    
//     req.body.order.user = req.profile;
//       console.log(req.body.order)
  
//     const order = new Order(req.body.order);
//     console.log(order)
//     order.save((err, order) => {
//     console.log(err)
  
//       if (err || !order) {
//         return res.status(400).json({
//           error: "Failed to save your order in DB"
//         });
//       }
//       res.json(order);
//     });
//     }
    
//     catch(err){
//     console.log(err)
//     }
//   };

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name") //_id and name from user
        .exec((err, order) => {
            if(err){
                return res.status(400).json({
                    error:"No Orders found In DB"
                });
            }
            res.json(order);
        });
};


exports.getOrderStatus =(req, res) => {
    //doubt
    res.json(Order.schema.path("status").enumValues);
};


exports.updateStatus =(req, res) => {
    Order.update(
        //locate based on id
        {_id: req.body.orderId}, //from frontend
        {$set: {status: req.body.status}}, //what we want to update
        (err,order) => { //callback
            if(err){
                return res.status(400).json({
                    error: "Cannot update order status"
                });
            };
            res.json(order);
        }
    )
};


