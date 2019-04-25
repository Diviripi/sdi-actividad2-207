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

	app.post('/api/ofertas',function(req,res){
		var token = req.headers['token'] || req.body.token || req.query.token;
		app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
			if (err ) {
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
				gestorBD.offersDB.getOffersNotUser(usuario,function(ofertas){
					if (ofertas == null || ofertas.length == 0) {
					
						res.status(204); // Unauthorized
						res.json({
							err: "No results"
						});
					} else {
					
						res.status(200);
						res.json({offers:ofertas});
					}
				})
			}
		})


	});



}