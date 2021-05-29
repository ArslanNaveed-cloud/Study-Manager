var mongoose = require('mongoose');
  
var photofileinfo = mongoose.model('photofileinfo',{
   
    username:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    filename:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    collectionname:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    filesize:{
        type:Number,
        required:true,
        minlength:1,
        trim:true
    },
    
});
module.exports = {
    photofileinfo
}