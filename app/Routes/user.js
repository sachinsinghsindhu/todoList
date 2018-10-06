const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const check = require('express-validator/check');
const config = require('../config');
const userRoutes = express.Router();

var user = require('../models/user');
var verifyToken = require('./verifyToken');


userRoutes.post('/register',(req, res) => {
  console.log(req.body.email,req.body.password);
  const hashedPass = bcrypt.hashSync(req.body.password, 8);
  user.create({
    email: req.body.email,
    password: hashedPass,
    todos: [],
  },(err, user) => {
    if (err) return res.status(500).send("There was a problem registering the user.");
    const token  = jwt.sign({id: user._id}, config.secretKey, {expiresIn: 86400});
    res.cookie('accessToken', token, {maxAge: 86400, httpOnly: true});
    res.status(200).send({email: user.email});
  });
});

userRoutes.post('/login',(req, res) => {
  user.findOne({email: req.body.email}, (err, user) => {
    if (err) return res.status(500).send("there was an internal error");
    const hashedPass = bcrypt.hashSync(req.body.password, 8);
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secretKey, {
      expiresIn: 86400,
    });
    res.cookie('accessToken', token, {maxAge: 86400, httpOnly: true});
    // console.log(req.cookies)
    // console.log(res.cookies);
    // console.log(res.cookie);
    console.log('cookie set');
    res.status(200).send({email: user.email});
  });
});

userRoutes.get('/logout', (req, res) => {
  res.cookie('accessToken', null, {maxAge: 0, httpOnly: true});
  res.status(200).send({auth: false, token: null});
});

userRoutes.get('/protected',verifyToken, (req,res) => {
  res.status(200).send({auth: true, message: 'access protected api'});
});

module.exports = userRoutes;