var express = require('express')

var morgan = require('morgan')

var path = require('path')

var cors = require('cors');

var app = express()

var mongoose = require('mongoose')

var bodyParser = require('body-parser')

var cookieParser = require('cookie-parser')

// Require configuration file defined in app/Config.js
var config = require('./app/Config')




// Connect to database
mongoose.connect(config.DB,{ useNewUrlParser: true, useCreateIndex: true, })

// Sends static files  from the public path directory
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/dist')));

// Use morgan to log request in dev mode
app.use(morgan('dev'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

var port = process.env.PORT || config.APP_PORT

app.listen(port) // Listen on port defined in config file

console.log('App listening on port ' + port)

var resetPwdRoute = require('./app/Routes/resetPassword');
app.use(resetPwdRoute);
var userRoutes = require('./app/Routes/user');
app.use(userRoutes);

var todoRoutes = require('./app/Routes/todo')

//  Use routes defined in Route.js and prefix it with api
app.use('/api', todoRoutes)

// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)

//     // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

//     // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

//     // Pass to next layer of middleware
//   next()
// })
// Server index.html page when request to the root is made
// app.get('/', function (req, res, next) {
//   res.sendfile('./public/dist/index.html')
// })