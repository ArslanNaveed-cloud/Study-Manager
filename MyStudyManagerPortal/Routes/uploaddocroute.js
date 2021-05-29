const express = require("express");
const router = express.Router();

var {docfileinfo} = require('../server/models/DocFileUploadModel');
var path = require('path');
router.use(express.static(path.join(__dirname,'public')));

var randomnum = Math.floor(Math.random() * 10000);

const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/assets/DocFiles/',
    filename: function(req, file, cb) {
      cb(null, randomnum + file.originalname);
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
router.post('/uploaddocfile',upload.single('file'),(req,res)=>{
         if(!req.file || req.file==null || req.file==''){
                res.send({
                    status:404,
                    message:"File Not Found"
                });
            
            }else{
                console.log(req.file.originalname);
                var randnumb = Math.floor(Math.random() * 10000);
                var fileTitle = req.body.fileTitle;
                var username = req.body.username;
                var filename = randomnum+req.file.originalname;
                var collectionname = req.body.collectionname;
                var filesize = req.body.filesize;
                console.log(collectionname);
                var query ={
                    username:username,
                    fileTitle:fileTitle
                }
                docfileinfo.find(query,function(err,response){
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
            
                    }else{
                        var FileData  =new docfileinfo(
                            {
                            fileTitle:fileTitle,
                            username:username,
                            filename:filename,
                            collectionname:collectionname,
                            filesize:filesize
                        }
                        );
                        FileData.save().then((result) => {
                            res.send({
                                status:200,
                                message:"Data is saved in the Database/File is Uploaded"
            
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
                
            }
            
     


});

module.exports =router;