module.exports = function(app, gestorBD) {
	app.post('/api/login/', function(req, res) {
		
		var seguro = app
			.get('crypto')
			.createHmac('sha256', app.get('clave'))
			.update(req.body.password)
			.digest('hex');
		var criterio = {
			email: req.body.email,
			password: seguro
		};

		gestorBD.usersDB.obtenerUsuarios(criterio, function(usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				res.status(401); // Unauthorized
				res.json({
					autenticado: false
				});
			} else {
				var token = app
					.get('jwt')
					.sign({ usuario: criterio.email, tiempo: Date.now() / 1000 }, 'secreto');

				res.status(200);
				res.json({
					autenticado: true,
					token: token
				});
			}
		});
	});

	app.get('/api/ofertas', function(req, res) {
		var token = req.headers['token'] || req.body.token || req.query.token;
		app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
			if (err) {
				res.status(403); // Forbidden
				res.json({
					acceso: false,
					error: 'Token invalido o caducado'
				});
				// También podríamos comprobar que intoToken.usuario existe
				return;
			} else {
				// dejamos correr la petición
				var usuario = infoToken.usuario;
				gestorBD.offersDB.getOffersNotUser(usuario, function(ofertas) {
					if (ofertas == null || ofertas.length == 0) {
						res.status(204);
						res.json({
							err: 'No results'
						});
					} else {

						var datos=[];
						for(var i=0;i<ofertas.length;i++){
							datos.push({
								id:ofertas[i]["_id"],
								title:ofertas[i]["title"],
								description:ofertas[i]["description"],
								price:ofertas[i]["price"],
								user:ofertas[i]["user"]
							})
						}
						res.status(200);
						res.json({ offers: datos });
					}
				});
			}
		});
	});

	app.get('/api/misOfertas', function(req, res) {
		var token = req.headers['token'] || req.body.token || req.query.token;
		app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
			if (err) {
				res.status(403); // Forbidden
				res.json({
					acceso: false,
					error: 'Token invalido o caducado'
				});
				// También podríamos comprobar que intoToken.usuario existe
				return;
			} else {
				// dejamos correr la petición
				var usuario = infoToken.usuario;
				criterio={
					user:usuario
				}
				gestorBD.offersDB.getUserOffers(criterio, function(ofertas) {
					if (ofertas == null || ofertas.length == 0) {
						res.status(204);
						res.json({
							err: 'No results'
						});
					} else {

						var datos=[];
						for(var i=0;i<ofertas.length;i++){
							datos.push({
								id:ofertas[i]["_id"],
								title:ofertas[i]["title"],
								description:ofertas[i]["description"],
								price:ofertas[i]["price"],
								user:ofertas[i]["user"]
							})
						}
						res.status(200);
						res.json({ offers: datos });
					}
				});
			}
		});
	});

	app.post('/api/mensajes/nuevo', function(req, res) {
		var token = req.headers['token'] || req.body.token || req.query.token;
		app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
			if (err) {
				res.status(403); // Forbidden
				res.json({
					acceso: false,
					error: 'Token invalido o caducado'
				});
				// También podríamos comprobar que intoToken.usuario existe
				return;
			} else {
				var idOferta = req.body.offer;
				var usuario = infoToken.usuario;
				//	var usuario = req.body.usuario;
				var date = new Date().toISOString();
				var msg = req.body.msg;

				var idConver = req.body.idConver;
				//console.log(idOferta);

				gestorBD.offersDB.findOffer(idOferta, function(oferta) {
					if (oferta == null || oferta.length == 0) {
						res.status(404); // not found
						res.json({
							err: 'No such offer'
						});
					} else {
						var offer = oferta[0];

						var chats = offer.chats;
						//console.log(idConver)
						if (idConver != undefined) {
							//no es una nueva conversacion
							//	console
							chats[idConver].push({
								autor: usuario,
								msg: msg,
								date: date,
								leido: false
							});
						} else {
							//nueva conversacion
							if (chats == undefined) {
								chats = {};
							}
							chats[usuario] = [];
							chats[usuario].push({
								autor: usuario,
								msg: msg,
								date: date,
								leido: false
							});
						}

						gestorBD.offersDB.updateMessages(idOferta, chats, function(id) {
							res.status(201);
							res.json({ sent: true });
						});
					}
				});
			}
		});
	});

	app.get('/api/mensajes/ver', function(req, res) {
		
		var token = req.headers['token'] || req.body.token || req.query.token;
		app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
			if (err) {
				res.status(403); // Forbidden
				res.json({
					acceso: false,
					error: 'Token invalido o caducado'
				});
				// También podríamos comprobar que intoToken.usuario existe
				return;
			} else {
				var idOferta = req.query.offer;
				var usuario = infoToken.usuario;
				gestorBD.offersDB.findOffer(idOferta, function(oferta) {
					if (oferta == null || oferta.length == 0) {
						res.status(404); // not found
						res.json({
							err: 'No such offer'
						});
					} else {
						oferta = oferta[0];

						if (oferta.chats == undefined) {
							res.status(404);
							res.json({
								err: 'no chats in this offer'
							});
							return;
						}
						if (oferta.user == usuario) {
							//usuario es el propietario
							res.status(200);
							res.json({
								chats: oferta.chats
							});
							return;
						} else {
							//el usuario no es el propietario, puede tener una conversacion o no
							if (oferta.chats[usuario] == undefined) {
								//no existe la conversacion con el usuario{
								res.status(404);
								res.json({
									err: 'You have no chats in the offer'
								});
								return;
							} else {
								var tmp = {};
								tmp[usuario] = oferta.chats[usuario];

								res.status(200);
								res.json({
									chats: tmp
								});
							}
						}
					}
				});
			}
		});
	});
};
