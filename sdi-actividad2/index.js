//App creation
var express = require('express');

var app = express();
//app.use(express.bodyParser());
var http= require('http');
var fs = require('fs');
var rest = require('request');
app.set('rest',rest);
var log4js =require('log4js');
var logger= log4js.getLogger();
logger.level="debug"
app.set("logger",logger);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
	// Debemos especificar todas las headers que se aceptan. Content-Type , token
	next();
   });
//session
var expressSession = require('express-session');
app.use(
	expressSession({
		secret: 'abcdefg',
		resave: true,
		saveUninitialized: true
	})
);
var crypto = require('crypto');
var mongo = require('mongodb');
//mongodb
var gestorBD = require('./modules/gestorBD.js');
gestorBD.init(app, mongo);
var swig = require('swig');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

//aqui los routers


var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
	console.log('routerUsuarioSession');
	console.log(  req.session.usuario)
	if ( req.session.usuario) {
		// dejamos correr la petición
		next();
	} else {
		console.log('va a : ' + req.session.destino);
		res.redirect('/login');
	}
});
//Aplicar routerUsuarioSession
app.use('/users/*', routerUsuarioSession);
app.use('/store', routerUsuarioSession);
app.use('/offers/*', routerUsuarioSession);
app.use('/user/*', routerUsuarioSession);



var routerUsuarioAdmin = express.Router();
routerUsuarioAdmin.use(function(req, res, next) {
	
	gestorBD.usersDB.isAdmin(req.session.usuario,function(isAdmin){
		console.log(isAdmin)
		if(isAdmin){
			next();
			
		}else{
			res.send("Unauthorized");
		}
	})
	
});
//Aplicar routerUsuarioAdmin
app.use('/users/*', routerUsuarioAdmin);



var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
	// obtener el token, vía headers (opcionalmente GET y/o POST).
	var token = req.headers['token'] || req.body.token || req.query.token;
	if (token != null) {
		// verificar el token
		jwt.verify(token, 'secreto', function(err, infoToken) {
			if (err || Date.now() / 1000 - infoToken.tiempo > 240) {
				res.status(403); // Forbidden
				res.json({
					acceso: false,
					error: 'Token invalido o caducado'
				});
				// También podríamos comprobar que intoToken.usuario existe
				return;
			} else {
				// dejamos correr la petición
				res.usuario = infoToken.usuario;
				next();
			}
		});
	} else {
		res.status(403); // Forbidden
		res.json({
			acceso: false,
			mensaje: 'No hay Token'
		});
	}
});
// Aplicar routerUsuarioToken
app.use('/api/ofertas', routerUsuarioToken);
//app.use('/api/mensajes', routerUsuarioToken);



//variables
app.set('port', 8081);
app.set('clave', 'abcdefg');
app.set('crypto', crypto);
app.set(
	'db',
	'mongodb://admin:admin@mywallapop-shard-00-00-aakkl.mongodb.net:27017,mywallapop-shard-00-01-aakkl.mongodb.net:27017,mywallapop-shard-00-02-aakkl.mongodb.net:27017/test?ssl=true&replicaSet=MyWallapop-shard-0&authSource=admin&retryWrites=true'
);
app.use(express.static('public'));

//controllers

require('./routes/usersRouter.js')(app, swig, gestorBD);
require('./routes/adminRouter.js')(app, swig, gestorBD);
require('./routes/offersRouter.js')(app,swig,gestorBD);
require('./routes/restAPI')(app, gestorBD);


//First test purposes

app.get('/', function(req, res) {
	res.redirect('/login');
});
app.use(function(err, req, res, next) {
	console.log('Error producido: ' + err); //we log the error in our db

	if (!res.headersSent) {
		res.status(400);
		res.send('Recurso no disponible');
	}
});

// lanzar el servidor
app.listen(app.get('port'),function(){
	console.log("Servidor activo")
});
