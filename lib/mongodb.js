var MongoClient = require("mongodb").MongoClient;

var config = require("../config/");



module.exports = function(callback){
	MongoClient.connect(config.database.mongodb.url, function(err, db) {
		if (err){
			console.log("[ERROR] MongoDB not connected ("+err+")");
		}
		console.log("[INFO] MongoDB connected");

		var collection = db.collection(config.database.mongodb.collection);
		callback(collection);
	});
};
