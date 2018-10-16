const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const check = require('express-validator/check');
const config = require('../config');
const nodemailer = require('nodemailer');
const resetPwdRoute = express.Router();

var user = require('../models/user');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'your user name',
         pass: 'your password'
     }
 });


// request email for password reset link
resetPwdRoute.post('/forgotPwd', (req, res) => {
  //console.log(req.body.email);
  user.findOne({email: req.body.email}, (err, result) => {
    if (err) res.status(500).send({msg: 'internal error'});
    if (!result) {
      res.send({msg: 'no such user exist'});
    }

    var token = jwt.sign({ email: req.body.email }, config.secretKey, {
      expiresIn: 86400,
    });

    const mailOptions = {
      from: 'sender@email.com', // sender address
      to: req.body.email, // list of receivers
      subject: 'Reset password', // Subject line
      text: 'click on link below',
      html: `<a><b>http:localhost:4000/resetPwd?token=${token}</b></a>`// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err) {
        //console.log(err);
        return res.status(500).send({msg: 'internal error'});
      }
      //console.log('info ',info);
      res.status(200);
   });
  });
});

// send reset password form after this validation
resetPwdRoute.get('/resetPwd', (req, res) => {
  //console.log('resetPwd');
  //console.log(req.query.token);
  const token = req.query.token;
  if (!token) return res.sendStatus(403);
  jwt.verify(token, config.secretKey, (err, decoded) => {
    //console.log(decoded.email)
    if (err || !decoded.email) return  res.send({msg: 'invalid token'});
    user.findOne({email: decoded.email}, (err, result) => {
      if (err || !result) return res.send({msg: 'user not found'});
    });
    // used in production
    //res.cookie('resetPwdToken', token ,{maxAge: 86400, httpOnly: true});

    // used in testing
    res.status(200).send({token: token});
  });
});

//reset password
resetPwdRoute.post('/resetPwd', (req, res) => {
  //used in producton
  //const token = req.cookies.resetPwdToken;

  //used in testing
  const token = req.body.token;
  //console.log(token);

  if (!token) return res.sendStatus(403);
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err || !decoded.email) return res.send({msg: 'invalid token'});
    const hashedPass = bcrypt.hashSync(req.body.password, 8);
    user.findOne({email: decoded.email}, (err, result) => {
      if (err || !result) return res.send({msg: 'user not found'});
      result.password = hashedPass;
      result.save((err, updatedResult) => {
        if (err) return res.send({msg: 'internal error'});
        res.send({msg: 'password changed sucessfully'});
      });
    })
  });
})

module.exports = resetPwdRoute;