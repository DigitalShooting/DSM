module.exports = function(collection){
	var sessions = {
		info: {},
	};



	// get all rwks
	sessions.get = function create(req, res) {
		var limit = 10;
		if (req.query.limit !== undefined) {
			limit = parseInt(req.query.limit);
		}

		var page = 0;
		if (req.query.page !== undefined) {
			page = parseInt(req.query.page);
		}

		collection.find({$or:[
	    {"disziplin._id": "lg_gauKoenig"},
	    {"disziplin._id": "lp_gauKoenig"}
	  ]}).sort({date:-1}).limit(limit).skip(page*limit).toArray(function (err, data) {
			if (err){
				console.log(err);
			}
			return res.send(201, data);
		});
	};



	// get rwk count
	sessions.info.get = function create(req, res) {
		collection.find().sort({date:-1}).count(function (err, count) {
			return res.send(201, count);
		});
	};



	return sessions;
};
