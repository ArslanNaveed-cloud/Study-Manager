var express = require('express');
const router = express.Router();

var {reminderinfo} = require('../server/models/ReminderUpladModel');

router.post('/setreminder',(req,res)=>{
    var username=req.body.username;
    var remindertitle=req.body.remindertitle;
    var subjecttitle=req.body.subjecttitle;
    var category=req.body.category;
    var date=req.body.date;
    var time=req.body.time;
    var medium = req.body.medium;
    var code = req.body.code;
    
    console.log(
    "code = "+code
    );
            var ReminderData  =new reminderinfo(
                {
                username: username,
                remindertitle: remindertitle,
                subjecttitle:subjecttitle,
                category: category,
                date: date,
                time:time,
                medium:medium,
                code:code
            }
            );
            var query = {
                remindertitle:remindertitle
            }
            reminderinfo.find(query,function(err,response){
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
                        status:409,
                        Message:"Reminder Already Exist "
                });    
        
                }
                else{
                    ReminderData.save().then((result) => {
                      var subjecttitle = result.subjecttitle;
                      var category = result.category;
                      console.log(subjecttitle+" "+category);
                        res.send({
                            status:200,
                            subjecttitle,
                            category,
                        });
                       
                    }).catch((err) => {
                        console.log(err);
                        res.send(
                            {
                                status:500,
                                message:"Data is not submitted to the Database"
                            }
                        );
                    });
                
                }
            
            });
    
          

        
});
module.exports =router;