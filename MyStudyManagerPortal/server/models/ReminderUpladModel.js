var mongoose = require('mongoose');
  
var reminderinfo = mongoose.model('reminderinfo',{
   
    username:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    remindertitle:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    subjecttitle:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },  
    category:{
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
    time:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    medium:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    code:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    }
  
});
module.exports = {
    reminderinfo
}