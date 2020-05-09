var MongoClient = require("mongodb").MongoClient;

var config = require("../config/");



module.exports = function(callback){
	const client = new MongoClient(config.database.mongodb.url)
	client.connect(function(err) {
		if (err){
			console.log("[ERROR] MongoDB not connected ("+err+")");
		}
		console.log("[INFO] MongoDB connected");

		const db = client.db(config.database.mongodb.db);
		var collection = db.collection(config.database.mongodb.collection);
		callback(collection);
	});
};
