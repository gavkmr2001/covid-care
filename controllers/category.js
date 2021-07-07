// const category = require("../models/category");
const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => { //method
   
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
               error: "Category not found in DB" 
            })
        }
        req.category= cate;
    next();

    });
};

exports.createCategory = (req,res) => {
    //req.body populated from Category
    const category=  new Category(req.body); //create object named category from Category which is imported from category model
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "NOT able to save category in DB"
            });
        }
        res.json({category});
    });

};

exports.getCategory = (req, res) => {
    return res.json(req.category);  //from getCategoryById --cate
};

exports.getAllCategory = (req,res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories found!!"
            });
        }
        res.json(categories)
    })
};

exports.updateCategory = (req, res) => {
    const category = req.category; //from getCategoryById
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "failed to update category"
            });
        }
        res.json(updatedCategory);
    })
};

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, category) => { //remove operation by mongoose 
        if(err){
            return res.status(400).json({
                error: "failed to delete this category"
            });
        }
        res.json({
            message: `Successfully deleted ${category.name}`
        });
    }) 
}