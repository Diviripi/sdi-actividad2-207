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

//aqui los routers

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


//First test purposes

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(app.get('port'), () => console.log('Server listening on port ' + app.get('port')));
