var mongodb = require('mongodb').MongoClient
var format = require('util').format
var config = require("../config/").database

module.exports = function(callback){
	mongodb.connect("mongodb://"+config.host+":"+config.port+"/"+config.collection, function (err, db) {
		if (err) {
			throw err
		} else {
			callback(db)
		}
	})
}
