//local import
var {mongoose} = require('./db/mongoose');
var nodemailer = require('nodemailer');
var fs = require('fs');

var {UserInfo} = require('./models/UserInfoModel');
var {collectioninfo} = require('./models/NewCollectionModel');
var {pdffileinfo} = require('./models/PdfFileUploadModel');
var {docfileinfo} = require('./models/DocFileUploadModel');
var {photofileinfo} = require('./models/PhotoUploadModel');
var {videoinfo} = require('./models/VideoUploadModel');
var {audiofile} = require('./models/AudioUploadModel');
var {zipfileinfo} = require('./models/ZipUploadModel');
var {totalsizeinfo} = require('./models/TotalUserSizeModel');
var {reminderinfo} = require('./models/ReminderUpladModel');


var {conn} = require('./db/mongoose');
var path = require('path');   
//global modules
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app  = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/assets',express.static('public/assets'));
var path = require('path');
app.use(express.static(path.join(__dirname,'public')));

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

app.post('/registeruser',upload.single('file'),(req,res)=>{
    var randnumb = Math.floor(Math.random() * 10000);
    
    var username = req.body.firstname+"_"+req.body.lastname+randnumb;
    var filename = randomnum+req.file.originalname;
               
            var UserData  =new UserInfo(
                {
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                username:username,
                Phone:req.body.Phone,
                email:req.body.email,
                password:req.body.password,
                profilesummary:req.body.profilesummary,
                profilepic:filename
            }
            );
           
            UserData.save().then((result) => {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'mystudymanger@gmail.com',
                        pass: 'knightkingalpha'
                      },
                  });
              
                  
                  var mailOptions = {
                    from: 'mystudymanger@gmail.com',
                    to: UserData.email,
                    subject: 'Your Credentials',
                    text: 'Username : '+UserData.username+"  Password :"+UserData.password
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      res.send({
                        status:200,
                        message:"Data is saved in the Database"
    
                });
                    }
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

app.post('/getcount',(req,res)=>{
    var username = req.body.username;
    var collectionlength=0;
    var filelength=0;
    var quizlength=0;
    var assignmentlength=0;
    var size_length = 0;
    var collec_query = {
        username:username
    }
    var quiz_query = {
        username:username,
        category:'Quiz'
    }
    var assign_query = {
        username:username,
        category:'Assignment'
    }
    var pdffile_query = {
        username:username,
      
    }
    var docfile_query = {
        username:username,
       
    }
    var imagefile_query = {
        username:username,
       
    }
    var audiofile_query = {
        username:username,
       
    }
    var videofile_query = {
        username:username,
      
    }
    var zipfile_query = {
        username:username,
      
    }
    var size_query = {
        username:username
    }

    collectioninfo.find(collec_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            collectionlength = response.length;
            checkassignments();

        }
        else{
            console.log("Empty Record Error");
            collectionlength = response.length;
            checkassignments();
        }

        
});

function checkassignments(){
    reminderinfo.find(assign_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
           assignmentlength = response.length;
            checkquiz();
        }
        else{
            console.log("Empty Record Error");
            checkquiz();
        }
    
        
    });
}

function checkquiz(){
    reminderinfo.find(quiz_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            console.log("Quiz Length =>"+quizlength);
            
           quizlength = response.length;
    checkpdffiles();
        }
        else{
            console.log("Empty Record Error");
            quizlength= response.length;
            checkpdffiles();
        }
    
        
    });
}


function checkpdffiles(){
    pdffileinfo.find(pdffile_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            filelength= filelength+response.length;
            checkdocfiles();
        }
        else{
            console.log("Empty Record Error");
            filelength= filelength+response.length;
            checkdocfiles();
        }
    
        
    });
}
function checkdocfiles(){
    docfileinfo.find(docfile_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            filelength= filelength+response.length;
            checkphotofiles();
        }
        else{
            console.log("Empty Record Error");
            filelength= filelength+response.length;
            checkphotofiles();
        }
    
        
    });
}

