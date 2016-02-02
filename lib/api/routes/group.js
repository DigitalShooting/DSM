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
	group.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "sessionGroup.unixtime",		// [lastName, firstName, verein, id, passnummer, vereinID]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, user.firstName, user.lastName, user.note, verein.name, verein.id) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
			query.orderDir = req.query.orderDir
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
			query.order = validOrder[req.query.order]
		}

		mysql.query(
			"SELECT sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, user.firstName, user.lastName, verein.name as 'verein', verein.id as 'vereinID'" +
			"FROM sessionGroup " +
			"LEFT JOIN user ON user.id = sessionGroup.userID " +
			"LEFT JOIN verein ON verein.id = user.vereinID " +
			"WHERE 1 = 1 " +
			query.searchSQL +
			"ORDER BY " + query.order + " " +
			"LIMIT ? OFFSET ? ",
			[query.limit, query.limit*query.page],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}

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
	group.info.get = function create(req, res, next) {
		var query = {
			searchSQL: "",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, user.firstName, user.lastName, user.note, verein.name, verein.id) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
	}




	// Get group with id
	group.groupID.get = function create(req, res, next) {
		getGroup(req.params.groupID, function(rows){
			return res.send(201, rows);
		})
	}


	// edit group
	group.groupID.post = function create(req, res, next) {
		mysql.query(
			"UPDATE sessionGroup " +
			"SET sessionGroup.userID = ? " +
			"WHERE sessionGroup.id = ?; ",
			[req.body.userID, req.params.groupID],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}

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
			"SELECT sessionGroup.id, sessionGroup.unixtime, sessionGroup.line, sessionGroup.disziplin, user.firstName, user.lastName, verein.name as 'verein', verein.id as 'vereinID' " +
			"FROM sessionGroup " +
			"LEFT JOIN user ON user.id = sessionGroup.userID " +
			"LEFT JOIN verein ON verein.id = user.vereinID " +
			"WHERE sessionGroup.id = ? ",
			[id],
			function(err, rows, fields) {
				console.log(err, rows, parseInt(id))
				callback(rows[0]);
			}
		);
	}













	// Get sessions from group with id
	group.groupID.sessions.get = function create(req, res, next) {
		mysql.query(
			"SELECT session.id, session.sessionGroupID, session.part, session.unixtime " +
			"FROM session " +
			"WHERE session.sessionGroupID = ? ",
			[req.params.groupID],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}


	// Get session from group with id
	group.groupID.sessions.sessionID.get = function create(req, res, next) {
		mysql.query(
			"SELECT session.id, session.sessionGroupID, session.part, session.unixtime " +
			"FROM session " +
			"WHERE session.sessionGroupID = ? AND session.id = ? ",
			[req.params.groupID, req.params.sessionID],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}

	// Get shots from session with id
	group.groupID.sessions.sessionID.shots.get = function create(req, res, next) {
		mysql.query(
			"SELECT shot.* " +
			"FROM shot " +
			"WHERE shot.sessionID = ? ",
			[req.params.sessionID],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}



	return group;
};
