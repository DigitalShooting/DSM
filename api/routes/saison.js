module.exports = function(mysql, config){
	var saison = {
		info: {},
		id: {},
	};


	// get all saisons
	saison.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			limit: 10,
			page: 0,
			order: "saison.name",		// [name, id]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', saison.id, saison.name, saison.note) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
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
			query.orderDir = req.query.orderDir
		}

		var validOrder = {
			name:  "saison.name " + query.orderDir,
			id:    "saison.id "   + query.orderDir,
		};
		if (validOrder[req.query.order] != undefined){
			query.order = validOrder[req.query.order]
		}

		mysql.query(
			"SELECT *" +
			"FROM saison " +
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

	// new saison
	saison.post = function create(req, res, next) {
		mysql.query(
			"INSERT INTO saison VALUES() ",
			[],
			function(err, rows, fields) {
				getSaison(rows.insertId, function(rows){
					return res.send(201, rows);
				})
			}
		);
	}



	// get saison count
	saison.info.get = function create(req, res, next) {
		var query = {
			searchSQL: "", // search
			order: "saison.name",		// [name, id]
			orderDir: "DESC",
		}

		if (req.query.search != undefined){
			var strings = req.query.search.split(" ");
			var sql = ""
			for (i in strings){
				sql += "AND CONCAT_WS('|', saison.id, saison.name, saison.note) LIKE "+mysql.escape("%"+strings[i]+"%")+" COLLATE utf8_general_ci ";
			}
			query.searchSQL = sql;
		}

		mysql.query(
			"SELECT COUNT(*) as count " +
			"FROM saison " +
			"WHERE 1 = 1 " +
			query.searchSQL,
			[query.search],
			function(err, rows, fields) {
				return res.send(201, rows[0]);
			}
		);
	}




	// get saison with id
	saison.id.get = function create(req, res, next) {
		getSaison(req.params.id, function(rows){
			return res.send(201, rows);
		})
	}

	// edit saison
	saison.id.post = function create(req, res, next) {
		mysql.query(
			"UPDATE saison " +
			"SET saison.name = ?, saison.note = ?" +
			"WHERE saison.id = ?; ",
			[req.body.name, req.body.note, req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}

	// delete saison
	saison.id.del = function create(req, res, next) {
		mysql.query(
			"DELETE FROM saison " +
			"WHERE saison.id = ?; ",
			[req.params.id],
			function(err, rows, fields) {
				return res.send(201, rows);
			}
		);
		res.send(201, {});
	}



	// Helper
	function getSaison(id, callback){
		mysql.query(
			"SELECT saison.id, saison.name, saison.note " +
			"FROM saison " +
			"WHERE saison.id = ? ",
			[id],
			function(err, rows, fields) {
				callback(rows[0]);
			}
		);
	}


	return saison;
};