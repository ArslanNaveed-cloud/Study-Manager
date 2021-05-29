var mongoose = require('mongoose');
  
var collectioninfo = mongoose.model('collectioninfo',{
    
    username:{
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
    }
    

});
module.exports = {
    collectioninfo
}