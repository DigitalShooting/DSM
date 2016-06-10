var mongodb = require("../../mongodb.js");

module.exports = function(mysql, config){
	var rwk = {
		info: {},
		rwkID: {
			member: {
				shotInID: {},
			},
		},
	};

	var collection;
	mongodb(function(dbCollection){
		collection = dbCollection;
	});


	// get all rwks
	rwk.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "rwk.date",		// [date, id]
			orderDir: "DESC",
			done: 0,
		};

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name, gast.name, heimSaison.name, gastSaison.name, heimVerein.name, gastVerein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		if (req.query.limit !== undefined){
			query.limit = parseInt(req.query.limit);
		}

		if (req.query.page !== undefined){
			query.page = parseInt(req.query.page);
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir;
		}

		var validOrder = {
			date:  "rwk.date "        + query.orderDir,
			heim:  "heimVerein.name " + query.orderDir  + ", rwk.manschaftHeim " + query.orderDir  + ", heimSaison.name " + query.orderDir,
			gast:  "gastVerein.name " + query.orderDir  + ", rwk.manschaftGast " + query.orderDir  + ", gastSaison.name " + query.orderDir,
			id:    "rwk.id "          + query.orderDir,
		};
		if (validOrder[req.query.order] !== undefined){
			query.order = validOrder[req.query.order];
		}

		if (req.query.done !== undefined){
			query.done = parseInt(req.query.done);
		}

		mysql.query(
			"SELECT rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.done, " +
				// manschaftID      manschaft name       saison name                      verein name
				"rwk.manschaftHeim, heim.name as 'heim', heimSaison.name as 'heimSaison', heimVerein.name as 'heimVerein', " +
				"rwk.manschaftGast, gast.name as 'gast', gastSaison.name as 'gastSaison', gastVerein.name as 'gastVerein' " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
				"LEFT JOIN saison heimSaison ON heim.saisonID = heimSaison.id " +
				"LEFT JOIN verein heimVerein ON heim.vereinID = heimVerein.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
				"LEFT JOIN saison gastSaison ON gast.saisonID = gastSaison.id " +
				"LEFT JOIN verein gastVerein ON gast.vereinID = gastVerein.id " +
			"WHERE rwk.done = ? " +
			query.searchSQL +
			"ORDER BY " + query.order + " " +
			"LIMIT ? OFFSET ? ",
			[query.done, query.limit, query.limit*query.page],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
	};

	// new rwk
	rwk.post = function create(req, res) {
		mysql.query(
			"INSERT INTO rwk VALUES() ",
			[],
			function(err, rows) {
				getRWK(rows.insertId, function(rows){
					return res.send(201, rows);
				});
			}
		);
	};



	// get rwk count
	rwk.info.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			done: 0,
		};

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.manschaftHeim, rwk.manschaftGast, heim.name, gast.name, heimSaison.name, gastSaison.name, heimVerein.name, gastVerein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		if (req.query.done !== undefined){
			query.done = parseInt(req.query.done);
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
				"LEFT JOIN saison heimSaison ON heim.saisonID = heimSaison.id " +
				"LEFT JOIN verein heimVerein ON heim.vereinID = heimVerein.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
				"LEFT JOIN saison gastSaison ON gast.saisonID = gastSaison.id " +
				"LEFT JOIN verein gastVerein ON gast.vereinID = gastVerein.id " +
			"WHERE rwk.done = ? " +
			query.searchSQL,
			[query.done],
			function(err, rows) {
				return res.send(201, rows[0]);
			}
		);
	};




	// get rwk with id
	rwk.rwkID.get = function create(req, res) {
		getRWK(req.params.rwkID, function(rows){
			return res.send(201, rows);
		});
	};

	// edit rwk
	rwk.rwkID.post = function create(req, res) {
		mysql.query(
			"UPDATE rwk " +
			"SET rwk.date = ?, rwk.note = ?, rwk.manschaftHeim = ?, rwk.manschaftGast = ?, rwk.done = ? " +
			"WHERE rwk.id = ?; ",
			[req.body.date, req.body.note, req.body.manschaftHeim, req.body.manschaftGast, parseInt(req.body.done), req.params.rwkID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete rwk
	rwk.rwkID.del = function create(req, res) {
		mysql.query(
			"DELETE FROM rwk " +
			"WHERE rwk.id = ?; ",
			[req.params.rwkID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};



	// Helper
	function getRWK(id, callback){
		mysql.query(
			"SELECT rwk.id, rwk.date, rwk.saisonID, rwk.note, rwk.done, " +
				// manschaftID      manschaft name       saison name                      verein name
				"rwk.manschaftHeim, heim.name as 'heim', heimSaison.name as 'heimSaison', heimSaison.disziplinID as 'heimSaisonDisziplinID', heimVerein.name as 'heimVerein', " +
				"rwk.manschaftGast, gast.name as 'gast', gastSaison.name as 'gastSaison', gastSaison.disziplinID as 'gastSaisonDisziplinID', gastVerein.name as 'gastVerein' " +
			"FROM rwk " +
			"LEFT JOIN manschaft heim ON rwk.manschaftHeim = heim.id " +
				"LEFT JOIN saison heimSaison ON heim.saisonID = heimSaison.id " +
				"LEFT JOIN verein heimVerein ON heim.vereinID = heimVerein.id " +
			"LEFT JOIN manschaft gast ON rwk.manschaftGast = gast.id " +
				"LEFT JOIN saison gastSaison ON gast.saisonID = gastSaison.id " +
				"LEFT JOIN verein gastVerein ON gast.vereinID = gastVerein.id " +
			"WHERE rwk.id = ? ",
			[id],
			function(err, rows) {
				callback(rows[0]);
			}
		);
	}










	rwk.rwkID.member.get = function create(req, res) {
		var query = {
			order: "user.firstName",		// [date, id]
			orderDir: "DESC",
			results: "false",
		};

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir;
		}

		var validOrder = {
			firstName:  "user.firstName "  + query.orderDir,
			lastName:   "user.lastName "   + query.orderDir,
			ersatz:     "shotIn.ersatz "   + query.orderDir + ", user.lastName "   + query.orderDir,
			id:         "shotIn.id "       + query.orderDir,
		};
		if (validOrder[req.query.order] !== undefined){
			query.order = validOrder[req.query.order];
		}

		if (req.query.results == "true"){
			query.results = "true";
		}

		var typeQuery = "";
		if (req.query.type == "gast") {
			typeQuery = "AND shotIn.gast = 1 ";
		}
		else if (req.query.type == "heim") {
			typeQuery = "AND shotIn.gast = 0 ";
		}

		mysql.query(
			"SELECT shotIn.id, shotIn.ersatz, shotIn.userID, shotIn.rwkID, shotIn.gast, shotIn.dataID, user.firstName as 'firstName', user.lastName as 'lastName', verein.name as 'verein', "+
			"CASE shotIn.gast WHEN 0 THEN (SELECT manschaft.name from manschaft where manschaft.id = rwk.manschaftHeim) WHEN 1 THEN (SELECT manschaft.name from manschaft where manschaft.id = rwk.manschaftGast) ELSE NULL END as 'manschaft' " +
			"FROM shotIn " +
			"RIGHT JOIN user ON user.id = shotIn.userID " +
			"LEFT JOIN verein ON user.vereinID = verein.id " +
			"JOIN rwk ON shotIn.rwkID = rwk.id " +
			"WHERE shotIn.rwkID = ? " +
			typeQuery +
			"ORDER BY " + query.order + " ",
			[req.params.rwkID],
			function(err, rows) {
				if (query.results == "true"){
					var ids = [];
					for (var i in rows){
						ids.push({"_id": rows[i].dataID});
					}
					collection.find({
						$or: ids,
					}).toArray(function (err, data) {
						if (err){
							console.log(err);
						}

						for (i in data){
							var singleData = data[i];
							for (var j in rows){
								if (rows[j].dataID == singleData._id){
									rows[j].data = singleData;
								}
							}
						}
						res.send(201, rows);
					});
				}
				else {
					res.send(201, rows);
				}
			}
		);
	};

	rwk.rwkID.member.post = function create(req, res) {
		newShotIn(req.params.rwkID, function(rows){
			res.send(201, rows);
		});
	};




	// get memberIn with id
	rwk.rwkID.member.shotInID.get = function create(req, res) {
		getShot(req.params.shotInID, function(row){
			return res.send(201, row);
		});
	};

	// edit memberIn
	rwk.rwkID.member.shotInID.post = function create(req, res) {
		mysql.query(
			"UPDATE shotIn " +
			"SET shotIn.userID = ?, shotIn.rwkID = ?, shotIn.gast = ?, shotIn.ersatz = ?, shotIn.dataID = ? " +
			"WHERE shotIn.id = ?; ",
			[req.body.userID, req.body.rwkID, req.body.gast, req.body.ersatz, req.body.dataID, req.params.shotInID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete memberIn
	rwk.rwkID.member.shotInID.del = function create(req, res) {
		mysql.query(
			"DELETE FROM shotIn " +
			"WHERE shotIn.id = ?; ",
			[req.params.shotInID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};


	function newShotIn(rwkID, callback) {
		mysql.query(
			"DELETE FROM shotIn " +
			"WHERE shotIn.userID = 0 AND shotIn.rwkID = ?; ",
			[rwkID],
			function(err, rows) {
				mysql.query(
					"INSERT INTO shotIn (rwkID) VALUES(?) ",
					[rwkID],
					function(err, rows) {
						getShot(rows.insertId, callback);
					}
				);
			}
		);
	}


	function getShot(id, callback) {
		mysql.query(
			"SELECT shotIn.id, shotIn.ersatz, shotIn.userID, shotIn.rwkID, shotIn.gast, shotIn.dataID, user.firstName as 'firstName', user.lastName as 'lastName', verein.name as 'verein', "+
			"CASE shotIn.gast WHEN 0 THEN (SELECT manschaft.name from manschaft where manschaft.id = rwk.manschaftHeim) WHEN 1 THEN (SELECT manschaft.name from manschaft where manschaft.id = rwk.manschaftGast) ELSE NULL END as 'manschaft' " +
			"FROM shotIn " +
			"LEFT JOIN user ON user.id = shotIn.userID " +
			"LEFT JOIN verein ON user.vereinID = verein.id " +
			"JOIN rwk ON shotIn.rwkID = rwk.id " +
			"WHERE shotIn.id = ? ",
			[id],
			function(err, rows) {
				return callback(rows[0]);
			}
		);
	}







	return rwk;
};
