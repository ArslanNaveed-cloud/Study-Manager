const express = require("express");
const router = express.Router();

var {videoinfo} = require('../server/models/videoUploadModel');
var path = require('path');
router.use(express.static(path.join(__dirname,'public')));

var randomnum = Math.floor(Math.random() * 10000);

const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/assets/Thumbnail/',
    filename: function(req, file, cb) {
      cb(null, (new Date).getTime() + file.originalname);
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
router.post('/uploadthumb',upload.single('file'),(req,res)=>{
         if(!req.file || req.file==null || req.file==''){
                res.send({
                    status:404,
                    message:"File Not Found"
                });
            
            }else{
                res.send({
                    status:200
                });
            }
            
     


});

module.exports =router;