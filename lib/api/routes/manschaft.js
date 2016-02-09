module.exports = function(mysql, config){
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

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', manschaft.name, manschaft.id, manschaft.note, manschaft.saisonID, saison.name, manschaft.vereinID, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
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
			saison:  "saison.name "    + query.orderDir,
			verein:  "verein.name "    + query.orderDir,
			name:    "manschaft.name " + query.orderDir,
			id:      "manschaft.id "   + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order];
		}

		mysql.query(
			"SELECT manschaft.name, manschaft.id, manschaft.note, manschaft.saisonID, saison.name as 'saison', manschaft.vereinID, verein.name as 'verein' " +
			"FROM manschaft " +
			"LEFT JOIN saison ON manschaft.saisonID = saison.id " +
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

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = "";
			for (var i in strings){
				sql += "AND CONCAT_WS('|', manschaft.name, manschaft.id, manschaft.note, manschaft.saisonID, saison.name, manschaft.vereinID, verein.name) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM manschaft " +
			"LEFT JOIN saison ON manschaft.saisonID = saison.id " +
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
			"SET manschaft.name = ?, manschaft.note = ?, manschaft.vereinID = ?, manschaft.saisonID = ? " +
			"WHERE manschaft.id = ?; ",
			[req.body.name, req.body.note, req.body.vereinID, req.body.saisonID, req.params.manschaftID],
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
			"SELECT manschaft.name, manschaft.id, manschaft.note, manschaft.saisonID, saison.name as 'saison', manschaft.vereinID, verein.name as 'verein' " +
			"FROM manschaft " +
			"LEFT JOIN saison ON manschaft.saisonID = saison.id " +
			"LEFT JOIN verein ON manschaft.vereinID = verein.id " +
			"WHERE manschaft.id = ? ",
			[id],
			function(err, rows) {
				callback(rows[0]);
			}
		);
	}














	// get all member in manschaft
	manschaft.manschaftID.member.get = function create(req, res) {
		var query = {
			order: "user.firstName",		// [firtName, lastName, manschaftID, userID]
			orderDir: "DESC",
			searchSQL: "",
		};

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir;
		}

		var validOrder = {
			firstName:    "user.firstName "       + query.orderDir,
			lastName:     "user.lastName "        + query.orderDir,
			manschaftID:  "memberIn.manschaftID " + query.orderDir,
			userID:       "memberIn.userID "      + query.orderDir,
			stamm:        "memberIn.stamm "       + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order];
		}

		mysql.query(
			"SELECT memberIn.id, memberIn.stamm, memberIn.userID, memberIn.manschaftID, user.firstName as 'firstName', user.lastName as 'lastName' " +
			"FROM memberIn " +
			"LEFT JOIN user ON user.id = memberIn.userID " +
			"WHERE memberIn.manschaftID = ? " +
			query.searchSQL + " " +
			"ORDER BY " + query.order + " ",
			[req.params.manschaftID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
	};



	// new member in manschaft
	manschaft.manschaftID.member.post = function create(req, res) {
		mysql.query(
			"DELETE FROM memberIn " +
			"WHERE memberIn.userID = 0 AND memberIn.manschaftID = 0; ",
			function(err, rows) {
				mysql.query(
					"INSERT INTO memberIn VALUES() ",
					[],
					function(err, rows) {
						getMemberIn(rows.insertId, function(row){
							return res.send(201, row);
						});
					}
				);
			}
		);
	};





	// get memberIn with id
	manschaft.manschaftID.member.memberID.get = function create(req, res) {
		getMemberIn(req.params.memberID, function(row){
			return res.send(201, row);
		});
	};

	// edit memberIn
	manschaft.manschaftID.member.memberID.post = function create(req, res) {
		mysql.query(
			"UPDATE memberIn " +
			"SET memberIn.userID = ?, memberIn.manschaftID = ?, memberIn.stamm = ? " +
			"WHERE memberIn.id = ?; ",
			[req.body.userID, req.params.manschaftID, req.body.stamm, req.params.memberID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};

	// delete memberIn
	manschaft.manschaftID.member.memberID.del = function create(req, res) {
		mysql.query(
			"DELETE FROM memberIn " +
			"WHERE memberIn.id = ?; ",
			[req.params.memberID],
			function(err, rows) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	};




	// Helper
	function getMemberIn(id, callback){
		mysql.query(
			"SELECT memberIn.id, memberIn.stamm, memberIn.userID, memberIn.manschaftID, user.firstName as 'firstName', user.lastName as 'lastName' " +
			"FROM memberIn " +
			"LEFT JOIN user ON user.id = memberIn.userID " +
			"WHERE memberIn.id = ? ",
			[id],
			function(err, rows) {
				callback(rows[0]);
			}
		);
	}




	return manschaft;
};
