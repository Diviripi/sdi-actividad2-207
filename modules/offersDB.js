module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
        console.log('Usersdb initialised');
    },
    addOffer: function (offer, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);

            } else {
                var collection = db.collection('offers');
                collection.insert(offer, function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result.ops[0]._id);
                    }
                    db.close();
                })
            }
        })
    },
    removeOffer: function (criterio, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('offers');
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
                    }
                })
            }
        })
    }
}
