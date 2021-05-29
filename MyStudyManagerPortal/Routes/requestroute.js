const express = require("express");
const router = express.Router();




var {requestinfo} = require('../server/models/RequestSendModel');

var {UserInfo} = require('../server/models/UserInfoModel');


router.post('/checkrequest',(req,res)=>{
    
    var sender = req.body.sender;
    var reciever = req.body.reciever;
    var setparameter = req.body.setparameter;   
    console.log(req.body);
    var query;    
    if(setparameter == "or"){
            query={
                $or:[{sender:sender}, {reciever:reciever}]
            }
        }else if(setparameter === "and"){
            console.log("And Operator called");
            query={
               sender:sender,
               reciever:reciever
            }
        }

    console.log("Query =="+query);

    
    requestinfo.find(query,function(err,response){
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
                 console.log(response);
                console.log("You are the sender");
                res.send({
                    status:200,
                    response:response,
                    Message:"Collection Already Exists"
            });    
    
            }
            else {
                query={
                    sender:reciever,
                    reciever:sender
                 }

                 requestinfo.find(query,function(err,response){
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
                         console.log(response);
                         console.log("You are the Reciever");
                         var isaccepted;
                         res.send({
                            status:201,
                            response:response,
                            Message:"Collection Already Exists"
                    });    
            
                    }
                    else {
                       res.send({
                           status:401,
                           response:response,
                           Message:"Collection Already Exists"
                   });    
           
                   }
        });
           }
});
});

router.post('/acceptrequest',(req,res)=>{
    
    var reciever = req.body.reciever;
    var sender = req.body.sender;
    console.log(req.body);
    var query;    
            
               
requestinfo.updateOne(
    {
    sender:reciever,
    reciever:sender
},{
    $set:{
        isaccepted:true
    }
}
,(err,response)=>{
    if(err){
        res.send(
            {
                status:500
            }
        );
    }else{
        res.send({
            status:200
        });
    }

                            });
            
                     
           
                   
        });
           



router.post('/sendrequest',(req,res)=>{
    var sender = req.body.sender;
    var reciever = req.body.reciever;
    var isaccepted = req.body.isaccepted;
    var profilepic = req.body.profilepic;
      var  firstname=req.body.firstname;
      var  lastname=req.body.lastname;
      var  email=req.body.email;
      var  profilesummary=req.body.profilesummary;
      var  date=req.body.date;
      
    console.log(sender+","+reciever+","+isaccepted);
    var RequesData  =new requestinfo(

        {
        sender:sender,
        reciever:reciever,
        isaccepted:"false",
        profilepic:profilepic,
        firstname:firstname,
        lastname:lastname,
        email:email,
        date:date,
        profilesummary:profilesummary,
        counter:"1"
    }
    );
    RequesData.save().then((result) => {
            res.send({
                status:200,
                message:"Data is submitted to the Database"

            });
         
    }).catch((err) => {
        console.log(err);
        res.send(
            {
                status:404,
                message:"Data is not submitted to the Database"
            }
        );
    });

});

router.post('/deleterequest',(req,res)=>{
    var data = req.body.data;
    console.log(data);
  
    var username = req.body.username;
    var is_deleted = new Boolean(false);
    var jsonobject = JSON.parse(data);
    console.log(jsonobject);
        for(i = 0;i<jsonobject.length;i++){
            var sender = jsonobject[i].sendername;
            var reciever = jsonobject[i].recievername;
            
            console.log("RECIEVER == "+reciever);
            query={
                sender:sender,
                reciever:reciever
             }
         }
 
     console.log("Query =="+query);
 
     
     requestinfo.deleteOne(query,function(err,response){
             if(err){
         
                 console.log(err);
                 res.send({
                     status:500,
                     Message:"Internal Server Error",
                     isResponse:false       
                 });
             
             }
            
     
             
             else {
                 query={
                     sender:reciever,
                     reciever:sender
                  }
 
                  requestinfo.deleteOne(query,function(err,response){
                     if(err){
                 
                         console.log(err);
                         res.send({
                             status:500,
                             Message:"Internal Server Error",
                             isResponse:false       
                         });
                     
                     }
                    
             
                     
                     else {
                        res.send({
                            status:200,
                            response:response,
                            Message:"Collection Already Exists"
                    });    
            
                    }
         });
            }
    
        });
});


router.post('/findfriend',(req,res)=>{
    var sender = req.body.sender;
     query={
        sender:sender,
        isaccepted:"true"
     }

console.log("Query =="+query);


requestinfo.find(query,function(err,response){
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
             console.log(response);
            console.log("You are the sender");
          res.send({
              status:200,
              response:response
          });
        }
        else {
            query={
                reciever:sender,
                isaccepted:"true"
             }

             requestinfo.find(query,function(err,response){
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
                     console.log(response);
                     res.send({
                        status:200,
                        response:response
                    });
        
                }
                else {
                   res.send({
                       status:401,
                       response:response,
                       Message:"Collection Already Exists"
               });    
       
               }
    });
       }
});
});

router.post('/checkrecieverrequest',(req,res)=>{
    
    var sender = req.body.sender;
    console.log(req.body);
    var query;    

    query = {
        reciever:sender,
        isaccepted:"false"
    }
    console.log("Query =="+query);

    
    requestinfo.find(query,function(err,response){
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
                 console.log(response);
                console.log("You are the sender");
                res.send({
                    status:200,
                    response:response,
                    Message:"Collection Already Exists"
            });    
    
            }
            else {
              res.send({
                status:401,
                response:response,
                Message:"You are not a reciever to any request"
              });
           }
});
});

router.post('/checkfriendrequest',(req,res)=>{
    
    var sender = req.body.sender;
    console.log(req.body);
    var query;    

    query = {
        sender:sender,
        isaccepted:"true",
        counter:"1"
    }
    console.log("Query =="+query);

    
    requestinfo.find(query,function(err,response){
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
                var isError = false;
                 console.log(response);
                for(i=0;i<response.length;i++){
                    id = response[i]._id;
                    requestinfo.updateOne(
                        {
                        _id:id
                    },{
                        $set:{
                            counter:"2"
                        }
                    }
                    ,(err,response)=>{
                        if(err){
                           isError = true;
                        }else{
                            isError = false;
                        }
                    
                                                });

                }
                if(isError){
                    res.send({
                        response:response,
                        status:500
                    });
                        
                }
                res.send({
                    response:response,
                    status:200
                });
                
                            
                                     
                console.log("You are the sender");
    
            }
            else {
              res.send({
                status:401,
                response:response,
                Message:"You are not a reciever to any request"
              });
           }
});
});
module.exports = router;