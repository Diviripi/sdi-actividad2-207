//App creation
var express = require('express');
var app = express();
//de momento es http no https
var http = require('http');
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
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

//aqui los routers

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

//mongodb
var gestorBD = require('./modules/gestorBD.js');
gestorBD.init(app, mongo);

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

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(app.get('port'), () => console.log('Server listening on port ' + app.get('port')));
