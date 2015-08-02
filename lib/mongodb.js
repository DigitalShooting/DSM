var mongodb = require('mongodb').MongoClient
var format = require('util').format

module.exports = function(callback){
	mongodb.connect('mongodb://127.0.0.1:27017/dsm', function (err, db) {
		if (err) {
			throw err
		} else {
			callback(db)
		}
	})
}
