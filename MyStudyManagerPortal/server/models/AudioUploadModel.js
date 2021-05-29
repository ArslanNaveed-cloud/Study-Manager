var mongoose = require('mongoose');
  
var audiofile = mongoose.model('audiofile',{
    fileTitle:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
  
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
    audiofile
}