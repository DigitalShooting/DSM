module.exports = function(mysql){
	var manschaft = {
		info: {},
		manschaftID: {
			member: {
				memberID: {},
			},
		},
	};


	// get all manschaften
	manschaft.get = function create(req, res) {
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

	// new manschaft
	manschaft.post = function create(req, res) {
		mysql.query(
			"INSERT INTO manschaft VALUES() ",
			[],
			function(err, rows) {
				getManschaft(rows.insertId, function(rows){
					return res.send(201, rows);
				});
			}
		);
	};



	// get manschaft count
	manschaft.info.get = function create(req, res) {
		var query = {
			searchSQL: "", // search
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

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM manschaft " +
			"LEFT JOIN verein ON manschaft.vereinID = verein.id " +
			"WHERE 1 = 1 " +
			query.searchSQL,
			[],
			function(err, rows) {
				return res.send(201, rows[0]);
			}
		);
	};




	// get manschaft with id
	manschaft.manschaftID.get = function create(req, res) {
		getManschaft(req.params.manschaftID, function(rows){
			return res.send(201, rows);
		});
	};

	// edit manschaft
	manschaft.manschaftID.post = function create(req, res) {
		mysql.query(
			"UPDATE manschaft " +
			"SET manschaft.name = ?, manschaft.note = ?, manschaft.vereinID = ?, manschaft.anzahlSchuetzen = ? " +
			"WHERE manschaft.id = ?; ",
			[req.body.name, req.body.note, req.body.vereinID, req.body.anzahlSchuetzen, req.params.manschaftID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete manschaft
	manschaft.manschaftID.del = function create(req, res) {
		mysql.query(
			"DELETE FROM manschaft " +
			"WHERE manschaft.id = ?; ",
			[req.params.manschaftID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};



	// Helper
	function getManschaft(id, callback){
		mysql.query(
			"SELECT manschaft.name, manschaft.id, manschaft.note, manschaft.anzahlSchuetzen, manschaft.vereinID, verein.name as 'verein' " +
			"FROM manschaft " +
			"LEFT JOIN verein ON manschaft.vereinID = verein.id " +
			"WHERE manschaft.id = ? ",
			[id],
			function(err, rows) {
				callback(rows[0]);
			}
		);
	}


	return manschaft;
};
