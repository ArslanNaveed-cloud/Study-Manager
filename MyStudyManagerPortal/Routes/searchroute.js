const express = require("express");
const router = express.Router();


var {UserInfo} = require('../server/models/UserInfoModel');
router.post('/searchusers',(req,res)=>{
    
    var username = req.body.username;
    console.log("Api Called"+username);


    var query={
        
        username:{$regex:username,$options:'<i>'} 
    }
        UserInfo.find(query,function(err,response){
            if(err){
        
                console.log(err);
                res.send({
                    status:500,
                    Message:"Internal Server Error",
                    isResponse:false       
                });
            
            }
            else if(!response){
                console.log("No User Found");
                res.send({
                    status:404,
                    Message:"Record Not Found",
                    isResponse:false    
                });
            }
            else if(response==null){
                console.log("No User Found");
               
                res.send({
                    status:404,
                    Message:"Record Not Found",
                    isResponse:false    
                });
        
            }
            else if(response.length>=1){
                 console.log(response[0]._id);
                console.log("File Already Exists");
                res.send({
                    status:200,
                    response:response,
                    Message:"Collection Already Exists"
            });    
    
            }else{
                res.send({
                    status:404,
                    Message:"Record Not Found",
                    isResponse:false    
                });
            }

        
});
});
module.exports = router;