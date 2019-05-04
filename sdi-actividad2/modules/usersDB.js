module.exports = {
	mongo: null,
	app: null,
	init: function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
		console.log('Usersdb initialised');
	},
	insertarUsuario: function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	updateUser: function(criterio, user, functionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				let collection = db.collection('usuarios');
				collection.update(criterio, user, function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
						functionCallback(result);
					}
				});
			}
		});
	},
	obtenerUsuarios: function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(function(err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close();
				});
			}
		});
	},
	borrarUsuarios: function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.remove(criterio, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	isAdmin: function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				var criterio = { email: usuario };
				collection.find(criterio).toArray(function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						// console.log(result[0])
						funcionCallback(result[0].rol == 'admin');
					}
					db.close();
				});
			}
		});
	},
	dummyData: function(usuarios, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(false);
			} else {
				var collection = db.collection('usuarios');
				
				collection.insertMany(usuarios,function(err, result) {
					if (err) {
						funcionCallback(false);
					} else {
						funcionCallback(true);
					}
					db.close();
				});
			}
		});
    }
};
