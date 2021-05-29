const express = require("express");
const router = express.Router();
var path = require('path');  
var mime = require('mime');
var fs = require('fs');
router.get('/downloadpdf',(req,res)=>{
  res.download('./public/assets/PDfFiles/158324915739803052019_BS_Program.pdf');
});
module.exports=
    router
