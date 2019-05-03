module.exports = {
	mongo: null,
    app: null,
    usersDB:null,
    offersDB:null,
	init: function(app, mongo) {
		this.mongo = mongo;
        this.app = app;
        //registrar aqui las bases de datos para usuarios y demas
        this.usersDB = require('./usersDB.js');
        this.usersDB.init(this.app,this.mongo);
        this.offersDB= require('./offersDB.js');
        this.offersDB.init(this.app,this.mongo);

    }
    ,borrarTodo:function(funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(false);
            } else {
                var users = db.collection('usuarios');
                
                users.remove();
                var offers=db.collection('offers');

                offers.remove();
                funcionCallback(true);
                
            }
        });
    }
};
