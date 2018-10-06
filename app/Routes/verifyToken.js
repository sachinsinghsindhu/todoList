const jwt = require('jsonwebtoken');
const  config = require('../config');

function verifyToken(req, res, next) {
  var token = req.cookies.accessToken;
  console.log(req.cookies);
  //console.log(token);
  if (!token) return res.status(403).send({auth: false,message: 'no token provided'});
  jwt.verify(token, config.secretKey, function(err, decoded) {
    if (err) return res.status(403).send({auth: false, message: 'failed to authenticate toke'});
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;