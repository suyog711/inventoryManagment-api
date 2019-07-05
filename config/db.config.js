var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.dbUrl+'/'+config.dbName, function(err, done){
    if (err){
        console.log('mongo db connection failed');
        return;
    }
    console.log('connected to db');
})

