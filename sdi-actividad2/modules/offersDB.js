module.exports = {
	mongo: null,
	app: null,
	init: function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
		console.log('Usersdb initialised');
	},
	addOffer: function(offer, functionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				var collection = db.collection('offers');
				collection.insert(offer, function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
						functionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	findOffer:function(id,functionCallback){
		var dbOffer=this;
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				var collection = db.collection('offers');
				let criterio = {_id: dbOffer.mongo.ObjectID(id)};
				collection.find(criterio).toArray(function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
					
						functionCallback(result);
					}
					db.close();
				});
			}
		});
	},

	removeOffer: function(criterio, functionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				let collection = db.collection('offers');
				collection.remove(criterio, function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
						functionCallback(result);
					}
				});
			}
		});
	},
	getUserOffers: function(criterio, functionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				var collection = db.collection('offers');
				collection.find(criterio).toArray(function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
						functionCallback(result);
					}
					db.close();
				});
			}
		});
	},

	getOffersNotUser:function(user,functionCallback){
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				var collection = db.collection('offers');
				var criterio={'user': {$ne : user}}
				collection.find(criterio).toArray(function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
						functionCallback(result);
					}
					db.close();
				});
			}
		});
	},
	getOffersPg: function(criterio, usuario,pg, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				let collection = db.collection('offers');
				collection.count(function(err, count) {
					collection
						.find(criterio)
						.skip((pg - 1) * 4)
						.limit(4)
						.toArray(function(err, offers) {
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
	},
	getBoughtOffers(usuario, functionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				let collection = db.collection('offers');
				var criterio = { $and:[{buyer: usuario },{bought:true}]};
				
				collection.find(criterio).toArray(function(err, result) {
					if (err) {
						functionCallback(null);
					} else {
                        //console.log(result);
                        functionCallback(result);
                    }
                    db.close();
				});
			}
		});
	},
    updateOffer: function (criterio, offer, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('offers');
                collection.update(criterio, offer, function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
                    }
                })
            }
        })
    },
    getOffer: function (criterio, functionCallback) {
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
	updateMessages:function(idOferta,chats,functionCallback){
		var dbOffer=this;
		this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
				var collection = db.collection('offers');
				let criterio = {_id: dbOffer.mongo.ObjectID(idOferta)};
				var chat={
					chats:chats
				}
                collection.update(criterio,{$set: chat},function (err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
                    }
				})
				db.close();
			}
		})
		
	} ,   
	dummyData: function(offers, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(false);
			} else {
				var collection = db.collection('offers');
				
				collection.insertMany(offers,function(err, result) {
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