function checkphotofiles(){
    photofileinfo.find(imagefile_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            filelength= filelength+response.length;
            checkaudiofile();
        }
        else{
            console.log("Empty Record Error");
            filelength= filelength+response.length;
            checkaudiofile();
        }
    
        
    });
}

function checkaudiofile(){
    audiofile.find(audiofile_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            filelength= filelength+response.length;
            checkvideofile();
        }
        else{
            console.log("Empty Record Error");
            filelength= filelength+response.length;
            checkvideofile();
        }
    
        
    });
}
    
function checkvideofile(){

    videoinfo.find(videofile_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            filelength= filelength+response.length;
            checkzipfile();
        }
        else{
            console.log("Empty Record Error");
            filelength= filelength+response.length;
            checkzipfile();
        }
    
        
    });
}

function checkzipfile(){

    zipfileinfo.find(zipfile_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            filelength= filelength+response.length;
          
            checksizeofcontent();
        }
        else{
            console.log("Empty Record Error");
           
            checksizeofcontent();
        }
    
        
    });
}
function checksizeofcontent(){
    totalsizeinfo.find(size_query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            size_length = response[0].totalsize;
           res.send({
               status:200,
               collectionlength:collectionlength,
               quizlength:quizlength,
               assignmentlength:assignmentlength,
               filelength:filelength,
               size:size_length
           });
        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:200,
                collectionlength:collectionlength,
                quizlength:quizlength,
                assignmentlength:assignmentlength,
                filelength:filelength,
                size:size_length
            });
        }
    
        
    });
}

});

app.post('/userlogin',(req,res)=>{
    var user = req.body.username;
    var pass = req.body.password;
    var query = {
        username:user,
        password:pass
                };
                console.log(query);
    UserInfo.findOne(query,function(err,response){
        
            if(err){
                    
                console.log("Authentication Rejected");
                res.send({
                    status:500,
                    Message:"Internal Server Error",
                    authentication:false,
                    username:""       
                });
            
            }
            else if(!response){
                console.log("Authentication Rejected");
                res.send({
                    status:404,
                    Message:"User Not Found",
                    authentication:false,
                    username:""    
                });
            }
            else{
                console.log(response);
                console.log(response.username);
                
                console.log("Authentication Successfull");
                res.send({
                status:200,
                Message:"User Found",
                authentication:true,    
                username:response.username
            });    

            }
            
    });
    
});

app.post('/addcollection',(req,res)=>{
    var collectionname = req.body.collecname;
    var username = req.body.username;
    var query = {
        username:username,
        collectionname:collectionname
    }
    collectioninfo.find(query,function(err,response){

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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            console.log("Empty Record Error");
            var collectionData  =new collectioninfo(
                {
                username:username,
                collectionname:collectionname
            }
            );
            
            collectionData.save((err,result)=>{
                if(err){
                    res.send({
                        status:500,
                        Message:"Internal Server Error"
                    });
  
                }else{
                    var query = {
                        username:username
                    }
                    totalsizeinfo.find(query,function(err,response){

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
                            console.log("Collection Already Exists");
                            res.send({
                                status:200,
                                Message:"Collection Added Sucessfully"
                            });
                
                        }
                        else{
                            console.log("Empty Record Error");
                            var TotalSizeData  =new totalsizeinfo(
                                {
                                username:username,
                                totalsize:0
                            }
                            );
                            
                            TotalSizeData.save((err,result)=>{
                                if(err){
                                    res.send({
                                        status:500,
                                        Message:"Internal Server Error"
                                    });
                  
                                }else{
                                    
                                   res.send({
                                       status:200,
                                       Message:"Collection Added Sucessfully"
                                   });
                                }
                            });
                                
                             
                        }
                
                
                    });
                }
            });
                
             
        }


    });
   
                 
                 


});

