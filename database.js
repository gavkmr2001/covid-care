const mongoose = require('mongoose');
const connection = "mongodb+srv://shopping-frontend:Gaurav@94310@shopping-frontend.065r7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));