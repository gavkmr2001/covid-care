require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser= require("cookie-parser")
const cors= require("cors");
const path = require('path') //added later...freecodecamp
// require('./database'); //added later...freecodecamp

//tells to bring contnent from the given address
const authRoutes = require("./routes/auth") //auth.js
const userRoutes = require("./routes/user") //user.js
const categoryRoutes= require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
// const stripeRoutes = require("./routes/stripepayment")
const paymentBRoutes = require("./routes/paymentBRoutes");


// //DB connectionssss
var url= process.env.DATABASEURL //databaseurl from heroku website
// var url= process.env.DATABASEURL
mongoose
    .connect(url,{ //process is where it attaches all the new dependencies
        //.env is the file that we created
        //DATABASE is the name of variable in .env file
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log("DB CONNECTED");
    }).catch(console.log("DB GOT OOOPSS"));

    
//Middlewares---------------------
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json()); //req.body
    app.use(cookieParser());
    app.use(cors());

//MY ROUTES----------------------
app.use("/api", authRoutes); 
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
// app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);


//added later... told by sir(lco)
if(process.env.NODE_ENV === 'production'){
    app.use(express.static("projfrontend/build"));
    app.get('/*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'projfrontend', 'build','index.html'))
    });
}

//freecodecamp 
// app.use(express.static(path.join(__dirname, '../build')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build'))
// })


//prefixing /api in front of all  the routes. ==> http://localhost:8000/api/signout


//------------------PORT-------------
//.env file is not uploaded on github so we can 
// keep sensititve info there 
 const port = process.env.PORT || 8000;

 //STARTING A SERVER---------------
 app.listen(port, () => {
     console.log("app is running");
 });