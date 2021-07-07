var mongoose = require("mongoose");
const crypto = require('crypto'); //crypto is not mentioned in package.json as it is automatically included
const { v4: uuidv4 } = require('uuid');


var userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },

    encry_password :{
        type: String,
        required: true
    },
    //we dont save user password as plain text in the databsse instead convert it into encrypted form(salt)
    // and use that for validation purpose 
    salt: String,
    role: {
        type: Number,
        default: 0,
    },
    purchases : {
        type: Array,
        default: []
    }
}, {timestamps: true});

//virtual function/field are not stored in the db.. refer this (https://mongoosejs.com/docs/tutorials/virtuals.html)
userSchema.virtual("password") //here this password willnot be saved in db..encry_password will be saved in the db.
    .set(function(password){ //while setting this password we want to use securePassword method
        this._password = password; // _password is convention for private variable
        //now password is secured in variable called password
        this.salt =uuidv4(); //populating
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })

userSchema.methods = {
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },

    securePassword : function(plainpassword){
        if (!plainpassword) return "";
        try {
            //copied from crypto node js documentation ...chain of methods
            return crypto
            .createHmac('sha256', this.salt) 
            .update(plainpassword) //updating plainpassword into crypted one
            .digest('hex');
        } catch(err){
            return ""; //when  we return "" then it will give error as password is a required field
        }
    }

}

module.exports = mongoose.model("user", userSchema);