var mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema; //need this when we associate two schemas

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    //assosciating one schema with another schema => we use mongoose ObjectId
    category: { //like summer collection, classics
        type: ObjectId,
        ref: "Category", //from where the ObjectId is gonna come up
                        //exact name as in category.js
                        //module.exports = mongoose.model("Category", categorySchema)
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0 //at beginning the value be 0
    },
    photo: { //way to put images in db ...there are ways that we dont 
        //need to put the images in the db
        data: Buffer,
        contentType: String
    }

},
    {timestamps: true});



module.exports = mongoose.model("Product", productSchema);