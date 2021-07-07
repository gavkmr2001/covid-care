var mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,
    unique: true
    }

},
 {timestamps: true} //notes the time of input in db
 );
    
module.exports = mongoose.model("Category", categorySchema);