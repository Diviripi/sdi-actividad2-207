module.exports = function (app, swig, gestorBD) {
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

    app.get('offers/removeOffer/:id', function (req, res) {
        let criterio = {_id: gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.offersDB.removeOffer(criterio, function (id) {
            if (id == null) {
                res.send('error while removing offer');
            } else {
                res.send(`Canción ${id} eliminada correctamente`);
            }
        })

    })

    app.get('/user/offers', function (req, res) {
        let user = req.session.usuario;
        if (user == null) {
            res.redirect('/login');
        } else {
            let criterio = {user: user};
            let ofertas = gestorBD.offersDB.getOffers(criterio, function (ofertas) {
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
}
