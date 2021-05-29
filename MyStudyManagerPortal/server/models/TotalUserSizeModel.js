var mongoose = require('mongoose');
  
var totalsizeinfo = mongoose.model('totalsizeinfo',{
   
    username:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    totalsize:{
        type:Number,
        required:true,
        minlength:1,
        trim:true
    },
  
});
module.exports = {
    totalsizeinfo
}