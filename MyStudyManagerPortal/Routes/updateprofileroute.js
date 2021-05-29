const express = require("express");
const router = express.Router();
var fs = require('fs');
var path = require('path');  
var {UserInfo} = require('../server/models/UserInfoModel');
router.use(express.static(path.join(__dirname,'public')));

var randomnum = Math.floor(Math.random() * 10000);

const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/assets/profilepictures/',
    filename: function(req, file, cb) {
      cb(null,randomnum + file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    // reject a file
    
      cb(null, true);
    
  };

//Init Upload
const upload = multer({
    storage: storage,
    });
router.post('/updatefirstname',(req,res)=>{
    var username = req.body.username;
    var firstname = req.body.firstname;
    console.log("Api Called"+username);


    UserInfo.updateOne(
        {
       username:username
    },{
        $set:{
            firstname:firstname
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
    
  });});

  router.post('/updatelastname',(req,res)=>{
    var username = req.body.username;
    var lastname = req.body.lastname;
    console.log("Api Called"+username);


    UserInfo.updateOne(
        {
       username:username
    },{
        $set:{
            lastname:lastname
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
    
  });});
  router.post('/updateusername',(req,res)=>{
    var username = req.body.username;
    var name = req.body.name;
    console.log("Api Called "+username);
   

    var query={
        
        username:name
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
                    status:201,
                    Message:"User Already Found",
                    isResponse:false    
                });
        
    
            }else{
                UserInfo.updateOne(
                    {
                   username:username
                },{
                    $set:{
                        username:name
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
            }
        
});

   
});

router.post('/updateemail',(req,res)=>{
    var username = req.body.username;
    var email = req.body.email;
    console.log("Api Called "+username);
    UserInfo.updateOne(
        {
       username:username
    },{
        $set:{
            email:email
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

router.post('/updatepassword',(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    console.log("Api Called "+username);
    UserInfo.updateOne(
        {
       username:username
    },{
        $set:{
            password:password
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

router.post('/updatesummary',(req,res)=>{
    var username = req.body.username;
    var summary = req.body.summary;
    console.log("Api Called "+username);
    UserInfo.updateOne(
        {
       username:username
    },{
        $set:{
            profilesummary:summary
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
router.post('/updateprofilepic',upload.single('file'),(req,res)=>{
    var username = req.body.username;
   
    var filename = randomnum+req.file.originalname;

    var query = {
        username:username
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
           
            var filetodelete = response[0].profilepic;
            var file_path ="./public/assets/profilepictures/"+filetodelete;
            fs.unlink(file_path, function (err) {
                if (err) {
                    console.log(err);
                
                }else{
                    console.log('File deleted!');
                    UserInfo.updateOne(
                        {
                       username:username
                    },{
                        $set:{
                            profilepic:filename
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
                }
                // if no error, file has been deleted successfully
              
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

module.exports = router