app.post('/updatecollection',(req,res)=>{
    var collectionname = req.body.collecname;
    var username = req.body.username;
    var oldname = req.body.oldname;
    console.log(collectionname+username+oldname);
    var query = {
        username:username,
        collectionname:collectionname
    }
    
    collectioninfo.find(query,function(err,response){

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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            collectioninfo.updateOne(
                {
               username:username,
               collectionname:oldname
            },{
                $set:{
                    collectionname:collectionname
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
app.post('/updatevideo',(req,res)=>{
    var fileTitle = req.body.filename;
    var username = req.body.username;
    var oldname = req.body.oldname;
    var collectionname = req.body.collection;
   
    console.log(fileTitle+username+oldname);

    var query={
        username:username,
        fileTitle:fileTitle,
        collectionname:collectionname
    }
    videoinfo.find(query,function(err,response){

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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            videoinfo.updateOne(
                {
               username:username,
               fileTitle:oldname,
               collectionname:collectionname
            },{
                $set:{
                    fileTitle:fileTitle
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
app.post('/updateaudio',(req,res)=>{
    var fileTitle = req.body.filename;
    var username = req.body.username;
    var oldname = req.body.oldname;
    var collectionname = req.body.collection;
   
    console.log(fileTitle+username+oldname);
    var query={
        username:username,
        fileTitle:fileTitle,
        collectionname:collectionname
    }
    audiofile.find(query,function(err,response){

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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            audiofile.updateOne(
                {
               username:username,
               fileTitle:oldname,
               collectionname:collectionname
            },{
                $set:{
                    fileTitle:fileTitle
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
app.post('/updatepdf',(req,res)=>{
    var fileTitle = req.body.filename;
    var username = req.body.username;
    var oldname = req.body.oldname;
    var collectionname = req.body.collection;
    console.log(fileTitle+username+oldname);
    var query={
        username:username,
        fileTitle:fileTitle,
        collectionname:collectionname
    }
    pdffileinfo.find(query,function(err,response){

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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            pdffileinfo.updateOne(
                {
               username:username,
               fileTitle:oldname,
               collectionname:collectionname
            },{
                $set:{
                    fileTitle:fileTitle
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
app.post('/updatedocument',(req,res)=>{
    var fileTitle = req.body.filename;
    var username = req.body.username;
    var oldname = req.body.oldname;
    console.log(fileTitle+username+oldname);
    var collectionname = req.body.collection;
    console.log("Doc =="+collectionname);
    var query={
        fileTitle:fileTitle,
        username:username,
        collectionname:collectionname
    }
    docfileinfo.find(query,function(err,response){

        console.log(response);
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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            console.log("Updating File name...");
    
            docfileinfo.updateOne(
                {
               username:username,
               fileTitle:oldname,
               collectionname:collectionname
            },{
                $set:{
                    fileTitle:fileTitle
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
app.post('/updatezip',(req,res)=>{
    var fileTitle = req.body.filename;
    var username = req.body.username;
    var oldname = req.body.oldname;
    var collectionname = req.body.collection;
   
    console.log(fileTitle+username+oldname);
    var query={
        username:username,
        fileTitle:fileTitle,
        collectionname:collectionname
    }
    zipfileinfo.find(query,function(err,response){

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
            console.log("Collection Already Exists");
            res.send({
                status:409,
                Message:"Collection Already Exists"
        });    

        }
        else{
            zipfileinfo.updateOne(
                {
               username:username,
               fileTitle:oldname,
               collectionname:collectionname
            },{
                $set:{
                    fileTitle:fileTitle
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
app.post('/viewcollection',(req,res)=>{
   
    var user = req.body.username;
    
    var query = {
        username:user
                };
                collectioninfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});
app.post('/viewpdffiles',(req,res)=>{
   
    var user = req.body.username;
    var collecname = req.body.collectionname;
    console.log("Hello World"+collecname);
    var query = {
        username:user,
        collectionname:collecname
                };
                pdffileinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});
app.post('/viewphotos',(req,res)=>{
   
    var user = req.body.username;
    var collecname = req.body.collectionname;
    console.log("Hello World"+collecname);
    var query = {
        username:user,
        collectionname:collecname
                };
                photofileinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});
app.post('/viewdocfiles',(req,res)=>{
   
    var user = req.body.username;
    var collecname = req.body.collectionname;
    console.log("Hello World"+collecname);
    var query = {
        username:user,
        collectionname:collecname
                };
                docfileinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});
app.post('/viewreminder',(req,res)=>{
   
    var user = req.body.username;
   
    var query = {
        username:user,
                };
                reminderinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});

app.post('/viewzip',(req,res)=>{
   
    var user = req.body.username;
    var collecname = req.body.collectionname;
    console.log("Hello World"+collecname);
    var query = {
        username:user,
        collectionname:collecname
                };
                zipfileinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});
app.post('/viewvideos',(req,res)=>{
   
    var user = req.body.username;
    var collecname = req.body.collectionname;
    console.log("Hello World"+collecname);
    var query = {
        username:user,
        collectionname:collecname
                };
                videoinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});

app.post('/viewaudios',(req,res)=>{
   
    var user = req.body.username;
    var collecname = req.body.collectionname;
    console.log("Hello World"+collecname);
    var query = {
        username:user,
        collectionname:collecname
                };
                audiofile.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
             console.log(response);
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
});
app.post('/checktime',(req,res)=>{

    var checkdate = req.body.date;
    var medium = req.body.medium;
    var time = req.body.time;
    var currenttime = moment().format("h:mma");
       
    
    var now = moment().format("YYYY-MM-DD");
    var mytime =time+""+medium;
    console.log("My Time == "+mytime);
    console.log("Current Time == "+currenttime);
    var beginningTime = moment(mytime, 'h:mma');
    
    var endTime = moment(currenttime, 'h:mma');
    
    console.log("Time Recieved = "+beginningTime);
    console.log("Current Time = "+endTime);
  
    var isbeforedate = moment(checkdate).isBefore(now);
    
    var iscurrentdate = moment(checkdate).isSame(now);
    
    var isbeforetime =  beginningTime.isBefore(endTime);
    //console.log(isbeforetime);
    if(isbeforedate){
        res.send({
            status:400

        });
    }else if(iscurrentdate){
        if(isbeforetime){
            res.send(
                {
                    status:401
                }
            );
        }else{
            res.send({
                status:200
            });
        }
    }else{
        res.send({
            status:200
        });
    }

});
app.post('/updatesize',(req,res)=>{
    var username = req.body.username;
    var newsize = req.body.size;
    newsize = parseFloat(newsize);
    var query={
        username:username
    }
    totalsizeinfo.find(query,function(err,response){
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
                var size = response[0].totalsize;
                console.log("Old Size == "+size);
                size = parseFloat(size);
                var updatedsize = parseFloat(updatedsize);
                 updatedsize = size+newsize;
                    console.log("Updated size  == "+updatedsize);
                totalsizeinfo.updateOne(
                    {
                    username:username
                },{
                    $set:{
                        totalsize:updatedsize
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
else{
} 
        
    });
});
app.post('/getsize',(req,res)=>{
    var username = req.body.username;
    var query = {
        username:username
    }
        totalsizeinfo.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
                size_length = response[0].totalsize;
                size_length = parseFloat(size_length);
                size_length = size_length/1024;
               res.send({
                   status:200,
                
                   size:size_length
               });
            }
            else{
                console.log("Empty Record Error");
                res.send({
                    status:200,
                   
                });
            }
        
            
        });
    
});
app.post('/collectiondeleted',(req,res)=>{
    var username = req.body.username;
    var is_deleted = new Boolean(false);
    var data = req.body.data;
    var jsonobject = JSON.parse(data);
    for(i = 0;i<jsonobject.length;i++){
        var collectionname = jsonobject[i].collectionname;
        var filesize = 0;
        var query = {
            username:username,
            collectionname:collectionname
        }
        pdffileinfo.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
    
                for(var i = 0;i<response.length;i++){
                    filesize = filesize+response[i].filesize;
                    var filename = response[i].filename;
                    
                    var file_path ="./public/assets/PDfFiles/"+filename; 
                    fs.unlink(file_path, function (err) {
                        if (err) {
                            console.log(err);
                        
                        }else{
                            console.log('File deleted!');
                        
                        }
                        // if no error, file has been deleted successfully
                      
                    }); 
                    pdffileinfo.deleteOne(query,function(err,response){
                        if(err){
                             
                             console.log(err);
                             is_deleted = false;
                         }else{
                             
                             is_deleted=true;
                              
                         }
                       
                         
                     });        
                }
                checkdocfiles();
            }
            else{
                console.log("Empty Record Error");
            checkdocfiles();
            }
        
            
        });
    
    function checkdocfiles(){
        docfileinfo.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
                for(var i = 0;i<response.length;i++){
                    filesize = filesize+response[i].filesize;
    
                    var filename = response[i].filename;
                    var file_path ="./public/assets/DocFiles/"+filename; 
                    fs.unlink(file_path, function (err) {
                        if (err) {
                            console.log(err);
                        
                        }else{
                            console.log('File deleted!');
                        
                        }
                        // if no error, file has been deleted successfully
                      
                    }); 
                    docfileinfo.deleteOne(query,function(err,response){
                        if(err){
                             
                             console.log(err);
                             is_deleted = false;
                         }else{
                             
                             is_deleted=true;
                              
                         }
                       
                         
                     });        
                }
                checkphotofiles();
            }
            else{
                console.log("Empty Record Error");
                checkphotofiles();
            }
        
            
        });
    }
    
    function checkphotofiles(){
        photofileinfo.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
                for(var i = 0;i<response.length;i++){
                    filesize = filesize+response[i].filesize;
    
                   var filename = response[i].filename;
                    
                    var file_path ="./public/assets/photos/"+filename; 
                    fs.unlink(file_path, function (err) {
                        if (err) {
                            console.log(err);
                        
                        }else{
                            console.log('File deleted!');
                        
                        }
                        // if no error, file has been deleted successfully
                      
                    }); 
                    photofileinfo.deleteOne(query,function(err,response){
                        if(err){
                             
                             console.log(err);
                             is_deleted = false;
                         }else{
                             
                             is_deleted=true;
                              
                         }
                       
                         
                     });        
                } checkaudiofile();
            }
            else{
                console.log("Empty Record Error");
                checkaudiofile();
            }
        
            
        });
    }
    
    function checkaudiofile(){
        audiofile.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
                for(var i = 0;i<response.length;i++){
                    filesize = filesize+response[i].filesize;
    
                   var filename = response[i].filename;
                    
                    var file_path ="./public/assets/audios"+filename; 
                    fs.unlink(file_path, function (err) {
                        if (err) {
                            console.log(err);
                        
                        }else{
                            console.log('File deleted!');
                        
                        }
                        // if no error, file has been deleted successfully
                      
                    }); 
                    audiofile.deleteOne(query,function(err,response){
                        if(err){
                             
                             console.log(err);
                             is_deleted = false;
                         }else{
                             
                             is_deleted=true;
                              
                         }
                       
                         
                     });        
                }checkvideofile();
            }
            else{
                console.log("Empty Record Error");
                checkvideofile();
            }
        
            
        });
    }
        
    function checkvideofile(){
    
        videoinfo.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
                for(var i = 0;i<response.length;i++){
                    filesize = filesize+response[i].filesize;
    
                   var filename = response[i].filename;
                    
                    var file_path ="./public/assets/Videos/"+filename; 
                    fs.unlink(file_path, function (err) {
                        if (err) {
                            console.log(err);
                        
                        }else{
                            console.log('File deleted!');
                        
                        }
                        // if no error, file has been deleted successfully
                      
                    }); 
                    videoinfo.deleteOne(query,function(err,response){
                        if(err){
                             
                             console.log(err);
                             is_deleted = false;
                         }else{
                             
                             is_deleted=true;
                              
                         }
                       
                         
                     });        
                }checkzipfile();
            }
            else{
                console.log("Empty Record Error");
                checkzipfile();
            }
        
            
        });
    }
    
    function checkzipfile(){
    
        zipfileinfo.find(query,function(err,response){
            
            if(err){
                    
                console.log("Connection Error");
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
                 console.log(response);
                console.log("Record Found");
                for(var i = 0;i<response.length;i++){
                    filesize = filesize+response[i].filesize;
    
                   var filename = response[i].filename;
                    
                    var file_path ="./public/assets/ZipFiles/"+filename; 
                    fs.unlink(file_path, function (err) {
                        if (err) {
                            console.log(err);
                        
                        }else{
                            console.log('File deleted!');
                        
                        }
                        // if no error, file has been deleted successfully
                      
                    }); 
                    zipfileinfo.deleteOne(query,function(err,response){
                        if(err){
                             
                             console.log(err);
                             is_deleted = false;
                         }else{
                             
                             is_deleted=true;
                              
                         }
                       
                         
                     });        
                }
                updatesizeofcontent();
            }
            else{
                console.log("Empty Record Error");
    
                updatesizeofcontent();
            }
        
            
        });
        function updatesizeofcontent(){
           filesize = parseFloat(filesize);
        var query={
            username:username
        }
        totalsizeinfo.find(query,function(err,response){
            if(err){
        
                console.log(err);
               is_deleted = false;
            
            }
            else if(!response){
                
               is_deleted = false;
            }
            else if(response==null){
                
               is_deleted = false;
        
            }
            else if(response.length>=1){
                 console.log(response[0]._id);
                    var size = response[0].totalsize;
                    console.log("Old Size == "+size);
                    size = parseFloat(size);
                    var updatedsize = parseFloat(updatedsize);
                     updatedsize = size-filesize;
                     if(updatedsize<0){
                         updatedsize = 0;
                     }
                        console.log("Updated size  == "+updatedsize);
                    totalsizeinfo.updateOne(
                        {
                        username:username
                    },{
                        $set:{
                            totalsize:updatedsize
                        }
                    }
                    ,(err,response)=>{
                        if(err){
                            
               is_deleted = false;
                        }else{
                            is_deleted = true;
                        }
                    
                                                });
                        
            }
    else{
    } 
            
        });
        }
    }
    
    }
    if(is_deleted){
        res.send({
            status:200,
            Message:"Collection deleted successfully",
            isResponse:true  
        });   
    
    }else{
        res.send({
            status:500,
            Message:"Server Error",
            isResponse:true  
        }); 
    }
});
app.post('/deletefiles',(req,res)=>{

    var username = req.body.username;
    var collecname = req.body.collectionname;

    var query = {
        username:username,
        collectionname:collecname
    }
    pdffileinfo.find(query,function(err,response){
        
        if(err){
                
            console.log("Connection Error");
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
            console.log("Record Found");
            res.send({
            status:200,
            Message:"Collection Found",
            isResponse:true,    
            response:response
        });    

        }
        else{
            console.log("Empty Record Error");
            res.send({
                status:404,
                Message:"No Record Found",
                isResponse:false       
            });
        }

        
});
    
});
app.use('/viewpdfonline',require('../Routes/viewpdf'));
app.use('/uploadpdfroute',require('../Routes/uploadpdfroute'));
app.use('/uploaddocroute',require('../Routes/uploaddocroute'));
app.use('/uploadphotoroute',require('../Routes/uploadphotoroute'));
app.use('/uploadvideoroute',require('../Routes/uploadvideoroute'));
app.use('/uploadaudioroute',require('../Routes/uploadaudioroute'));
app.use('/uploadziproute',require('../Routes/uploadziproute'));
app.use('/uploadreminderroute',require('../Routes/uploadreminderroute'));
app.use('/updateprofile',require('../Routes/updateprofileroute'));
app.use('/deleteroute',require('../Routes/deleteroute'));
app.use('/searchroute',require('../Routes/searchroute'));
app.use('/requestroute',require('../Routes/requestroute'));
app.listen(3000,(err)=>{
   if(err){
       return console.log(err);
   }
    console.log('Starting on port 3000');
});
