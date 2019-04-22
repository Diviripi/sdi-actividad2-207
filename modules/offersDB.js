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
    },
    getUserOffers: function (criterio, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                var collection = db.collection('offers');
                collection.find(criterio).toArray(function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
                    }
                    db.close();
                })
            }
        })
    },
    getOffersPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('offers');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 4).limit(4)
                        .toArray(function (err, offers) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(offers, count);
                            }
                            db.close();
                        });
                });
            }
        });
    }
}
