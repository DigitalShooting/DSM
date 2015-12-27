module.exports = function(mysql, config){
	var manschaft = {
		info: {},
		id: {},
	};


	// get all manschaften
	manschaft.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "manschaft.name",		// [name, id]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
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

		var validOrder = {
			saison: "saison.name",
			verein: "verein.name",
			name: "manschaft.name",
			id: "manschaft.id",
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order]
		}

		if (req.query.orderDir == "DESC" || req.query.orderDir == "ASC"){
			query.orderDir = req.query.orderDir
		}

		mysql.query(
			"SELECT manschaft.name, manschaft.id, manschaft.note, manschaft.saisonID, saison.name as 'saison', manschaft.vereinID, verein.name as 'verein' " +
			"FROM manschaft " +
			"LEFT JOIN saison ON manschaft.saisonID = saison.id " +
			"LEFT JOIN verein ON manschaft.vereinID = verein.id " +
			"WHERE 1 = 1 " +
			query.searchSQL +
			"ORDER BY " + query.order + " " + query.orderDir + " " +
			"LIMIT ? OFFSET ? ",
			[query.limit, query.limit*query.page],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
	}

	// new manschaft
	manschaft.post = function create(req, res, next) {
		mysql.query(
			"INSERT INTO manschaft VALUES() ",
			[],
			function(err, rows, fields) {
				getManschaft(rows.insertId, function(rows){
					return res.send(201, rows);
				})
			}
		);
	}



	// get manschaft count
	manschaft.info.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "manschaft.name",		// [name, id]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
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
			[query.search],
			function(err, rows, fields) {
				return res.send(201, rows[0]);
			}
		);
	}




	// get manschaft with id
	manschaft.id.get = function create(req, res, next) {
		getManschaft(req.params.id, function(rows){
			return res.send(201, rows);
		})
	}

	// edit manschaft
	manschaft.id.post = function create(req, res, next) {
		mysql.query(
			"UPDATE manschaft " +
			"SET manschaft.name = ?, manschaft.note = ?, manschaft.vereinID = ?, manschaft.saisonID = ? " +
			"WHERE manschaft.id = ?; ",
			[req.body.name, req.body.note, req.body.vereinID, req.body.saisonID, req.params.id],
			function(err, rows, fields) {

				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}

	// delete manschaft
	manschaft.id.del = function create(req, res, next) {
		mysql.query(
			"DELETE FROM manschaft " +
			"WHERE manschaft.id = ?; ",
			[req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}



	// Helper
	function getManschaft(id, callback){
		mysql.query(
			"SELECT manschaft.name, manschaft.id, manschaft.note, manschaft.saisonID, saison.name as 'saison', manschaft.vereinID, verein.name as 'verein' " +
			"FROM manschaft " +
			"LEFT JOIN saison ON manschaft.saisonID = saison.id " +
			"LEFT JOIN verein ON manschaft.vereinID = verein.id " +
			"WHERE manschaft.id = ? ",
			[id],
			function(err, rows, fields) {
				callback(rows[0]);
			}
		);
	}


	return manschaft;
};
