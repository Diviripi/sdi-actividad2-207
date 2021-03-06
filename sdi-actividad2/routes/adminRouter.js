module.exports = function(app, swig, gestorBD) {
	app.get('/users/list', function(req, res) {
		app.get("logger").debug("Ver usuarios")
		gestorBD.usersDB.obtenerUsuarios({}, function(usuarios) {
			users = [];
			for (var i = 0; i < usuarios.length; i++) {
				var user = {
					email: usuarios[i].email,
					name: usuarios[i].name,
					surname: usuarios[i].surname,
					rol: usuarios[i].rol
				};

			
				users.push(user);
			}
			var respuesta = swig.renderFile('views/listUsersView.html', users);
			res.send(respuesta);
		});
	});

	app.post('/users/deleteMultiple', function(req, res) {
		app.get("logger").debug("Borrado de usuarios")
		var emails = req.body.id;
		if (emails) {
			var list = [];
			if (Array.isArray(emails)) {
				for (var i = 0; i < emails.length; i++) {
					list.push({ email: emails[i] });
				}
			} else {
				list.push({ email: emails });
			}
			//console.log(list);

			var criterio = { $or: list };
			gestorBD.usersDB.borrarUsuarios(criterio, function(users) {
				//console.log(users.result.n);

				res.redirect('/users/list');
				return;
			});
		} else {
			res.redirect('list');
		}
	});

	app.get('/database/reset', function(req, res) {
		app.get("logger").debug("Reseteo de la base de datos")
		//crear los usuarios
		var users = [];
		var password = 'user';
		var seguro = app.get('crypto').createHmac('sha256', app.get('clave')).update(password).digest('hex');
		for (var i = 0; i < 5; i++) {
			var newUser = {
				email: 'user' + i + '@email.com',
				name: 'user' + i,
				surname: 'surname' + i,
				password: seguro,
				money: 100,
				rol: 'default'
			};
			users.push(newUser);
		}

		var passwordAdmin = 'admin';

		var seguro = app
			.get('crypto')
			.createHmac('sha256', app.get('clave'))
			.update(passwordAdmin)
			.digest('hex');
		var admin = {
			email: 'admin@admin.com',
			name: 'Admin',
			surname: 'Admin',
			password: seguro,
			money: 100,
			rol: 'admin'
		};
		users.push(admin);

		var offers = [];
		for (var i = 0; i < 5; i++) {
			//usuarios

			for (var j = 0; j < 3; j++) {
				//ofertas
				var buyerF = i == 4 ? users[0].email : users[i + 1].email;
				var userF = users[i].email;
				var boughtF = j < 2;
				if (i == 4) {
					boughtF = false;
				}
				var priceF = 40 + 40 * j;
				if (j == 1) {
					priceF = 100;
				}
				var chatF={};
				chatF[buyerF.split("@")[0]]=[
					{
						autor: buyerF,
						msg: 'Mensaje 1',
						date: new Date().toISOString(),
						leido: false
					},
					{
						autor: buyerF,
						msg: 'Mensaje 2',
						date: new Date().toISOString(),
						leido: false
					},
					{
						autor: userF,
						msg: 'Mensaje 3',
						date: new Date().toISOString(),
						leido: false
					},
					{
						autor: userF,
						msg: 'Mensaje 4',
						date: new Date().toISOString(),
						leido: false
					}

				]
				var newOffer = {
					title: 'Oferta' + j + ',' + i + '',
					description: 'Descripcion oferta[' + j + '] usuario[' + i + ']',
					price: priceF,
					date: new Date().toLocaleDateString(),
					highlighted: j == 0,
					user: userF,
					bought: boughtF,
					buyer: boughtF ? buyerF : '',
					chats: chatF
				};

				offers.push(newOffer);
			}
		}

		//borrar la base de datos
		var proceso = '';
		gestorBD.borrarTodo(function(allFine) {
			if (allFine) {
				proceso += 'Base de datos borrada';
				//insertar usuarios a la base de datos
				gestorBD.usersDB.dummyData(users, function(allFine) {
					if (allFine) {
						proceso += '\nUsuarios insertados';
						//insertar ofertas
						gestorBD.offersDB.dummyData(offers, function(allFine) {
							if (allFine) {
								proceso += '\nOfertas insertadas';
								proceso += '\nTodo competado';
								res.send(proceso);
								return;
							} else {
								res.send(proceso + '\n!!!!!error en el reseteo');
								return;
							}
						});
					} else {
						res.send(proceso + '\n!!!!!error en el reseteo');
						return;
					}
				});
			} else {
				res.send(proceso + '\n!!!!!error en el reseteo');
				return;
			}
		});
	});
};
