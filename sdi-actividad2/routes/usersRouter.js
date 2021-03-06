module.exports = function (app, swig, gestorBD) {

    app.get("/logout", function (req, res) {
        app.get("logger").debug("Logout")
        logUser(null, null, req,res);
        setMoney(null,res);
        setRole(null,res);
        res.redirect("/login");

    })
    app.get('/register', function (req, res) {
        app.get("logger").debug("Registro")
        var respuesta = swig.renderFile('views/registerView.html', {});
        res.send(respuesta);
    });


    app.post('/registerUser', function (req, res) {
        app.get("logger").debug("Registrando usuario")
        var password = req.body.password;
        var confirmPassword = req.body.passwordConfirm;

        if (password != confirmPassword) {
            res.redirect('/register?mensaje=Passwords do not match');
            return;
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
            rol: "default",
        };
        var usuarioCheck = {
            email: usuario.email
        };
        gestorBD.usersDB.obtenerUsuarios(usuarioCheck, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                //No user with that email
                gestorBD.usersDB.insertarUsuario(usuario, function (id) {
                    if (id == null) {
                        res.redirect('/register?mensaje=Error al registrar usuario');
                    } else {
                        //logear al usuario
                        logUser(usuario.email, usuario.rol, req,res);
                        
                        res.redirect('/user/offers'); 
                       
                    }
                });
            } else {
                res.redirect('/register?mensaje=Email incorrecto');
            }
        });
    });


    function logUser(email, rol, req, res) {
        req.session.usuario = email;
        req.session.rol = rol;
        res.cookie("user", email==null?"":email);
        
    }

    function setMoney(money,res){
        res.cookie("money",money);
    }
    function setRole(role,res){
        res.cookie("role",role);
    }

    app.get("/login", function (req, res) {
        app.get("logger").debug("Login")
        var respuesta = swig.renderFile('views/loginView.html', {});
        res.send(respuesta);
    })

    app.post("/login", function (req, res) {
        app.get("logger").debug("Logeando usuario")
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
                logUser(usuarios[0].email, usuarios[0].rol, req,res);
                setMoney(usuarios[0].money,res);
                setRole(usuarios[0].rol,res);
                res.redirect("/user/offers");
            }
        });
    })
};
