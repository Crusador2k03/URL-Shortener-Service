const mongoose = require('mongoose');

async function connectDB(url){
    return mongoose.connect(url);  //returns a promise: 
}

module.exports = {
    connectDB,
};