const Product = require("../models/product")
const formidable = require("formidable") 
const _ = require("lodash")
const fs= require("fs") //comes default in node ..file system
const { sortBy } = require("lodash")
const { json } = require("body-parser")
//const { fileURLToPath } = require("url")
//const product = require("../models/product")

exports.getProductById = (req, res, next , id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "PRODUCT NOT FOUND!!"
            });
        }
        req.product = product;
        next();
    });
}

//we will use form data bcoz we r using images
exports.createProduct = (req, res) => {
    //DECLARING FORM--------------
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    //-------------------

    //PARSE FORM---------//see formidable npm website
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }


        //destructure the fields
        
        const {name, description, price, 
            category, stock} = fields; // fields.name can be called as name

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

        let product = new Product(fields)


        //handle file here
        if(file.photo){
            if(file.photo.size> 3000000){  // size = 1024* 1024* mb
                return res.status(400).json({
                    error: "File size too big!!"
                })
            };

        //including file into the product-----------
                //product.photo.data  from product schema
                // (file.photo.path) here file given by formidable
                //photo has many properties like size, path, type
                product.photo.data = fs.readFileSync(file.photo.path) //mention the entire full path of the file 
                product.photo.contentType = file.photo.type //jpeg, png etc
            }  
            
            console.log(product);


            //save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })

    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined //as images r bulky, difficult to trsanfer
    return res.json(req.product)
};

//this is for prformance optimisation
//do same for mp3, videos etc
//middleware ..so we will use next in callback
//image will load till the time the other things load
exports.photo = (req, res, next) => {
    if(req.product.photo.data){  //check if photo exist
        res.set("Content-type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

//delete controllers
exports.deleteProduct = (req,res) => {
    var product = req.product;

    product.remove((err, deletedProduct) => {
        if(err){
            res.status(400).json({
                error: `failed to delete ${deletedProduct}`
            })
        }
        res.json({
            message: `deleted ${deletedProduct}`
        })
    })
};

//update controllers
exports.updateProduct =(req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    //-------------------

    //PARSE FORM---------//see formidable npm website
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }


        //destructure the fields
        
        const {name, description, price, 
            category, stock} = fields; // fields.name can be called as name

        //updation code
        let product = req.product;
        //lodash --> extend is lodash method --> extends
        //and updates the existing values 
        product = _.extend(product, fields);

        //handle file here
        if(file.photo){
            if(file.photo.size> 3000000){  // size = 1024* 1024* mb
                return res.status(400).json({
                    error: "File size too big!!"
                })
            };

        //including file into the product-----------
                //product.photo.data  from product schema
                // (file.photo.path) here file given by formidable
                //photo has many properties like size, path, type
                product.photo.data = fs.readFileSync(file.photo.path) //mention the entire full path of the file 
                product.photo.contentType = file.photo.type //jpeg, png etc
            }  
            
            // console.log(product);


            //save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Updation failed"
                })
            }
            res.json(product);
        })


    });
}; 


//product listing
exports.getAllProducts = (req, res) => {
    //===if user doesnot choose
    let limit =req.query.limit ? parseInt(req.query.limit): 8 //no of products listed 
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"; //ternary operator

    Product.find()
    .select("-photo") //donot select photo -->bulky 
    .populate("category")
    .sort([[sortBy, "asc"]]) //can sort by multiple parameters
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "No Product Found!!"
            })
        }
        res.json(products);
    })
};

exports.getAllUniqueCategories = (req, res) => {
    //model.distinct()
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "No category Found"
            })
        }
        res.json(category) //returning all categories
    }) 
}

//very important ...updating sold and stock
exports.updateStock = (req,res, next) => {

    let myOperations = req.body.order.products.map(prod => { //looping through product
        return {
            updateOne: { //for every product
                filter: {_id: prod._id}, //find product by id
                //decrease stock and increasse sold
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    // Product.bulkWrite(operations,options, callback)
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk Operation failed"
            })
        }
        next();
    })
}

