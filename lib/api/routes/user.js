module.exports = function(mysql){
	var user = {
		info: {},
		userID: {},
	};


	// Get all users
	user.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "user.lastName",		// [lastName, firstName, verein, id, passnummer, vereinID]
			orderDir: "DESC",
		};

		if (req.query.equals_vereinID !== undefined){
			query.searchSQL += "AND user.vereinID = " + mysql.escape(req.query.equals_vereinID) + " ";
		}

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL += sql;
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
			lastName:    "user.lastName "   + query.orderDir   + ", user.firstName " + query.orderDir,
			firstName:   "user.firstName "  + query.orderDir   + ", user.lastName "  + query.orderDir,
			verein:      "verein.name "     + query.orderDir,
			id:          "user.id "         + query.orderDir,
			passnummer:  "user.passnummer " + query.orderDir,
			vereinID:    "verein.id "       + query.orderDir,
		};
		if (validOrder[req.query.order] !== undefined){
			query.order = validOrder[req.query.order];
		}

		mysql.query(
			"SELECT user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name as 'verein'" +
			"FROM user " +
			"LEFT JOIN verein ON user.vereinID = verein.id " +
			"WHERE 1 = 1 " +
			query.searchSQL +
			"ORDER BY " + query.order + " " +
			"LIMIT ? OFFSET ? ",
			[query.limit, query.limit*query.page],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
	};

	// New user
	user.post = function create(req, res) {
		mysql.query(
			"INSERT INTO user VALUES() ",
			[],
			function(err, rows) {
				getUser(rows.insertId, function(rows){
					return res.send(201, rows);
				});
			}
		);
	};



	// Get user count
	user.info.get = function create(req, res) {
		var query = {
			searchSQL: "",
		};

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM user " +
			"LEFT JOIN verein ON user.vereinID = verein.id " +
			"WHERE 1 = 1 " +
			query.searchSQL,
			[],
			function(err, rows) {
				return res.send(201, rows[0]);
			}
		);
	};




	// Get user with id
	user.userID.get = function create(req, res) {
		getUser(req.params.userID, function(rows){
			return res.send(201, rows);
		});
	};

	// edit user
	user.userID.post = function create(req, res) {
		mysql.query(
			"UPDATE user " +
			"SET user.lastName = ?, user.firstName = ?, user.vereinID = ?, user.note = ?, user.passnummer = ?, user.vereinID = ? " +
			"WHERE user.id = ?; ",
			[req.body.lastName, req.body.firstName, req.body.vereinID, req.body.note, req.body.passnummer, req.body.vereinID, req.params.userID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete user
	user.userID.del = function create(req, res) {
		mysql.query(
			"DELETE FROM user " +
			"WHERE user.id = ?; ",
			[req.params.userID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};



	// Helper
	function getUser(id, callback){
		mysql.query(
			"SELECT user.lastName, user.firstName, user.id, user.vereinID, user.note, user.passnummer, verein.name as 'verein' " +
			"FROM user " +
			"LEFT JOIN verein ON user.vereinID = verein.id " +
			"WHERE user.id = ? ",
			[id],
			function(err, rows) {
				callback(rows[0]);
			}
		);
	}


	return user;
};
