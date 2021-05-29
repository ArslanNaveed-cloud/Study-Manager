var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    var db;
    const conn = mongoose.connect('mongodb://localhost:27017/MyStudyManager',{ useNewUrlParser: true,useUnifiedTopology: true},(err,db)=>{
        db = db;

    });
    console.log('Database Connection Created');
module.exports={
    mongoose,
    db,
};