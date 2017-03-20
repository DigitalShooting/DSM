module.exports = function(mysql){
	var verein = {
		info: {},
		vereinID: {
			manschaft: {}
		},
	};


	// get all vereine
	verein.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "verein.name",		// [name, id]
			orderDir: "DESC",
		};

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', verein.id, verein.name, verein.note) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
			name:  "verein.name " + query.orderDir,
			id:    "verein.id "   + query.orderDir,
		};
		if (validOrder[req.query.order] !== undefined){
			query.order = validOrder[req.query.order];
		}

		mysql.query(
			"SELECT *" +
			"FROM verein " +
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

	// new verein
	verein.post = function create(req, res) {
		mysql.query(
			"INSERT INTO verein VALUES() ",
			[],
			function(err, rows) {
				getVerein(rows.insertId, function(rows){
					return res.send(201, rows);
				});
			}
		);
	};



	// get verein count
	verein.info.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			order: "verein.name",		// [name, id]
			orderDir: "DESC",
		};

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', verein.id, verein.name, verein.note) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM verein " +
			"WHERE 1 = 1 " +
			query.searchSQL,
			[],
			function(err, rows) {
				return res.send(201, rows[0]);
			}
		);
	};




	// get verein with id
	verein.vereinID.get = function create(req, res) {
		getVerein(req.params.vereinID, function(rows){
			return res.send(201, rows);
		});
	};

	// edit verein
	verein.vereinID.post = function create(req, res) {
		mysql.query(
			"UPDATE verein " +
			"SET verein.name = ?, verein.note = ?" +
			"WHERE verein.id = ?; ",
			[req.body.name, req.body.note, req.params.vereinID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete verein
	verein.vereinID.del = function create(req, res) {
		mysql.query(
			"DELETE FROM verein " +
			"WHERE verein.id = ?; ",
			[req.params.vereinID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};



	// Helper
	function getVerein(id, callback){
		mysql.query(
			"SELECT verein.id, verein.name, verein.note " +
			"FROM verein " +
			"WHERE verein.id = ? ",
			[id],
			function(err, rows) {
				callback(rows[0]);
			}
		);
	}





	// get all manschaften
	verein.vereinID.manschaft.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "manschaft.name",		// [name, id]
			orderDir: "DESC",
		};

		if (req.query.search !== undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', manschaft.name, manschaft.id, manschaft.note, manschaft.anzahlSchuetzen, manschaft.vereinID, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
			verein:  "verein.name "    + query.orderDir,
			name:    "manschaft.name " + query.orderDir,
			id:      "manschaft.id "   + query.orderDir,
		};
		if (validOrder[req.query.order] !== undefined){
			query.order = validOrder[req.query.order];
		}

		mysql.query(
			"SELECT manschaft.name, manschaft.id, manschaft.note, manschaft.anzahlSchuetzen, manschaft.vereinID, verein.name as 'verein' " +
			"FROM manschaft " +
			"LEFT JOIN verein ON manschaft.vereinID = verein.id " +
			"WHERE manschaft.vereinID = ? " +
			query.searchSQL +
			"ORDER BY " + query.order + " " +
			"LIMIT ? OFFSET ? ",
			[req.params.vereinID, query.limit, query.limit*query.page],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
	};



	return verein;
};
