const express = require("express");
const db = require("../Models");

 const User = db.users;


 const saveUser = async (req, res, next) => {

 try {
   const username = await User.findOne({
     where: {
       userName: req.body.userName,
     },
   });
   if (username) {
     return res.json(409).send("Username is used, please try another one.");
   }


   const emailcheck = await User.findOne({
     where: {
       email: req.body.email,
     },
   });

   if (emailcheck) {
     return res.json(409).send("Email failed");
   }

   next();
 } catch (error) {
   console.log(error);
 }
};

 module.exports = {
 saveUser,
};
