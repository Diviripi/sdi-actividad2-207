module.exports = function (app, swig, gestorBD) {

    app.get('/store', function (req, res) {
        let criterio = {};
        if (req.query.busqueda != null) {
            criterio = {
                title: {$regex: new RegExp(req.query.busqueda, 'i')}
            };
        }
        let pg = parseInt(req.query.pg); // Es String !!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        gestorBD.offersDB.getOffersPg(criterio, req.session.usuario, pg, function (offers, total) {
            if (offers == null) {
                res.send("Error when showing offers");
            } else {
                console.log(offers);
                let lastPg = total / 4;
                if (total % 4 > 0) { // Sobran decimales
                    lastPg = lastPg + 1;
                }
                let pages = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= lastPg) {
                        pages.push(i);
                    }
                }
                let respuesta = swig.renderFile('views/bStore.html',
                    {
                        ofertas: offers,
                        paginas: pages,
                        actual: pg
                    });
                res.send(respuesta);
            }
        });
    });
    app.get("/offers/addOffer", function (req, res) {
        var respuesta = swig.renderFile('views/newOffer.html', {});
        res.send(respuesta);
    })
    app.post("/offers/addOffer", function (req, res) {
        var title = req.body.title;
        var description = req.body.description;
        var price = parseFloat(req.body.price);
        var date = new Date().toLocaleDateString();
        var highlighted = req.body.highlighted == 'on';
        var user = req.session.usuario;

        var offer = {
            title: title,
            description: description,
            price: price,
            date: date,
            highlighted: highlighted,
            user: user
        }

        gestorBD.offersDB.addOffer(offer, function (id) {
            if (id == null) {
                res.redirect("/offers/addOffer");
            } else {
                res.redirect("/user/offers");
            }
        })
        console.log(offer);
    })

    app.get('/offers/removeOffer/:id', function (req, res) {
        let criterio = {_id: gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.offersDB.removeOffer(criterio, function (id) {
            if (id == null) {
                res.send('error while removing');
            } else {
                res.redirect('/user/offers');
            }
        })
    })

    app.get('/offers/buyOffer/:id', function (req, res) {
        let criterioOferta = {_id: gestorBD.mongo.ObjectID(req.params.id)};
        let criterioUsuario = {email: req.session.usuario};
        gestorBD.usersDB.obtenerUsuarios(criterioUsuario, function (usuarios) {
            if (usuarios == null) {
                res.send('Error wile buying');
            } else {
                gestorBD.offersDB.getOffer(criterioOferta, function (ofertas) {
                    if (ofertas == null) {
                        res.send('Error while buying');
                    } else {
                        if (usuarios[0].money >= ofertas[0].price) {
                            ofertas[0].bought = true;
                            ofertas[0].buyer = usuarios[0].email;
                            usuarios[0].money -= ofertas[0].price;
                            gestorBD.offersDB.updateOffer(criterioOferta, ofertas[0], function (id) {
                                if (id == null) {
                                    res.send('Error while buying');
                                } else {
                                    console.log('Offer updated correctly');
                                    console.log(ofertas[0]);
                                }
                            });
                            gestorBD.usersDB.updateUser(criterioUsuario, usuarios[0], function (id) {
                                if (id == null) {
                                    res.send('Error while buying');
                                } else {
                                    console.log('User updated correctly');
                                    console.log(usuarios[0]);
                                }
                            });
                            res.redirect('/store');
                        } else {
                            res.redirect('/store?mensaje=No tienes dinero suficiente para comprar esta oferta&tipoMensaje=alert-danger');
                        }
                    }
                })
            }
        });
    })

    app.get('/user/offers', function (req, res) {
        let user = req.session.usuario;
        if (user == null) {
            res.redirect('/login');
        } else {
            let criterio = {user: user};
            gestorBD.offersDB.getUserOffers(criterio, function (ofertas) {
                if (ofertas == null) {
                    res.send('Error al listar');
                } else {
                    let respuesta = swig.renderFile('views/bOffers.html', {
                        ofertas: ofertas
                    });
                    res.send(respuesta);
                }
            })
        }
    })

    app.get("/user/offers/bought",function(req,res){
        console.log(req.session.usuario)
        gestorBD.offersDB.getBoughtOffers(req.session.usuario,function(ofertas){
            let respuesta= swig.renderFile('views/boughtOffersView.html',{
                ofertas:ofertas
            });
            res.send(respuesta)
        })
    })
}
