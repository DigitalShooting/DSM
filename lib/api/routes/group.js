var async = require("async");

module.exports = function(mysql, config){
	var group = {
		info: {},
		groupID: {
			sessions: {
				sessionID: {
					shots: {},
				},
			},
		},
	};


	// Get all groups
	group.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "sessionGroup.unixtime",		// [lastName, firstName, verein, id, passnummer, vereinID]
			orderDir: "DESC",
		};

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, sessionGroup.note, user.firstName, user.lastName, user.note, verein.name, verein.id) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL += sql;
		}

		if (req.query.limit != undefined){
			query.limit = parseInt(req.query.limit);
		}

		if (req.query.page != undefined){
			query.page = parseInt(req.query.page);
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir;
		}

		var validOrder = {
			lastName:       "user.lastName "   + query.orderDir   + ", user.firstName " + query.orderDir,
			firstName:      "user.firstName "  + query.orderDir   + ", user.lastName "  + query.orderDir,
			verein:         "verein.name "     + query.orderDir,
			id:             "sessionGroup.id "    + query.orderDir,
			line:           "sessionGroup.line "  + query.orderDir,
			unixtime:       "sessionGroup.unixtime "  + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order];
		}

		mysql.query(
			"SELECT sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, sessionGroup.note, user.firstName, user.lastName, user.id as 'userID', verein.name as 'verein', verein.id as 'vereinID'" +
			"FROM sessionGroup " +
			"LEFT JOIN user ON user.id = sessionGroup.userID " +
			"LEFT JOIN verein ON verein.id = user.vereinID " +
			"WHERE 1 = 1 " +
			query.searchSQL +
			"ORDER BY " + query.order + " " +
			"LIMIT ? OFFSET ? ",
			[query.limit, query.limit*query.page],
			function(err, rows, fields) {
				for (var i in rows){
					var sessionGroup = rows[i];
					var disziplin = config.disziplinen.all[sessionGroup.disziplin];
					sessionGroup.disziplinTitle = disziplin.title;
					sessionGroup.scheibeTitle = disziplin.scheibe.title;
					for (var i in config.lines){
						var line = config.lines[i];
						if (line._id == sessionGroup.line){
							sessionGroup.lineTitle = line.label;
							break;
						}
					}
				}
				return res.send(201, rows);
			}
		);
	};

	// New user
	// user.post = function create(req, res, next) {
	// 	mysql.query(
	// 		"INSERT INTO user VALUES() ",
	// 		[],
	// 		function(err, rows, fields) {
	// 			getGroup(rows.insertId, function(rows){
	// 				return res.send(201, rows);
	// 			})
	// 		}
	// 	);
	// }



	// Get group count
	group.info.get = function create(req, res) {
		var query = {
			searchSQL: "",
		};

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, sessionGroup.note, user.firstName, user.lastName, user.note, verein.name, verein.id) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM sessionGroup " +
			"LEFT JOIN user ON user.id = sessionGroup.userID " +
			"LEFT JOIN verein ON verein.id = user.vereinID " +
			"WHERE 1 = 1 " +
			query.searchSQL,
			[],
			function(err, rows, fields) {
				return res.send(201, rows[0]);
			}
		);
	};




	// Get group with id
	group.groupID.get = function create(req, res) {
		getGroup(req.params.groupID, function(rows){
			return res.send(201, rows);
		});
	};


	// edit group
	group.groupID.post = function create(req, res) {
		console.log(req.body)
		mysql.query(
			"UPDATE sessionGroup " +
			"SET sessionGroup.userID = ?, sessionGroup.note = ? " +
			"WHERE sessionGroup.id = ?; ",
			[req.body.userID, req.body.note, req.params.groupID],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete user
	// group.groupID.del = function create(req, res, next) {
	// 	mysql.query(
	// 		"DELETE FROM user " +
	// 		"WHERE user.id = ?; ",
	// 		[req.params.userID],
	// 		function(err, rows, fields) {
	// 			return res.send(201, rows);
	// 		}
	// 	);
	// 	res.send(201, {});
	// }



	// Helper
	function getGroup(id, callback){
		mysql.query(
			"SELECT sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, sessionGroup.note, user.firstName, user.lastName, user.id as 'userID', verein.name as 'verein', verein.id as 'vereinID' " +
			"FROM sessionGroup " +
			"LEFT JOIN user ON user.id = sessionGroup.userID " +
			"LEFT JOIN verein ON verein.id = user.vereinID " +
			"WHERE sessionGroup.id = ? ",
			[id],
			function(err, rows, fields) {
				var sessionGroup = rows[0];
				var disziplin = config.disziplinen.all[sessionGroup.disziplin];
				sessionGroup.disziplinTitle = disziplin.title;
				sessionGroup.scheibeTitle = disziplin.scheibe.title;
				for (var i in config.lines){
					var line = config.lines[i];
					if (line._id == sessionGroup.line){
						sessionGroup.lineTitle = line.label;
						break;
					}
				}
				callback(sessionGroup);
			}
		);
	}













	// Get sessions from group with id
	group.groupID.sessions.get = function create(req, res) {
		mysql.query(
			"SELECT session.id, session.sessionGroupID, session.part, session.unixtime " +
			"FROM session " +
			"WHERE session.sessionGroupID = ? ",
			[req.params.groupID],
			function(err, rows, fields) {
				async.map(rows, function(session, mainCallback){
					async.parallel({
						shots: function(callback){
							getShots(session.id, function(shots){
								callback(null, shots);
							});
						},
						info: function(callback){
							getSum(session.id, function(info){
								callback(null, info);
							});
						}
					},
					function(err, results){
						session.shots = results.shots;
						session.sum = results.info.sum;
						session.avg = results.info.avg;
						mainCallback(err, session);
					});
				}, function(err, results){
					return res.send(201, results);
				});
			}
		);
	}


	// Get session from group with id
	group.groupID.sessions.sessionID.get = function create(req, res) {
		mysql.query(
			"SELECT session.id, session.sessionGroupID, session.part, session.unixtime " +
			"FROM session " +
			"WHERE session.id = ? ",
			[req.params.sessionID],
			function(err, rows, fields) {
				if (rows.length > 0){
					var session = rows[0];
					async.parallel({
						shots: function(callback){
							getShots(session.id, function(shots){
								callback(null, shots);
							});
						},
						info: function(callback){
							getSum(session.id, function(info){
								callback(null, info);
							});
						}
					},
					function(err, results){
						session.shots = results.shots;
						session.sum = results.info.sum
						session.avg = results.info.avg
						return res.send(201, session);
					});
				}
				else {
					return res.send(201, {});
				}
			}
		);
	}

	// Get shots from session with id
	function getShots(sessionID, callback) {
		mysql.query(
			"SELECT shot.* " +
			"FROM shot " +
			"WHERE shot.sessionID = ? " +
			"ORDER BY shot.number ",
			[sessionID],
			function(err, rows, fields) {
				callback(rows);
			}
		);
	}
	// Get shots from session with id
	function getSum(sessionID, callback) {
		mysql.query(
			"SELECT SUM(shot.ringValue) as 'sum', ROUND(AVG(shot.ringValue), 1) as 'avg' " +
			"FROM shot " +
			"WHERE shot.sessionID = ? ",
			[sessionID],
			function(err, rows, fields) {
				callback(rows[0]);
			}
		);
	}



	return group;
};
