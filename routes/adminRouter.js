module.exports = function(app, swig, gestorBD) {
	app.get('/users/list', function(req, res) {
		gestorBD.usersDB.obtenerUsuarios({}, function(usuarios) {
			users = [];
			for (var i = 0; i < usuarios.length; i++) {
				var user = {
					email: usuarios[i].email,
					name: usuarios[i].name,
					surname: usuarios[i].surname,
					rol: usuarios[i].rol
				};

				//TODO: no se debe poder borrar el usuario logeado
				users.push(user);
			}
			var respuesta = swig.renderFile('views/listUsersView.html', users);
			res.send(respuesta);
		});
	});

	app.post('/users/deleteMultiple', function(req, res) {
		var emails = req.body.id;
		if (emails) {
			var list = [];
			for (var i = 0; i < emails.length; i++) {
				list.push({ email: emails[i] });
			}

			var criterio = { $or: list };
			gestorBD.usersDB.borrarUsuarios(criterio, function(users) {
				//console.log(users.result.n);
				res.redirect('/users/list');
			});
		}
		res.redirect('list');
	});
};
