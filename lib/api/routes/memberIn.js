module.exports = function(mysql, config){
	var memberIn = {
		info: {},
		id: {
			rwk: {
				id: {},
			},
		},
		rwk: {
			id: {},
		},
	};


	// get all memberIn
	memberIn.get = function create(req, res, next) {
		var query = {
			order: "user.firstName",		// [firtName, lastName, manschaftID, userID]
			orderDir: "DESC",
			searchSQL: "",
		}

		if (req.query.equals_manschaftID != undefined){
			query.searchSQL += "AND memberIn.manschaftID = " + mysql.escape(req.query.equals_manschaftID) + " ";
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir
		}

		var validOrder = {
			firstName:    "user.firstName "       + query.orderDir,
			lastName:     "user.lastName "        + query.orderDir,
			manschaftID:  "memberIn.manschaftID " + query.orderDir,
			userID:       "memberIn.userID "      + query.orderDir,
			stamm:        "memberIn.stamm "       + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order]
		}

		mysql.query(
			"SELECT memberIn.id, memberIn.stamm, memberIn.userID, memberIn.manschaftID, user.firstName as 'firstName', user.lastName as 'lastName' " +
			"FROM memberIn " +
			"LEFT JOIN user ON user.id = memberIn.userID " +
			"WHERE 1 = 1 " +
			query.searchSQL + " " +
			"ORDER BY " + query.order + " ",
			[],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}

	// new memberIn
	memberIn.post = function create(req, res, next) {
		mysql.query(
			"DELETE FROM memberIn " +
			"WHERE memberIn.userID = 0 AND memberIn.manschaftID = 0; ",
			function(err, rows, fields) {
				mysql.query(
					"INSERT INTO memberIn VALUES() ",
					[],
					function(err, rows, fields) {
						getMemberIn(rows.insertId, function(row){
							return res.send(201, row);
						})
					}
				);
			}
		);
	}




	// get memberIn with id
	memberIn.id.get = function create(req, res, next) {
		getMemberIn(req.params.id, function(row){
			return res.send(201, row);
		})
	}

	// edit memberIn
	memberIn.id.post = function create(req, res, next) {
		mysql.query(
			"UPDATE memberIn " +
			"SET memberIn.userID = ?, memberIn.manschaftID = ?, memberIn.stamm = ? " +
			"WHERE memberIn.id = ?; ",
			[req.body.userID, req.body.manschaftID, req.body.stamm, req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}

	// delete memberIn
	memberIn.id.del = function create(req, res, next) {
		mysql.query(
			"DELETE FROM memberIn " +
			"WHERE memberIn.id = ?; ",
			[req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}



	// Helper
	function getMemberIn(id, callback){
		mysql.query(
			"SELECT memberIn.id, memberIn.stamm, memberIn.userID, memberIn.manschaftID, user.firstName as 'firstName', user.lastName as 'lastName' " +
			"FROM memberIn " +
			"LEFT JOIN user ON user.id = memberIn.userID " +
			"WHERE memberIn.id = ? ",
			[id],
			function(err, rows, fields) {
				callback(rows[0]);
			}
		);
	}















	// get all memberIn
	memberIn.rwk.id.get = function create(req, res, next) {
		var query = {
			order: "user.firstName",		// [firtName, lastName, manschaftID, userID]
			orderDir: "DESC",
			searchSQL: "",
		}

		if (req.query.equals_manschaftID != undefined){
			query.searchSQL += "AND memberIn.manschaftID = " + mysql.escape(req.query.equals_manschaftID) + " ";
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir
		}

		var validOrder = {
			firstName:    "user.firstName "       + query.orderDir,
			lastName:     "user.lastName "        + query.orderDir,
			manschaftID:  "memberIn.manschaftID " + query.orderDir,
			userID:       "memberIn.userID "      + query.orderDir,
			stamm:        "memberIn.stamm "       + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order]
		}

		mysql.query(
			"SELECT memberIn.id, memberIn.stamm, memberIn.userID, memberIn.manschaftID, user.firstName as 'firstName', user.lastName as 'lastName', "+
			"CASE ("+
				"SELECT shotIn.ersatz "+
				"FROM shotIn "+
				"WHERE shotIn.memberID = memberIn.id "+
				"AND shotIn.rwkID = ? "+
				"LIMIT 1"+
			") "+
			"WHEN 0 THEN 'member' " +
			"WHEN 1 THEN 'ersatz' " +
			"ELSE "+
				"CASE memberIn.stamm WHEN 1 THEN 'member' ELSE '' END "+
			" END as 'part' " +
			"FROM memberIn " +
			"LEFT JOIN user ON user.id = memberIn.userID " +
			"WHERE 1 = 1 " +
			query.searchSQL + " " +
			"ORDER BY " + query.order + " ",
			[req.params.rwkID],
			function(err, rows, fields) {
				console.log(err)
				return res.send(201, rows);
			}
		);
	}

	// new memberIn
	memberIn.rwk.id.post = function create(req, res, next) {
		mysql.query(
			"DELETE FROM memberIn " +
			"WHERE memberIn.userID = 0 AND memberIn.manschaftID = 0; ",
			function(err, rows, fields) {
				mysql.query(
					"INSERT INTO memberIn VALUES() ",
					[],
					function(err, rows, fields) {
						getMemberIn(rows.insertId, function(row){
							return res.send(201, row);
						})
					}
				);
			}
		);
	}




	// get memberIn with id
	memberIn.id.rwk.id.get = function create(req, res, next) {
		getMemberIn(req.params.id, function(row){
			return res.send(201, row);
		})
	}

	// edit memberIn
	memberIn.id.rwk.id.post = function create(req, res, next) {
		mysql.query(
			"UPDATE memberIn " +
			"SET memberIn.userID = ?, memberIn.manschaftID = ?, memberIn.stamm = ? " +
			"WHERE memberIn.id = ?; ",
			[req.body.userID, req.body.manschaftID, req.body.stamm, req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}

	// delete memberIn
	memberIn.id.rwk.id.del = function create(req, res, next) {
		mysql.query(
			"DELETE FROM memberIn " +
			"WHERE memberIn.id = ?; ",
			[req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}












	return memberIn;
};
