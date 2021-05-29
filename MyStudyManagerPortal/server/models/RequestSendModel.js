var mongoose = require('mongoose');
  
var requestinfo = mongoose.model('requestinfo',{
   
    sender:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    reciever:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    isaccepted:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    }, 
    profilepic:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    firstname:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    date:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
  
    profilesummary:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    counter:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
  
});
module.exports = {
    requestinfo
}