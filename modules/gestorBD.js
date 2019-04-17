module.exports = {
	mongo: null,
    app: null,
    usersDB:null,
	init: function(app, mongo) {
		this.mongo = mongo;
        this.app = app;
        //registrar aqui las bases de datos para usuarios y demas
        this.usersDB = require('./usersDB.js');
        this.usersDB.init(this.app,this.mongo);

	}
};
