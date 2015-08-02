var mongodb = require('mongodb').MongoClient
var format = require('util').format

module.exports = function(callback){
	mongodb.connect('mongodb://127.0.0.1:27017/dsm', function (err, db) {
		if (err) {
			throw err
		} else {

			// var collection = db.collection('users')
			// collection.insert({a:2}, function(err, docs) {
			// 	console.log(err)
			// })
			//
			// collection.count(function(err, count) {
			// 	console.log(format("count = %s", count))
			// })
			//
			// collection.find().toArray(function(err, results) {
			// 	console.dir(results)
			// })

			callback(db)

			console.log("successfully connected to the database")
		}
	})

}
