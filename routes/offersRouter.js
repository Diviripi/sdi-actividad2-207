module.exports = function(app, swig, gestorBD) {
    app.get("/offers/addOffer",function(req,res){
        var respuesta = swig.renderFile('views/newOffer.html', {});
		res.send(respuesta);
    })
    app.post("/offers/addOffer",function(req,res){
        var title=req.body.title;
        var description=req.body.description;
        var price=parseFloat(req.body.price);
        var date= new Date().toLocaleDateString();
        var highlighted=req.body.highlighted=='on';
        var user=req.session.usuario;

        var offer={
            title:title,
            description:description,
            price:price,
            date:date,
            highlighted:highlighted,
            user:user


        }

        gestorBD.offersDB.addOffer(offer,function(id){
            if(id==null){
                res.redirect("/offers/addOffer");
            }else{
                releaseEvents.redirect("/");
            }
        })
        console.log(offer);
        res.redirect("/addOffer");
    })
}