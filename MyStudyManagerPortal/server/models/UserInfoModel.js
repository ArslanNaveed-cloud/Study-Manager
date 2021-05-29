var mongoose = require('mongoose');
  
var UserInfo = mongoose.model('UserInfo',{
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
    username:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    Phone:{
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
    password:{
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
    profilepic:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },

});
module.exports = {
    UserInfo
}