module.exports = function(app, swig, gestorBD) {
	app.get('/register', function(req, res) {
		var respuesta = swig.renderFile('views/registerView.html', {});
		res.send(respuesta);
	});


	app.post('/registerUser', function(req, res) {
		var password = req.body.password;
		var confirmPassword = req.body.passwordConfirm;

		if (password != confirmPassword) {
			res.redirect('/register?mensaje=Passwords do not match');
		}

		var seguro = app
			.get('crypto')
			.createHmac('sha256', app.get('clave'))
			.update(req.body.password)
			.digest('hex');
		var usuario = {
			email: req.body.email,
			name: req.body.name,
			surname: req.body.surname,
			password: seguro,
            money: 100,
            rol:"default",
		};
		var usuarioCheck = {
			email: usuario.email
		};
		gestorBD.usersDB.obtenerUsuarios(usuarioCheck, function(usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				//No user with that email
				gestorBD.usersDB.insertarUsuario(usuario, function(id) {
					if (id == null) {
						res.redirect('/register?mensaje=Error al registrar usuario');
					} else {
                        //logear al usuario
                        logUser(usuario.email,usuario.rol,req);
						res.redirect('/'); //TODO: por el momento va eso
						//TODO: incluir en la vista el dinero actual
					}
				});
			} else {
				res.redirect('/register?mensaje=Email incorrecto');
			}
		});
    });
    
    
	function logUser(email,rol, req) {
        req.session.usuario = email;
        req.session.rol=rol;
    }
    
    app.get("/login",function(req,res){
        var respuesta = swig.renderFile('views/loginView.html', {});
		res.send(respuesta);
    })

    app.post("/login",function(req,res){
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
			.update(req.body.password).digest('hex');
		var criterio = {
			email: req.body.email,
			password: seguro
		}
		gestorBD.usersDB.obtenerUsuarios(criterio, function (usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				req.session.usuario = null;
				res.redirect("/login" +
					"?mensaje=Email o password incorrecto" +
					"&tipoMensaje=alert-danger ");
			} else {
                logUser(usuarios[0].email,usuarios[0].rol,req);

				res.redirect("/");

			}
		});
    })
};
